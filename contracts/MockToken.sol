// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

/**
 * @title Mock Token
 * @dev Simple ERC20 token for testing and demonstration purposes
 * @author CryptoFund Nexus Team
 */
contract MockToken is ERC20, Ownable, Pausable {
    uint8 private _decimals;
    uint256 public constant MAX_SUPPLY = 1_000_000_000 * 10**18; // 1 billion tokens
    
    mapping(address => bool) public minters;
    mapping(address => bool) public burners;
    
    event MinterAdded(address indexed minter);
    event MinterRemoved(address indexed minter);
    event BurnerAdded(address indexed burner);
    event BurnerRemoved(address indexed burner);
    
    modifier onlyMinter() {
        require(minters[msg.sender] || msg.sender == owner(), "MockToken: Not authorized to mint");
        _;
    }
    
    modifier onlyBurner() {
        require(burners[msg.sender] || msg.sender == owner(), "MockToken: Not authorized to burn");
        _;
    }

    constructor(
        string memory name,
        string memory symbol,
        uint8 decimalsValue,
        uint256 initialSupply
    ) ERC20(name, symbol) {
        _decimals = decimalsValue;
        
        if (initialSupply > 0) {
            require(initialSupply <= MAX_SUPPLY, "MockToken: Initial supply exceeds maximum");
            _mint(msg.sender, initialSupply);
        }
        
        // Add deployer as initial minter and burner
        minters[msg.sender] = true;
        burners[msg.sender] = true;
        
        emit MinterAdded(msg.sender);
        emit BurnerAdded(msg.sender);
    }
    
    function decimals() public view virtual override returns (uint8) {
        return _decimals;
    }
    
    function mint(address to, uint256 amount) external onlyMinter whenNotPaused {
        require(to != address(0), "MockToken: Cannot mint to zero address");
        require(totalSupply() + amount <= MAX_SUPPLY, "MockToken: Exceeds maximum supply");
        
        _mint(to, amount);
    }
    
    function burn(uint256 amount) external onlyBurner whenNotPaused {
        _burn(msg.sender, amount);
    }
    
    function burnFrom(address from, uint256 amount) external onlyBurner whenNotPaused {
        _burn(from, amount);
    }
    
    function addMinter(address minter) external onlyOwner {
        require(minter != address(0), "MockToken: Invalid minter address");
        require(!minters[minter], "MockToken: Already a minter");
        
        minters[minter] = true;
        emit MinterAdded(minter);
    }
    
    function removeMinter(address minter) external onlyOwner {
        require(minters[minter], "MockToken: Not a minter");
        
        minters[minter] = false;
        emit MinterRemoved(minter);
    }
    
    function addBurner(address burner) external onlyOwner {
        require(burner != address(0), "MockToken: Invalid burner address");
        require(!burners[burner], "MockToken: Already a burner");
        
        burners[burner] = true;
        emit BurnerAdded(burner);
    }
    
    function removeBurner(address burner) external onlyOwner {
        require(burners[burner], "MockToken: Not a burner");
        
        burners[burner] = false;
        emit BurnerRemoved(burner);
    }
    
    function pause() external onlyOwner {
        _pause();
    }
    
    function unpause() external onlyOwner {
        _unpause();
    }
    
    function transfer(address to, uint256 amount) public virtual override whenNotPaused returns (bool) {
        return super.transfer(to, amount);
    }
    
    function transferFrom(address from, address to, uint256 amount) public virtual override whenNotPaused returns (bool) {
        return super.transferFrom(from, to, amount);
    }
    
    // Batch operations for efficiency
    function batchTransfer(address[] calldata recipients, uint256[] calldata amounts) external whenNotPaused {
        require(recipients.length == amounts.length, "MockToken: Array length mismatch");
        require(recipients.length <= 100, "MockToken: Too many recipients");
        
        for (uint256 i = 0; i < recipients.length; i++) {
            transfer(recipients[i], amounts[i]);
        }
    }
    
    function batchMint(address[] calldata recipients, uint256[] calldata amounts) external onlyMinter whenNotPaused {
        require(recipients.length == amounts.length, "MockToken: Array length mismatch");
        require(recipients.length <= 100, "MockToken: Too many recipients");
        
        uint256 totalAmount = 0;
        for (uint256 i = 0; i < amounts.length; i++) {
            totalAmount += amounts[i];
        }
        
        require(totalSupply() + totalAmount <= MAX_SUPPLY, "MockToken: Batch mint exceeds maximum supply");
        
        for (uint256 i = 0; i < recipients.length; i++) {
            _mint(recipients[i], amounts[i]);
        }
    }
}