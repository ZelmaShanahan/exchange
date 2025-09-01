const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("CryptoFundNexusModule", (m) => {
  // Parameters for FHE Security Layer
  const publicKeyX = m.getParameter("publicKeyX", 123456789);
  const publicKeyY = m.getParameter("publicKeyY", 987654321);
  const modulus = m.getParameter("modulus", 999999999);
  const generator = m.getParameter("generator", 12345);

  // Fee collector address
  const feeCollector = m.getParameter("feeCollector", "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266");

  // Deploy FHE Security Layer first
  const fheSecurityLayer = m.contract("FHESecurityLayer", [
    publicKeyX,
    publicKeyY,
    modulus,
    generator
  ]);

  // Deploy Confidential Exchange
  const confidentialExchange = m.contract("ConfidentialExchange", [
    fheSecurityLayer,
    feeCollector
  ]);

  // Deploy main CryptoFund Nexus contract
  const cryptoFundNexus = m.contract("CryptoFundNexus", [
    fheSecurityLayer,
    confidentialExchange,
    feeCollector
  ]);

  // Deploy Mock Token for testing
  const mockToken = m.contract("MockToken", [
    "CryptoFund Test Token",
    "CFNT",
    18,
    m.bigint("1000000000000000000000000") // 1M tokens with 18 decimals
  ]);

  // After deployment setup - this would be handled by a separate script
  // m.call(mockToken, "transfer", [cryptoFundNexus, m.bigint("500000000000000000000000")]); // 500K tokens

  return {
    fheSecurityLayer,
    confidentialExchange,
    cryptoFundNexus,
    mockToken
  };
});