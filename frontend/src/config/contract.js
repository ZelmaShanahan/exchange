// SimpleFundNexus Contract Configuration for Sepolia
// Deployed using mnemonic: castle fantasy cause seven myself filter eyebrow stay ceiling laugh tourist sea
// Deployment Date: 2025-08-26

export const CONTRACT_CONFIG = {
  contractAddress: "0x742d35Cc6586FA47d4e2c1C2a18C1Ae67bDc4b2A", // Sample address - replace with actual
  network: "sepolia",
  chainId: 11155111,
  abi: [
    // Constructor
    "constructor()",
    
    // Core Functions
    "function createProject(string name, string description, uint256 goal, uint256 durationDays) returns (uint256)",
    "function contribute(uint256 projectId) payable",
    "function withdrawFunds(uint256 projectId)",
    "function claimRefund(uint256 projectId)",
    
    // View Functions
    "function getProject(uint256 projectId) view returns (string name, string description, address creator, uint256 goal, uint256 raised, uint256 deadline, bool completed, bool withdrawn, uint256 backerCount)",
    "function getUserProjects(address user) view returns (uint256[])",
    "function getActiveProjects() view returns (uint256[])",
    "function getContribution(uint256 projectId, address contributor) view returns (uint256)",
    "function projectCount() view returns (uint256)",
    "function platformFee() view returns (uint256)",
    "function owner() view returns (address)",
    
    // Admin Functions
    "function setPlatformFee(uint256 _newFee)",
    "function emergencyWithdraw()",
    
    // Events
    "event ProjectCreated(uint256 indexed projectId, address indexed creator, string name, uint256 goal, uint256 deadline)",
    "event ContributionMade(uint256 indexed projectId, address indexed contributor, uint256 amount)",
    "event ProjectFunded(uint256 indexed projectId, uint256 totalRaised)",
    "event WithdrawalMade(uint256 indexed projectId, address indexed creator, uint256 amount)",
    "event RefundClaimed(uint256 indexed projectId, address indexed contributor, uint256 amount)"
  ]
};

// Quick access exports
export const CONTRACT_ADDRESS = CONTRACT_CONFIG.contractAddress;
export const CONTRACT_ABI = CONTRACT_CONFIG.abi;
export const SEPOLIA_CHAIN_ID = 11155111;
export const NETWORK_NAME = "sepolia";

// Network configuration for MetaMask
export const SEPOLIA_NETWORK = {
  chainId: "0x" + SEPOLIA_CHAIN_ID.toString(16), // 0xaa36a7
  chainName: "Sepolia Test Network",
  rpcUrls: ["https://ethereum-sepolia-rpc.publicnode.com"],
  blockExplorerUrls: ["https://sepolia.etherscan.io"],
  nativeCurrency: {
    name: "Sepolia ETH",
    symbol: "ETH",
    decimals: 18
  }
};

// Gas configurations optimized for Sepolia
export const GAS_CONFIGS = {
  createProject: 300000,
  contribute: 150000,
  withdrawFunds: 100000,
  claimRefund: 80000,
  setPlatformFee: 50000
};

// Platform constants
export const PLATFORM_FEE_RATE = 25; // 2.5% (25/1000)
export const MAX_PROJECT_DURATION_DAYS = 365;
export const MIN_PROJECT_GOAL = "0.001"; // 0.001 ETH minimum

// Utility functions
export const getExplorerUrl = (hash, type = 'tx') => {
  const baseUrl = SEPOLIA_NETWORK.blockExplorerUrls[0];
  const path = type === 'address' ? 'address' : 'tx';
  return `${baseUrl}/${path}/${hash}`;
};

export const formatProjectDuration = (durationDays) => {
  if (durationDays === 1) return "1 day";
  if (durationDays < 7) return `${durationDays} days`;
  if (durationDays < 30) return `${Math.floor(durationDays / 7)} weeks`;
  return `${Math.floor(durationDays / 30)} months`;
};

// Contract interaction helpers
export const getContractWithSigner = async (signer) => {
  const { ethers } = await import('ethers');
  return new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
};

export const getContractWithProvider = async (provider) => {
  const { ethers } = await import('ethers');
  return new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
};

// Validation helpers
export const validateProjectData = (name, description, goal, duration) => {
  const errors = [];
  
  if (!name || name.trim().length < 3) {
    errors.push("Project name must be at least 3 characters");
  }
  
  if (!description || description.trim().length < 10) {
    errors.push("Description must be at least 10 characters");
  }
  
  if (!goal || isNaN(goal) || parseFloat(goal) < parseFloat(MIN_PROJECT_GOAL)) {
    errors.push(`Goal must be at least ${MIN_PROJECT_GOAL} ETH`);
  }
  
  if (!duration || isNaN(duration) || duration < 1 || duration > MAX_PROJECT_DURATION_DAYS) {
    errors.push(`Duration must be between 1 and ${MAX_PROJECT_DURATION_DAYS} days`);
  }
  
  return errors;
};

export default CONTRACT_CONFIG;