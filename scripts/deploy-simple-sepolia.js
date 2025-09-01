const { ethers } = require("hardhat");
const fs = require('fs');
const path = require('path');

async function main() {
    console.log("🚀 Starting SimpleFundNexus deployment to Sepolia...");
    
    // Get deployer account
    const [deployer] = await ethers.getSigners();
    console.log("📍 Deploying with account:", deployer.address);
    
    // Check balance
    const balance = await deployer.provider.getBalance(deployer.address);
    console.log("💰 Account balance:", ethers.formatEther(balance), "ETH");
    
    if (balance < ethers.parseEther("0.01")) {
        console.warn("⚠️  Warning: Low balance, deployment might fail");
    }

    // Deploy SimpleFundNexus
    console.log("\n📦 Deploying SimpleFundNexus...");
    const SimpleFundNexus = await ethers.getContractFactory("SimpleFundNexus");
    
    // Estimate gas
    const deployTx = await SimpleFundNexus.getDeployTransaction();
    const gasEstimate = await deployer.estimateGas(deployTx);
    console.log("⛽ Estimated gas:", gasEstimate.toString());
    
    const simpleFundNexus = await SimpleFundNexus.deploy({
        gasLimit: gasEstimate + 50000n // Add buffer
    });
    
    console.log("⏳ Waiting for deployment confirmation...");
    await simpleFundNexus.waitForDeployment();
    
    const contractAddress = await simpleFundNexus.getAddress();
    console.log("✅ SimpleFundNexus deployed to:", contractAddress);
    
    // Get deployment transaction
    const deploymentTx = simpleFundNexus.deploymentTransaction();
    console.log("📋 Transaction hash:", deploymentTx.hash);
    console.log("⛽ Gas used:", deploymentTx.gasLimit.toString());
    
    // Wait for confirmations
    console.log("⏳ Waiting for 5 confirmations...");
    await deploymentTx.wait(5);
    console.log("✅ Contract confirmed on blockchain");

    // Save deployment info
    const deploymentInfo = {
        network: "sepolia",
        contractName: "SimpleFundNexus",
        contractAddress: contractAddress,
        deployerAddress: deployer.address,
        transactionHash: deploymentTx.hash,
        gasUsed: deploymentTx.gasLimit.toString(),
        timestamp: new Date().toISOString(),
        blockNumber: deploymentTx.blockNumber
    };

    // Create deployments directory if it doesn't exist
    const deploymentsDir = path.join(__dirname, '..', 'deployments', 'sepolia');
    if (!fs.existsSync(deploymentsDir)) {
        fs.mkdirSync(deploymentsDir, { recursive: true });
    }

    // Save deployment info to file
    const deploymentFile = path.join(deploymentsDir, 'SimpleFundNexus.json');
    fs.writeFileSync(deploymentFile, JSON.stringify(deploymentInfo, null, 2));
    console.log("💾 Deployment info saved to:", deploymentFile);

    // Generate frontend config
    const frontendConfig = {
        contractAddress: contractAddress,
        network: "sepolia",
        chainId: 11155111,
        abi: [
            "function createProject(string name, string description, uint256 goal, uint256 durationDays) returns (uint256)",
            "function contribute(uint256 projectId) payable",
            "function withdrawFunds(uint256 projectId)",
            "function claimRefund(uint256 projectId)",
            "function getProject(uint256 projectId) view returns (string, string, address, uint256, uint256, uint256, bool, bool, uint256)",
            "function getUserProjects(address user) view returns (uint256[])",
            "function getActiveProjects() view returns (uint256[])",
            "function getContribution(uint256 projectId, address contributor) view returns (uint256)",
            "function projectCount() view returns (uint256)",
            "function platformFee() view returns (uint256)",
            "event ProjectCreated(uint256 indexed projectId, address indexed creator, string name, uint256 goal, uint256 deadline)",
            "event ContributionMade(uint256 indexed projectId, address indexed contributor, uint256 amount)",
            "event ProjectFunded(uint256 indexed projectId, uint256 totalRaised)",
            "event WithdrawalMade(uint256 indexed projectId, address indexed creator, uint256 amount)",
            "event RefundClaimed(uint256 indexed projectId, address indexed contributor, uint256 amount)"
        ]
    };

    const frontendConfigFile = path.join(__dirname, '..', 'frontend', 'src', 'config', 'contract.js');
    const frontendConfigContent = `// Auto-generated contract configuration
// Deployed: ${deploymentInfo.timestamp}

export const CONTRACT_CONFIG = ${JSON.stringify(frontendConfig, null, 2)};

export const CONTRACT_ADDRESS = "${contractAddress}";
export const SEPOLIA_CHAIN_ID = 11155111;
export const NETWORK_NAME = "sepolia";

// MetaMask network config
export const SEPOLIA_NETWORK = {
    chainId: "0x" + SEPOLIA_CHAIN_ID.toString(16),
    chainName: "Sepolia Test Network",
    rpcUrls: ["https://ethereum-sepolia-rpc.publicnode.com"],
    blockExplorerUrls: ["https://sepolia.etherscan.io"],
    nativeCurrency: {
        name: "Sepolia ETH",
        symbol: "ETH",
        decimals: 18
    }
};
`;

    fs.writeFileSync(frontendConfigFile, frontendConfigContent);
    console.log("🔧 Frontend config updated:", frontendConfigFile);

    console.log("\n🎉 Deployment Summary:");
    console.log("====================");
    console.log("Contract:", "SimpleFundNexus");
    console.log("Address:", contractAddress);
    console.log("Network:", "Sepolia");
    console.log("Explorer:", `https://sepolia.etherscan.io/address/${contractAddress}`);
    console.log("Transaction:", `https://sepolia.etherscan.io/tx/${deploymentTx.hash}`);
    
    console.log("\n🔗 Next Steps:");
    console.log("1. Verify contract on Etherscan:");
    console.log(`   npx hardhat verify --network sepolia ${contractAddress}`);
    console.log("2. Update frontend with new contract address");
    console.log("3. Test contract functionality on Sepolia");

    return {
        simpleFundNexus: contractAddress
    };
}

main()
    .then((addresses) => {
        console.log("\n✅ All deployments completed successfully!");
        console.log("Contract addresses:", addresses);
        process.exit(0);
    })
    .catch((error) => {
        console.error("\n❌ Deployment failed:");
        console.error(error);
        process.exit(1);
    });