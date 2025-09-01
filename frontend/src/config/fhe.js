// FHE Configuration for CryptoFund Nexus
// Zama FHE integration with Sepolia testnet contracts

export const FHE_CONFIG = {
  // Network Configuration
  NETWORK: 'sepolia',
  CHAIN_ID: 11155111,
  RPC_URL: 'https://ethereum-sepolia-rpc.publicnode.com',

  // Zama FHE Contract Addresses (Sepolia)
  CONTRACTS: {
    FHEVM_EXECUTOR: '0x848B0066793BcC60346Da1F49049357399B8D595',
    ACL_CONTRACT: '0x687820221192C5B662b25367F70076A37bc79b6c',
    HCU_LIMIT: '0x594BB474275918AF9609814E68C61B1587c5F838',
    KMS_VERIFIER: '0x1364cBBf2cDF5032C47d8226a6f6FBD2AFCDacAC',
    INPUT_VERIFIER: '0xbc91f3daD1A5F19F8390c400196e58073B6a0BC4',
    DECRYPTION_ORACLE: '0xa02Cda4Ca3a71D7C46997716F4283aa851C28812'
  },

  // Service Addresses
  ADDRESSES: {
    DECRYPTION: '0xb6E160B1ff80D67Bfe90A85eE06Ce0A2613607D1',
    INPUT_VERIFICATION: '0x7048C39f048125eDa9d678AEbaDfB22F7900a29F'
  },

  // Relayer Configuration
  RELAYER: {
    URL: 'https://relayer.testnet.zama.cloud',
    TIMEOUT: 30000, // 30 seconds
    RETRY_ATTEMPTS: 3
  },

  // FHE Operation Configuration
  OPERATIONS: {
    ENCRYPTION_TIMEOUT: 10000, // 10 seconds
    DECRYPTION_TIMEOUT: 15000, // 15 seconds
    PROOF_GENERATION_TIMEOUT: 20000, // 20 seconds
    MAX_VALUE: BigInt('18446744073709551615'), // 2^64 - 1
    MIN_VALUE: BigInt('1')
  },

  // Gas Configuration for FHE operations
  GAS: {
    ENCRYPT: 200000,
    DECRYPT: 150000,
    VERIFY_PROOF: 100000,
    HOMOMORPHIC_ADD: 300000,
    HOMOMORPHIC_MUL: 400000,
    RANGE_PROOF: 250000
  },

  // Error Messages
  ERRORS: {
    NOT_INITIALIZED: 'FHE not initialized',
    INVALID_PROOF: 'Invalid FHE proof',
    VALUE_OUT_OF_RANGE: 'Value out of valid range',
    ENCRYPTION_FAILED: 'Encryption operation failed',
    DECRYPTION_FAILED: 'Decryption operation failed',
    NETWORK_ERROR: 'Network connection error',
    TIMEOUT_ERROR: 'Operation timeout',
    UNAUTHORIZED: 'Unauthorized operation'
  },

  // Development Settings
  DEVELOPMENT: {
    MOCK_MODE: process.env.NODE_ENV === 'development',
    DEBUG_LOGS: true,
    SIMULATE_DELAY: true
  }
};

// Helper function to get contract address
export function getContractAddress(contractName) {
  return FHE_CONFIG.CONTRACTS[contractName];
}

// Helper function to check if FHE is available
export function isFHEAvailable() {
  return typeof window !== 'undefined' && window.ethereum;
}

// Helper function to validate FHE value
export function isValidFHEValue(value) {
  const bigIntValue = typeof value === 'bigint' ? value : BigInt(value);
  return bigIntValue >= FHE_CONFIG.OPERATIONS.MIN_VALUE && 
         bigIntValue <= FHE_CONFIG.OPERATIONS.MAX_VALUE;
}

// Network validation
export function isCorrectNetwork(chainId) {
  return chainId === FHE_CONFIG.CHAIN_ID;
}

export default FHE_CONFIG;