// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "./FHESecurityLayer.sol";
import "./ConfidentialExchange.sol";

/**
 * @title CryptoFund Nexus
 * @dev Advanced privacy-preserving fundraising platform with confidential DEX integration
 * @author CryptoFund Nexus Team
 */
contract CryptoFundNexus is ReentrancyGuard, AccessControl, Pausable {
    using SafeERC20 for IERC20;

    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant PROJECT_CREATOR_ROLE = keccak256("PROJECT_CREATOR_ROLE");
    bytes32 public constant VERIFIER_ROLE = keccak256("VERIFIER_ROLE");

    FHESecurityLayer public immutable fheLayer;
    ConfidentialExchange public immutable confidentialDEX;

    enum ProjectStatus {
        DRAFT,
        ACTIVE,
        FUNDED,
        CANCELLED,
        COMPLETED,
        REFUNDING
    }

    enum ProjectTier {
        BRONZE,
        SILVER,
        GOLD,
        PLATINUM,
        DIAMOND
    }

    struct FundingConfig {
        uint256 softCap;
        uint256 hardCap;
        uint256 minInvestment;
        uint256 maxInvestment;
        uint256 startTime;
        uint256 endTime;
        uint256 tokenPrice;
        uint256 vestingDuration;
        bool hasWhitelist;
    }

    struct ProjectMetadata {
        string name;
        string description;
        string website;
        string whitepaper;
        string logoHash;
        address tokenAddress;
        address creator;
        ProjectTier tier;
        uint256 reputationScore;
        bool isVerified;
        bool isAudited;
    }

    struct FundingState {
        uint256 totalRaised;
        uint256 totalInvestors;
        uint256 tokensClaimed;
        uint256 lastUpdateTime;
        bool emergencyStop;
    }

    struct CampaignData {
        uint256 projectId;
        ProjectMetadata metadata;
        FundingConfig config;
        FundingState state;
        ProjectStatus status;
    }

    mapping(uint256 => CampaignData) public campaigns;
    mapping(uint256 => mapping(address => bytes32)) public encryptedInvestments;
    mapping(uint256 => mapping(address => bool)) public hasInvested;
    mapping(uint256 => mapping(address => uint256)) public vestingSchedules;
    mapping(uint256 => address[]) public projectInvestors;
    mapping(address => uint256[]) public userProjects;
    mapping(uint256 => mapping(address => bool)) public whitelistedInvestors;

    uint256 private _projectCounter;
    uint256 public platformFeeRate = 250; // 2.5%
    uint256 public constant MAX_FEE_RATE = 1000; // 10%
    address public feeCollector;
    
    // Enhanced analytics
    mapping(uint256 => uint256) public projectViews;
    mapping(uint256 => uint256) public projectShares;
    mapping(address => uint256) public userReputationScores;

    event ProjectCreated(
        uint256 indexed projectId,
        address indexed creator,
        string name,
        uint256 softCap,
        uint256 hardCap,
        ProjectTier tier
    );

    event ConfidentialInvestmentMade(
        uint256 indexed projectId,
        address indexed investor,
        bytes32 encryptedAmount,
        uint256 timestamp
    );

    event ProjectFunded(
        uint256 indexed projectId,
        uint256 totalRaised,
        uint256 totalInvestors
    );

    event TokensClaimed(
        uint256 indexed projectId,
        address indexed investor,
        uint256 amount
    );

    event ProjectStatusChanged(
        uint256 indexed projectId,
        ProjectStatus oldStatus,
        ProjectStatus newStatus
    );

    event EmergencyRefundInitiated(
        uint256 indexed projectId,
        string reason
    );

    event ProjectVerificationUpdated(
        uint256 indexed projectId,
        bool isVerified,
        bool isAudited,
        ProjectTier newTier
    );

    constructor(
        address _fheLayer,
        address _confidentialDEX,
        address _feeCollector
    ) {
        fheLayer = FHESecurityLayer(_fheLayer);
        confidentialDEX = ConfidentialExchange(_confidentialDEX);
        feeCollector = _feeCollector;

        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(ADMIN_ROLE, msg.sender);
        _grantRole(VERIFIER_ROLE, msg.sender);
    }

    modifier onlyProjectCreator(uint256 projectId) {
        require(
            campaigns[projectId].metadata.creator == msg.sender,
            "CryptoFundNexus: Not project creator"
        );
        _;
    }

    modifier projectExists(uint256 projectId) {
        require(projectId <= _projectCounter && projectId > 0, "CryptoFundNexus: Project does not exist");
        _;
    }

    modifier projectActive(uint256 projectId) {
        require(
            campaigns[projectId].status == ProjectStatus.ACTIVE,
            "CryptoFundNexus: Project not active"
        );
        _;
    }

    function createProject(
        ProjectMetadata calldata metadata,
        FundingConfig calldata config
    ) external whenNotPaused nonReentrant returns (uint256) {
        require(bytes(metadata.name).length > 0, "CryptoFundNexus: Name required");
        require(config.softCap > 0, "CryptoFundNexus: Soft cap must be positive");
        require(config.hardCap >= config.softCap, "CryptoFundNexus: Invalid cap configuration");
        require(config.endTime > block.timestamp, "CryptoFundNexus: Invalid end time");
        require(config.startTime < config.endTime, "CryptoFundNexus: Invalid time range");
        require(metadata.tokenAddress != address(0), "CryptoFundNexus: Token address required");

        _projectCounter++;
        uint256 projectId = _projectCounter;

        ProjectMetadata memory projectMetadata = metadata;
        projectMetadata.creator = msg.sender;
        projectMetadata.tier = ProjectTier.BRONZE;
        projectMetadata.reputationScore = 100;

        campaigns[projectId] = CampaignData({
            projectId: projectId,
            metadata: projectMetadata,
            config: config,
            state: FundingState({
                totalRaised: 0,
                totalInvestors: 0,
                tokensClaimed: 0,
                lastUpdateTime: block.timestamp,
                emergencyStop: false
            }),
            status: ProjectStatus.DRAFT
        });

        userProjects[msg.sender].push(projectId);

        if (!hasRole(PROJECT_CREATOR_ROLE, msg.sender)) {
            _grantRole(PROJECT_CREATOR_ROLE, msg.sender);
        }

        emit ProjectCreated(
            projectId,
            msg.sender,
            metadata.name,
            config.softCap,
            config.hardCap,
            ProjectTier.BRONZE
        );

        return projectId;
    }

    function launchProject(uint256 projectId)
        external
        onlyProjectCreator(projectId)
        projectExists(projectId)
        whenNotPaused
    {
        CampaignData storage campaign = campaigns[projectId];
        require(campaign.status == ProjectStatus.DRAFT, "CryptoFundNexus: Project already launched");
        
        // Validate token allocation
        IERC20 projectToken = IERC20(campaign.metadata.tokenAddress);
        uint256 requiredTokens = (campaign.config.hardCap * 1e18) / campaign.config.tokenPrice;
        require(
            projectToken.balanceOf(address(this)) >= requiredTokens,
            "CryptoFundNexus: Insufficient token allocation"
        );

        campaign.status = ProjectStatus.ACTIVE;
        campaign.state.lastUpdateTime = block.timestamp;

        emit ProjectStatusChanged(projectId, ProjectStatus.DRAFT, ProjectStatus.ACTIVE);
    }

    function makeConfidentialInvestment(
        uint256 projectId,
        bytes32 encryptedAmount,
        bytes calldata proof
    ) external payable projectExists(projectId) projectActive(projectId) whenNotPaused nonReentrant {
        CampaignData storage campaign = campaigns[projectId];
        
        require(block.timestamp >= campaign.config.startTime, "CryptoFundNexus: Funding not started");
        require(block.timestamp <= campaign.config.endTime, "CryptoFundNexus: Funding ended");
        require(!campaign.state.emergencyStop, "CryptoFundNexus: Emergency stop active");

        if (campaign.config.hasWhitelist) {
            require(whitelistedInvestors[projectId][msg.sender], "CryptoFundNexus: Not whitelisted");
        }

        // Verify FHE proof
        require(
            fheLayer.verifyInvestmentProof(encryptedAmount, proof, msg.value),
            "CryptoFundNexus: Invalid FHE proof"
        );

        // Check investment bounds using homomorphic operations
        require(
            fheLayer.verifyInvestmentBounds(
                encryptedAmount,
                campaign.config.minInvestment,
                campaign.config.maxInvestment
            ),
            "CryptoFundNexus: Investment out of bounds"
        );

        // Store encrypted investment
        encryptedInvestments[projectId][msg.sender] = encryptedAmount;
        
        if (!hasInvested[projectId][msg.sender]) {
            hasInvested[projectId][msg.sender] = true;
            projectInvestors[projectId].push(msg.sender);
            campaign.state.totalInvestors++;
        }

        campaign.state.totalRaised += msg.value;
        campaign.state.lastUpdateTime = block.timestamp;

        // Update user reputation
        userReputationScores[msg.sender] += 10;

        emit ConfidentialInvestmentMade(projectId, msg.sender, encryptedAmount, block.timestamp);

        // Check if project is fully funded
        if (campaign.state.totalRaised >= campaign.config.hardCap) {
            _completeProjectFunding(projectId);
        }
    }

    function claimTokens(uint256 projectId)
        external
        projectExists(projectId)
        nonReentrant
    {
        CampaignData storage campaign = campaigns[projectId];
        require(campaign.status == ProjectStatus.FUNDED, "CryptoFundNexus: Project not funded");
        require(hasInvested[projectId][msg.sender], "CryptoFundNexus: No investment found");
        
        bytes32 encryptedInvestment = encryptedInvestments[projectId][msg.sender];
        require(encryptedInvestment != bytes32(0), "CryptoFundNexus: No encrypted investment");

        // Decrypt investment amount for token calculation
        uint256 investmentAmount = fheLayer.decryptAmount(encryptedInvestment, msg.sender);
        uint256 tokenAmount = (investmentAmount * 1e18) / campaign.config.tokenPrice;

        // Handle vesting
        if (campaign.config.vestingDuration > 0) {
            require(
                block.timestamp >= campaign.state.lastUpdateTime + campaign.config.vestingDuration,
                "CryptoFundNexus: Tokens still vesting"
            );
        }

        // Transfer tokens
        IERC20 projectToken = IERC20(campaign.metadata.tokenAddress);
        projectToken.safeTransfer(msg.sender, tokenAmount);

        campaign.state.tokensClaimed += tokenAmount;
        
        // Clear investment data
        delete encryptedInvestments[projectId][msg.sender];
        hasInvested[projectId][msg.sender] = false;

        emit TokensClaimed(projectId, msg.sender, tokenAmount);
    }

    function initiateEmergencyRefund(uint256 projectId, string calldata reason)
        external
        onlyRole(ADMIN_ROLE)
        projectExists(projectId)
    {
        CampaignData storage campaign = campaigns[projectId];
        require(
            campaign.status == ProjectStatus.ACTIVE || campaign.status == ProjectStatus.FUNDED,
            "CryptoFundNexus: Invalid status for refund"
        );

        campaign.status = ProjectStatus.REFUNDING;
        campaign.state.emergencyStop = true;

        emit EmergencyRefundInitiated(projectId, reason);
    }

    function processRefund(uint256 projectId)
        external
        projectExists(projectId)
        nonReentrant
    {
        CampaignData storage campaign = campaigns[projectId];
        require(campaign.status == ProjectStatus.REFUNDING, "CryptoFundNexus: Not in refund state");
        require(hasInvested[projectId][msg.sender], "CryptoFundNexus: No investment to refund");

        bytes32 encryptedInvestment = encryptedInvestments[projectId][msg.sender];
        uint256 refundAmount = fheLayer.decryptAmount(encryptedInvestment, msg.sender);

        // Clear investment data
        delete encryptedInvestments[projectId][msg.sender];
        hasInvested[projectId][msg.sender] = false;
        
        campaign.state.totalRaised -= refundAmount;
        campaign.state.totalInvestors--;

        // Transfer refund
        payable(msg.sender).transfer(refundAmount);
    }

    function updateProjectVerification(
        uint256 projectId,
        bool isVerified,
        bool isAudited,
        ProjectTier newTier
    ) external onlyRole(VERIFIER_ROLE) projectExists(projectId) {
        CampaignData storage campaign = campaigns[projectId];
        
        campaign.metadata.isVerified = isVerified;
        campaign.metadata.isAudited = isAudited;
        campaign.metadata.tier = newTier;
        
        // Update reputation based on verification
        if (isVerified) campaign.metadata.reputationScore += 50;
        if (isAudited) campaign.metadata.reputationScore += 100;

        emit ProjectVerificationUpdated(projectId, isVerified, isAudited, newTier);
    }

    function _completeProjectFunding(uint256 projectId) internal {
        CampaignData storage campaign = campaigns[projectId];
        
        if (campaign.state.totalRaised >= campaign.config.softCap) {
            campaign.status = ProjectStatus.FUNDED;
            
            // Collect platform fee
            uint256 fee = (campaign.state.totalRaised * platformFeeRate) / 10000;
            payable(feeCollector).transfer(fee);
            
            // Transfer remaining funds to project creator
            uint256 remainingFunds = campaign.state.totalRaised - fee;
            payable(campaign.metadata.creator).transfer(remainingFunds);

            // Update creator reputation
            userReputationScores[campaign.metadata.creator] += 200;

            emit ProjectFunded(projectId, campaign.state.totalRaised, campaign.state.totalInvestors);
        }
    }

    // View functions
    function getProject(uint256 projectId)
        external
        view
        projectExists(projectId)
        returns (CampaignData memory)
    {
        return campaigns[projectId];
    }

    function getActiveProjects() external view returns (uint256[] memory) {
        uint256[] memory activeProjects = new uint256[](_projectCounter);
        uint256 count = 0;

        for (uint256 i = 1; i <= _projectCounter; i++) {
            if (campaigns[i].status == ProjectStatus.ACTIVE) {
                activeProjects[count] = i;
                count++;
            }
        }

        // Resize array
        uint256[] memory result = new uint256[](count);
        for (uint256 i = 0; i < count; i++) {
            result[i] = activeProjects[i];
        }

        return result;
    }

    function getUserProjects(address user) external view returns (uint256[] memory) {
        return userProjects[user];
    }

    function getProjectInvestors(uint256 projectId)
        external
        view
        projectExists(projectId)
        returns (address[] memory)
    {
        return projectInvestors[projectId];
    }

    function getTotalProjects() external view returns (uint256) {
        return _projectCounter;
    }

    // Admin functions
    function setPlatformFeeRate(uint256 newRate) external onlyRole(ADMIN_ROLE) {
        require(newRate <= MAX_FEE_RATE, "CryptoFundNexus: Fee too high");
        platformFeeRate = newRate;
    }

    function setFeeCollector(address newCollector) external onlyRole(ADMIN_ROLE) {
        require(newCollector != address(0), "CryptoFundNexus: Invalid address");
        feeCollector = newCollector;
    }

    function pause() external onlyRole(ADMIN_ROLE) {
        _pause();
    }

    function unpause() external onlyRole(ADMIN_ROLE) {
        _unpause();
    }

    function addToWhitelist(uint256 projectId, address[] calldata investors)
        external
        onlyProjectCreator(projectId)
    {
        for (uint256 i = 0; i < investors.length; i++) {
            whitelistedInvestors[projectId][investors[i]] = true;
        }
    }

    receive() external payable {
        revert("CryptoFundNexus: Direct payments not accepted");
    }
}