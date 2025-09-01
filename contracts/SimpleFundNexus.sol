// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

/**
 * @title Simple Fund Nexus
 * @dev Gas-optimized fundraising platform for Sepolia deployment
 * @author CryptoFund Nexus Team
 */
contract SimpleFundNexus {
    struct Project {
        string name;
        string description;
        address creator;
        uint256 goal;
        uint256 raised;
        uint256 deadline;
        bool completed;
        bool withdrawn;
        uint256 backerCount;
    }

    mapping(uint256 => Project) public projects;
    mapping(uint256 => mapping(address => uint256)) public contributions;
    mapping(address => uint256[]) public userProjects;
    
    uint256 public projectCount;
    uint256 public platformFee = 25; // 2.5%
    address public owner;

    event ProjectCreated(uint256 indexed projectId, address indexed creator, string name, uint256 goal, uint256 deadline);
    event ContributionMade(uint256 indexed projectId, address indexed contributor, uint256 amount);
    event ProjectFunded(uint256 indexed projectId, uint256 totalRaised);
    event WithdrawalMade(uint256 indexed projectId, address indexed creator, uint256 amount);
    event RefundClaimed(uint256 indexed projectId, address indexed contributor, uint256 amount);

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    modifier projectExists(uint256 _projectId) {
        require(_projectId > 0 && _projectId <= projectCount, "Project does not exist");
        _;
    }

    modifier onlyCreator(uint256 _projectId) {
        require(projects[_projectId].creator == msg.sender, "Not project creator");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function createProject(
        string memory _name,
        string memory _description,
        uint256 _goal,
        uint256 _durationDays
    ) external returns (uint256) {
        require(bytes(_name).length > 0, "Name required");
        require(_goal > 0, "Goal must be positive");
        require(_durationDays > 0, "Duration must be positive");

        projectCount++;
        uint256 deadline = block.timestamp + (_durationDays * 1 days);

        projects[projectCount] = Project({
            name: _name,
            description: _description,
            creator: msg.sender,
            goal: _goal,
            raised: 0,
            deadline: deadline,
            completed: false,
            withdrawn: false,
            backerCount: 0
        });

        userProjects[msg.sender].push(projectCount);

        emit ProjectCreated(projectCount, msg.sender, _name, _goal, deadline);
        return projectCount;
    }

    function contribute(uint256 _projectId) 
        external 
        payable 
        projectExists(_projectId) 
    {
        require(msg.value > 0, "Contribution must be positive");
        
        Project storage project = projects[_projectId];
        require(block.timestamp < project.deadline, "Project expired");
        require(!project.completed, "Project already completed");

        // First-time contributor
        if (contributions[_projectId][msg.sender] == 0) {
            project.backerCount++;
        }

        contributions[_projectId][msg.sender] += msg.value;
        project.raised += msg.value;

        emit ContributionMade(_projectId, msg.sender, msg.value);

        // Check if goal reached
        if (project.raised >= project.goal) {
            project.completed = true;
            emit ProjectFunded(_projectId, project.raised);
        }
    }

    function withdrawFunds(uint256 _projectId) 
        external 
        projectExists(_projectId) 
        onlyCreator(_projectId) 
    {
        Project storage project = projects[_projectId];
        require(project.completed || block.timestamp >= project.deadline, "Cannot withdraw yet");
        require(!project.withdrawn, "Already withdrawn");
        require(project.raised > 0, "No funds to withdraw");

        project.withdrawn = true;

        uint256 fee = (project.raised * platformFee) / 1000;
        uint256 creatorAmount = project.raised - fee;

        if (fee > 0) {
            payable(owner).transfer(fee);
        }
        payable(msg.sender).transfer(creatorAmount);

        emit WithdrawalMade(_projectId, msg.sender, creatorAmount);
    }

    function claimRefund(uint256 _projectId) 
        external 
        projectExists(_projectId) 
    {
        Project storage project = projects[_projectId];
        require(block.timestamp >= project.deadline, "Project not expired");
        require(!project.completed, "Project was successful");
        require(!project.withdrawn, "Funds already withdrawn");
        
        uint256 contribution = contributions[_projectId][msg.sender];
        require(contribution > 0, "No contribution to refund");

        contributions[_projectId][msg.sender] = 0;
        project.raised -= contribution;
        project.backerCount--;

        payable(msg.sender).transfer(contribution);
        emit RefundClaimed(_projectId, msg.sender, contribution);
    }

    // View functions
    function getProject(uint256 _projectId) 
        external 
        view 
        projectExists(_projectId) 
        returns (
            string memory name,
            string memory description,
            address creator,
            uint256 goal,
            uint256 raised,
            uint256 deadline,
            bool completed,
            bool withdrawn,
            uint256 backerCount
        ) 
    {
        Project storage project = projects[_projectId];
        return (
            project.name,
            project.description,
            project.creator,
            project.goal,
            project.raised,
            project.deadline,
            project.completed,
            project.withdrawn,
            project.backerCount
        );
    }

    function getUserProjects(address _user) external view returns (uint256[] memory) {
        return userProjects[_user];
    }

    function getContribution(uint256 _projectId, address _contributor) 
        external 
        view 
        returns (uint256) 
    {
        return contributions[_projectId][_contributor];
    }

    function getActiveProjects() external view returns (uint256[] memory) {
        uint256[] memory activeProjects = new uint256[](projectCount);
        uint256 count = 0;

        for (uint256 i = 1; i <= projectCount; i++) {
            if (block.timestamp < projects[i].deadline && !projects[i].completed) {
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

    // Admin functions
    function setPlatformFee(uint256 _newFee) external onlyOwner {
        require(_newFee <= 100, "Fee too high"); // Max 10%
        platformFee = _newFee;
    }

    function emergencyWithdraw() external onlyOwner {
        payable(owner).transfer(address(this).balance);
    }

    // Prevent direct ETH transfers
    receive() external payable {
        revert("Use contribute function");
    }
}