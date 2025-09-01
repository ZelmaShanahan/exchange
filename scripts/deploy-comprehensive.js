const { ethers } = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("🚀 Starting CryptoFund Nexus comprehensive deployment...\n");

  // Get signers
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);
  console.log("Account balance:", ethers.formatEther(await deployer.provider.getBalance(deployer.address)), "ETH\n");

  // Deployment parameters
  const deploymentParams = {
    fheSecurityLayer: {
      publicKeyX: 123456789,
      publicKeyY: 987654321,
      modulus: 999999999,
      generator: 12345
    },
    feeCollector: deployer.address, // In production, use a dedicated fee collector
    mockToken: {
      name: "CryptoFund Nexus Token",
      symbol: "CFNX",
      decimals: 18,
      initialSupply: ethers.parseEther("1000000") // 1M tokens
    }
  };

  const deployedContracts = {};
  const deploymentReceipts = {};

  try {
    // 1. Deploy FHE Security Layer
    console.log("📋 Step 1: Deploying FHE Security Layer...");
    const FHESecurityLayer = await ethers.getContractFactory("FHESecurityLayer");
    const fheSecurityLayer = await FHESecurityLayer.deploy(
      deploymentParams.fheSecurityLayer.publicKeyX,
      deploymentParams.fheSecurityLayer.publicKeyY,
      deploymentParams.fheSecurityLayer.modulus,
      deploymentParams.fheSecurityLayer.generator
    );
    await fheSecurityLayer.waitForDeployment();
    
    const fheAddress = await fheSecurityLayer.getAddress();
    deployedContracts.fheSecurityLayer = fheAddress;
    deploymentReceipts.fheSecurityLayer = await fheSecurityLayer.deploymentTransaction().wait();
    
    console.log("✅ FHE Security Layer deployed to:", fheAddress);
    console.log("   Gas used:", deploymentReceipts.fheSecurityLayer.gasUsed.toString(), "\n");

    // 2. Deploy Confidential Exchange
    console.log("📋 Step 2: Deploying Confidential Exchange...");
    const ConfidentialExchange = await ethers.getContractFactory("ConfidentialExchange");
    const confidentialExchange = await ConfidentialExchange.deploy(
      fheAddress,
      deploymentParams.feeCollector
    );
    await confidentialExchange.waitForDeployment();
    
    const dexAddress = await confidentialExchange.getAddress();
    deployedContracts.confidentialExchange = dexAddress;
    deploymentReceipts.confidentialExchange = await confidentialExchange.deploymentTransaction().wait();
    
    console.log("✅ Confidential Exchange deployed to:", dexAddress);
    console.log("   Gas used:", deploymentReceipts.confidentialExchange.gasUsed.toString(), "\n");

    // 3. Deploy main CryptoFund Nexus contract
    console.log("📋 Step 3: Deploying CryptoFund Nexus...");
    const CryptoFundNexus = await ethers.getContractFactory("CryptoFundNexus");
    const cryptoFundNexus = await CryptoFundNexus.deploy(
      fheAddress,
      dexAddress,
      deploymentParams.feeCollector
    );
    await cryptoFundNexus.waitForDeployment();
    
    const nexusAddress = await cryptoFundNexus.getAddress();
    deployedContracts.cryptoFundNexus = nexusAddress;
    deploymentReceipts.cryptoFundNexus = await cryptoFundNexus.deploymentTransaction().wait();
    
    console.log("✅ CryptoFund Nexus deployed to:", nexusAddress);
    console.log("   Gas used:", deploymentReceipts.cryptoFundNexus.gasUsed.toString(), "\n");

    // 4. Deploy Mock Token
    console.log("📋 Step 4: Deploying Mock Token...");
    const MockToken = await ethers.getContractFactory("MockToken");
    const mockToken = await MockToken.deploy(
      deploymentParams.mockToken.name,
      deploymentParams.mockToken.symbol,
      deploymentParams.mockToken.decimals,
      deploymentParams.mockToken.initialSupply
    );
    await mockToken.waitForDeployment();
    
    const tokenAddress = await mockToken.getAddress();
    deployedContracts.mockToken = tokenAddress;
    deploymentReceipts.mockToken = await mockToken.deploymentTransaction().wait();
    
    console.log("✅ Mock Token deployed to:", tokenAddress);
    console.log("   Gas used:", deploymentReceipts.mockToken.gasUsed.toString(), "\n");

    // 5. Post-deployment setup
    console.log("📋 Step 5: Post-deployment setup...");
    
    // Transfer tokens to CryptoFund Nexus for project distribution
    const tokensForDistribution = ethers.parseEther("500000"); // 500K tokens
    console.log("   Transferring", ethers.formatEther(tokensForDistribution), "tokens to CryptoFund Nexus...");
    const transferTx = await mockToken.transfer(nexusAddress, tokensForDistribution);
    await transferTx.wait();
    console.log("   ✅ Tokens transferred successfully");

    // Add CryptoFund Nexus as operator to FHE Security Layer
    console.log("   Granting OPERATOR_ROLE to CryptoFund Nexus...");
    const OPERATOR_ROLE = await fheSecurityLayer.OPERATOR_ROLE();
    const grantRoleTx = await fheSecurityLayer.grantRole(OPERATOR_ROLE, nexusAddress);
    await grantRoleTx.wait();
    console.log("   ✅ OPERATOR_ROLE granted successfully");

    // Create initial trading pair on DEX
    console.log("   Creating initial ETH/CFNX trading pair...");
    const createPairTx = await confidentialExchange.createTradingPair(
      ethers.ZeroAddress, // ETH (using zero address as placeholder)
      tokenAddress,       // CFNX token
      300,               // 3% swap fee
      true               // isConfidential
    );
    await createPairTx.wait();
    console.log("   ✅ Trading pair created successfully\n");

    // 6. Calculate total deployment costs
    const totalGasUsed = Object.values(deploymentReceipts).reduce(
      (total, receipt) => total + receipt.gasUsed,
      0n
    );
    
    const averageGasPrice = deploymentReceipts.cryptoFundNexus.gasPrice;
    const totalCost = totalGasUsed * averageGasPrice;

    console.log("💰 Deployment Summary:");
    console.log("=".repeat(50));
    console.log("Total contracts deployed:", Object.keys(deployedContracts).length);
    console.log("Total gas used:", totalGasUsed.toString());
    console.log("Average gas price:", ethers.formatUnits(averageGasPrice, "gwei"), "gwei");
    console.log("Total deployment cost:", ethers.formatEther(totalCost), "ETH");
    console.log("=".repeat(50));

    // 7. Save deployment addresses
    const networkName = (await ethers.provider.getNetwork()).name;
    const chainId = (await ethers.provider.getNetwork()).chainId.toString();
    
    const deploymentInfo = {
      network: networkName,
      chainId: chainId,
      deployer: deployer.address,
      deploymentTimestamp: new Date().toISOString(),
      contracts: deployedContracts,
      gasUsed: {
        fheSecurityLayer: deploymentReceipts.fheSecurityLayer.gasUsed.toString(),
        confidentialExchange: deploymentReceipts.confidentialExchange.gasUsed.toString(),
        cryptoFundNexus: deploymentReceipts.cryptoFundNexus.gasUsed.toString(),
        mockToken: deploymentReceipts.mockToken.gasUsed.toString(),
        total: totalGasUsed.toString()
      },
      deploymentCost: ethers.formatEther(totalCost),
      parameters: deploymentParams
    };

    // Ensure deployments directory exists
    const deploymentsDir = path.join(__dirname, "..", "deployments");
    if (!fs.existsSync(deploymentsDir)) {
      fs.mkdirSync(deploymentsDir, { recursive: true });
    }

    // Save to file
    const fileName = `deployment-${chainId}-${Date.now()}.json`;
    const filePath = path.join(deploymentsDir, fileName);
    fs.writeFileSync(filePath, JSON.stringify(deploymentInfo, null, 2));
    console.log("📄 Deployment info saved to:", filePath);

    // Save latest deployment for easy access
    const latestPath = path.join(deploymentsDir, `latest-${chainId}.json`);
    fs.writeFileSync(latestPath, JSON.stringify(deploymentInfo, null, 2));
    console.log("📄 Latest deployment info saved to:", latestPath);

    // 8. Generate frontend environment variables
    console.log("\n🔧 Frontend Environment Variables:");
    console.log("=".repeat(50));
    console.log(`REACT_APP_CRYPTOFUND_NEXUS_${chainId}=${nexusAddress}`);
    console.log(`REACT_APP_FHE_SECURITY_LAYER_${chainId}=${fheAddress}`);
    console.log(`REACT_APP_CONFIDENTIAL_EXCHANGE_${chainId}=${dexAddress}`);
    console.log(`REACT_APP_MOCK_TOKEN_${chainId}=${tokenAddress}`);
    console.log("=".repeat(50));

    // 9. Verification instructions
    console.log("\n🔍 Contract Verification:");
    console.log("To verify contracts on Etherscan, run:");
    console.log(`npx hardhat verify --network ${networkName} ${fheAddress} ${deploymentParams.fheSecurityLayer.publicKeyX} ${deploymentParams.fheSecurityLayer.publicKeyY} ${deploymentParams.fheSecurityLayer.modulus} ${deploymentParams.fheSecurityLayer.generator}`);
    console.log(`npx hardhat verify --network ${networkName} ${dexAddress} ${fheAddress} ${deploymentParams.feeCollector}`);
    console.log(`npx hardhat verify --network ${networkName} ${nexusAddress} ${fheAddress} ${dexAddress} ${deploymentParams.feeCollector}`);
    console.log(`npx hardhat verify --network ${networkName} ${tokenAddress} "${deploymentParams.mockToken.name}" "${deploymentParams.mockToken.symbol}" ${deploymentParams.mockToken.decimals} ${deploymentParams.mockToken.initialSupply.toString()}`);

    console.log("\n🎉 Deployment completed successfully!");
    console.log("🌐 You can now start the frontend and interact with the contracts.");

  } catch (error) {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  }
}

// Execute deployment
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });