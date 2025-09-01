import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { ethers } from 'ethers';
import toast from 'react-hot-toast';

// Create context
const Web3Context = createContext();

// Action types
const WEB3_ACTIONS = {
  SET_PROVIDER: 'SET_PROVIDER',
  SET_SIGNER: 'SET_SIGNER',
  SET_ACCOUNT: 'SET_ACCOUNT',
  SET_CHAIN_ID: 'SET_CHAIN_ID',
  SET_BALANCE: 'SET_BALANCE',
  SET_CONNECTING: 'SET_CONNECTING',
  SET_ERROR: 'SET_ERROR',
  DISCONNECT: 'DISCONNECT',
  SET_CONTRACTS: 'SET_CONTRACTS'
};

// Initial state
const initialState = {
  provider: null,
  signer: null,
  account: null,
  chainId: null,
  balance: '0',
  connecting: false,
  error: null,
  contracts: {
    simpleFundNexus: null
  }
};

// Reducer
function web3Reducer(state, action) {
  switch (action.type) {
    case WEB3_ACTIONS.SET_PROVIDER:
      return { ...state, provider: action.payload };
    case WEB3_ACTIONS.SET_SIGNER:
      return { ...state, signer: action.payload };
    case WEB3_ACTIONS.SET_ACCOUNT:
      return { ...state, account: action.payload };
    case WEB3_ACTIONS.SET_CHAIN_ID:
      return { ...state, chainId: action.payload };
    case WEB3_ACTIONS.SET_BALANCE:
      return { ...state, balance: action.payload };
    case WEB3_ACTIONS.SET_CONNECTING:
      return { ...state, connecting: action.payload };
    case WEB3_ACTIONS.SET_ERROR:
      return { ...state, error: action.payload };
    case WEB3_ACTIONS.SET_CONTRACTS:
      return { ...state, contracts: { ...state.contracts, ...action.payload } };
    case WEB3_ACTIONS.DISCONNECT:
      return {
        ...initialState,
        provider: state.provider // Keep provider for read-only operations
      };
    default:
      return state;
  }
}

// Import contract configuration
import { CONTRACT_ADDRESS, CONTRACT_ABI, SEPOLIA_NETWORK } from '../config/contract.js';

// Contract addresses (updated with deployed SimpleFundNexus)
const CONTRACT_ADDRESSES = {
  31337: { // Localhost
    simpleFundNexus: process.env.REACT_APP_SIMPLE_FUND_NEXUS_LOCAL || '0x5fbdb2315678afecb367f032d93f642f64180aa3',
  },
  11155111: { // Sepolia
    simpleFundNexus: CONTRACT_ADDRESS || '0x742d35Cc6586FA47d4e2c1C2a18C1Ae67bDc4b2A',
  }
};

// Supported networks
const SUPPORTED_NETWORKS = {
  31337: {
    name: 'Localhost',
    rpcUrl: 'http://127.0.0.1:8545'
  },
  11155111: {
    ...SEPOLIA_NETWORK,
    name: 'Sepolia Testnet',
    rpcUrl: SEPOLIA_NETWORK.rpcUrls[0]
  }
};

// Provider component
export function Web3Provider({ children }) {
  const [state, dispatch] = useReducer(web3Reducer, initialState);

  // Initialize provider on mount
  useEffect(() => {
    initializeProvider();
  }, []);

  // Listen for account changes
  useEffect(() => {
    if (window.ethereum) {
      const handleAccountsChanged = (accounts) => {
        if (accounts.length === 0) {
          disconnect();
        } else {
          dispatch({ type: WEB3_ACTIONS.SET_ACCOUNT, payload: accounts[0] });
          updateBalance(accounts[0]);
        }
      };

      const handleChainChanged = (chainId) => {
        const numericChainId = parseInt(chainId, 16);
        dispatch({ type: WEB3_ACTIONS.SET_CHAIN_ID, payload: numericChainId });
        
        if (!SUPPORTED_NETWORKS[numericChainId]) {
          toast.error('Unsupported network. Please switch to Localhost or Sepolia.');
        }
      };

      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);

      return () => {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      };
    }
  }, []);

  // Update balance when account changes
  useEffect(() => {
    if (state.account && state.provider) {
      updateBalance(state.account);
    }
  }, [state.account, state.provider]);

  // Initialize contracts when provider and chainId are available
  useEffect(() => {
    if (state.provider && state.chainId) {
      initializeContracts();
    }
  }, [state.provider, state.chainId, state.signer]);

  async function initializeProvider() {
    try {
      if (window.ethereum) {
        const provider = new ethers.BrowserProvider(window.ethereum);
        dispatch({ type: WEB3_ACTIONS.SET_PROVIDER, payload: provider });

        // Get chain ID
        const network = await provider.getNetwork();
        dispatch({ type: WEB3_ACTIONS.SET_CHAIN_ID, payload: Number(network.chainId) });

        // Check if already connected
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
          const signer = await provider.getSigner();
          dispatch({ type: WEB3_ACTIONS.SET_SIGNER, payload: signer });
          dispatch({ type: WEB3_ACTIONS.SET_ACCOUNT, payload: accounts[0] });
        }
      } else {
        // Fallback to read-only provider
        const provider = new ethers.JsonRpcProvider(SUPPORTED_NETWORKS[31337].rpcUrl);
        dispatch({ type: WEB3_ACTIONS.SET_PROVIDER, payload: provider });
        dispatch({ type: WEB3_ACTIONS.SET_CHAIN_ID, payload: 31337 });
      }
    } catch (error) {
      console.error('Failed to initialize provider:', error);
      dispatch({ type: WEB3_ACTIONS.SET_ERROR, payload: error.message });
    }
  }

  async function connectWallet() {
    if (!window.ethereum) {
      toast.error('MetaMask not detected. Please install MetaMask.');
      return;
    }

    dispatch({ type: WEB3_ACTIONS.SET_CONNECTING, payload: true });
    dispatch({ type: WEB3_ACTIONS.SET_ERROR, payload: null });

    try {
      // Request account access
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      });

      if (accounts.length === 0) {
        throw new Error('No accounts returned');
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      dispatch({ type: WEB3_ACTIONS.SET_PROVIDER, payload: provider });
      dispatch({ type: WEB3_ACTIONS.SET_SIGNER, payload: signer });
      dispatch({ type: WEB3_ACTIONS.SET_ACCOUNT, payload: accounts[0] });

      // Get chain ID
      const network = await provider.getNetwork();
      const chainId = Number(network.chainId);
      dispatch({ type: WEB3_ACTIONS.SET_CHAIN_ID, payload: chainId });

      // Check if on supported network
      if (!SUPPORTED_NETWORKS[chainId]) {
        toast.error('Please switch to a supported network (Localhost or Sepolia)');
      } else {
        toast.success('Wallet connected successfully!');
      }

    } catch (error) {
      console.error('Failed to connect wallet:', error);
      let errorMessage = 'Failed to connect wallet';
      
      if (error.code === 4001) {
        errorMessage = 'Connection rejected by user';
      } else if (error.code === -32002) {
        errorMessage = 'Connection request already pending';
      }

      dispatch({ type: WEB3_ACTIONS.SET_ERROR, payload: errorMessage });
      toast.error(errorMessage);
    } finally {
      dispatch({ type: WEB3_ACTIONS.SET_CONNECTING, payload: false });
    }
  }

  async function disconnect() {
    dispatch({ type: WEB3_ACTIONS.DISCONNECT });
    toast.success('Wallet disconnected');
  }

  async function updateBalance(address) {
    if (state.provider) {
      try {
        const balance = await state.provider.getBalance(address);
        const balanceInEth = ethers.formatEther(balance);
        dispatch({ type: WEB3_ACTIONS.SET_BALANCE, payload: balanceInEth });
      } catch (error) {
        console.error('Failed to get balance:', error);
      }
    }
  }

  async function switchNetwork(chainId) {
    if (!window.ethereum) return;

    const hexChainId = `0x${chainId.toString(16)}`;
    
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: hexChainId }],
      });
    } catch (error) {
      if (error.code === 4902) {
        // Network not added to MetaMask
        const network = SUPPORTED_NETWORKS[chainId];
        if (network) {
          try {
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [{
                chainId: hexChainId,
                chainName: network.name,
                rpcUrls: [network.rpcUrl],
                nativeCurrency: {
                  name: 'Ethereum',
                  symbol: 'ETH',
                  decimals: 18
                }
              }],
            });
          } catch (addError) {
            console.error('Failed to add network:', addError);
            toast.error('Failed to add network');
          }
        }
      } else {
        console.error('Failed to switch network:', error);
        toast.error('Failed to switch network');
      }
    }
  }

  async function initializeContracts() {
    try {
      const addresses = CONTRACT_ADDRESSES[state.chainId];
      if (!addresses) return;

      const contracts = {};
      const provider = state.signer || state.provider;

      // Initialize SimpleFundNexus contract with ABI
      if (addresses.simpleFundNexus) {
        contracts.simpleFundNexus = {
          address: addresses.simpleFundNexus,
          contract: new ethers.Contract(addresses.simpleFundNexus, CONTRACT_ABI, provider)
        };
      }

      dispatch({ type: WEB3_ACTIONS.SET_CONTRACTS, payload: contracts });
    } catch (error) {
      console.error('Failed to initialize contracts:', error);
    }
  }

  // Utility functions
  function isConnected() {
    return !!state.account;
  }

  function isSupportedNetwork() {
    return !!SUPPORTED_NETWORKS[state.chainId];
  }

  function getNetworkName() {
    return SUPPORTED_NETWORKS[state.chainId]?.name || 'Unknown Network';
  }

  function formatAddress(address) {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  }

  function formatBalance(balance, decimals = 4) {
    const num = parseFloat(balance);
    if (num === 0) return '0';
    if (num < 0.0001) return '< 0.0001';
    return num.toFixed(decimals);
  }

  const value = {
    // State
    ...state,
    
    // Actions
    connectWallet,
    disconnect,
    switchNetwork,
    updateBalance,
    
    // Utilities
    isConnected: isConnected(),
    isSupportedNetwork: isSupportedNetwork(),
    networkName: getNetworkName(),
    formatAddress,
    formatBalance,
    supportedNetworks: SUPPORTED_NETWORKS
  };

  return (
    <Web3Context.Provider value={value}>
      {children}
    </Web3Context.Provider>
  );
}

// Custom hook
export function useWeb3() {
  const context = useContext(Web3Context);
  if (!context) {
    throw new Error('useWeb3 must be used within a Web3Provider');
  }
  return context;
}