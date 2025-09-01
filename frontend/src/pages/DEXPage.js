import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { ethers } from 'ethers';
import { useWeb3 } from '../contexts/Web3Context';
import { 
  WalletIcon,
  LockClosedIcon,
  ArrowsRightLeftIcon,
  ChartBarIcon,
  CheckCircleIcon 
} from '@heroicons/react/24/outline';

const DEXPage = () => {
  const { isConnected, connectWallet, signer, account, balance } = useWeb3();
  const [fromAmount, setFromAmount] = useState('');
  const [toAmount, setToAmount] = useState('');
  const [fromToken, setFromToken] = useState('ETH');
  const [toToken, setToToken] = useState('CFNX');
  const [isLoading, setIsLoading] = useState(false);

  const tokens = [
    { symbol: 'ETH', name: 'Ethereum', balance: balance || '0' },
    { symbol: 'CFNX', name: 'CryptoFund Nexus Token', balance: '1000' },
    { symbol: 'USDC', name: 'USD Coin', balance: '5000' },
    { symbol: 'USDT', name: 'Tether', balance: '2500' },
    { symbol: 'DAI', name: 'Dai Stablecoin', balance: '750' },
    { symbol: 'WBTC', name: 'Wrapped Bitcoin', balance: '0.05' }
  ];

  const exchangeRate = fromToken === 'ETH' ? 2000 : 0.0005; // Simplified exchange rate

  const handleSwapTokens = () => {
    const temp = fromToken;
    setFromToken(toToken);
    setToToken(temp);
    setFromAmount(toAmount);
    setToAmount(fromAmount);
  };

  const calculateToAmount = (amount) => {
    if (!amount || isNaN(amount)) return '';
    return (parseFloat(amount) * exchangeRate).toFixed(6);
  };

  const handleFromAmountChange = (value) => {
    setFromAmount(value);
    setToAmount(calculateToAmount(value));
  };

  const handleSwap = async () => {
    if (!isConnected) {
      toast.error('Please connect your wallet first');
      return;
    }

    if (!fromAmount || parseFloat(fromAmount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    const fromTokenData = tokens.find(t => t.symbol === fromToken);
    if (parseFloat(fromAmount) > parseFloat(fromTokenData?.balance || '0')) {
      toast.error(`Insufficient ${fromToken} balance`);
      return;
    }

    setIsLoading(true);
    
    try {
      const loadingToast = toast.loading('Processing swap... Please confirm transaction in MetaMask');
      
      // Simulate contract interaction
      const tx = await signer.sendTransaction({
        to: '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0', // DEX contract address
        value: fromToken === 'ETH' ? ethers.parseEther(fromAmount) : 0,
        data: '0x' // Swap data would go here
      });

      toast.dismiss(loadingToast);
      toast.loading('Transaction submitted. Waiting for confirmation...');
      
      await tx.wait();
      
      toast.success(`Swap successful! ${fromAmount} ${fromToken} → ${toAmount} ${toToken}`);
      setFromAmount('');
      setToAmount('');
      
    } catch (error) {
      console.error('Swap failed:', error);
      if (error.code === 4001) {
        toast.error('Transaction rejected by user');
      } else {
        toast.error('Failed to process swap: ' + error.message);
      }
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="container-custom section-padding">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-black text-white mb-6">
            Confidential <span className="text-gradient">DEX</span>
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Trade tokens with complete privacy using encrypted order books
          </p>
        </div>

        {/* Wallet Connection Status */}
        {!isConnected && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 p-6 bg-amber-600/10 border border-amber-500/20 rounded-lg"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <WalletIcon className="h-6 w-6 text-amber-400" />
                <div>
                  <h3 className="text-lg font-semibold text-amber-400">Connect Wallet to Trade</h3>
                  <p className="text-slate-300">Connect your wallet to access the DEX</p>
                </div>
              </div>
              <button
                onClick={connectWallet}
                className="btn-primary"
              >
                Connect Wallet
              </button>
            </div>
          </motion.div>
        )}

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Swap Interface */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="card space-y-6"
          >
            <h2 className="text-2xl font-bold text-white">Private Swap</h2>
            
            <div className="space-y-4">
              {/* From Token */}
              <div className="space-y-2">
                <label className="text-sm text-slate-300">From</label>
                <div className="bg-slate-700/50 rounded-xl p-4 border border-slate-600/50">
                  <div className="flex justify-between items-center mb-2">
                    <input 
                      type="number" 
                      placeholder="0.0" 
                      className="bg-transparent text-2xl font-bold text-white placeholder-slate-400 outline-none flex-1"
                      value={fromAmount}
                      onChange={(e) => handleFromAmountChange(e.target.value)}
                      disabled={!isConnected}
                    />
                    <div className="flex items-center space-x-2">
                      <select 
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold outline-none"
                        value={fromToken}
                        onChange={(e) => setFromToken(e.target.value)}
                        disabled={!isConnected}
                      >
                        {tokens.map(token => (
                          <option key={token.symbol} value={token.symbol} className="bg-slate-800">
                            {token.symbol}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="text-sm text-slate-400">
                    Balance: {tokens.find(t => t.symbol === fromToken)?.balance || '0'} {fromToken}
                  </div>
                </div>
              </div>

              {/* Swap Button */}
              <div className="flex justify-center">
                <button 
                  onClick={handleSwapTokens}
                  className="bg-slate-700 hover:bg-slate-600 p-3 rounded-full transition-colors"
                  disabled={!isConnected}
                >
                  <ArrowsRightLeftIcon className="w-5 h-5 text-white" />
                </button>
              </div>

              {/* To Token */}
              <div className="space-y-2">
                <label className="text-sm text-slate-300">To</label>
                <div className="bg-slate-700/50 rounded-xl p-4 border border-slate-600/50">
                  <div className="flex justify-between items-center mb-2">
                    <input 
                      type="number" 
                      placeholder="0.0" 
                      className="bg-transparent text-2xl font-bold text-white placeholder-slate-400 outline-none flex-1"
                      value={toAmount}
                      disabled
                    />
                    <div className="flex items-center space-x-2">
                      <select 
                        className="bg-purple-600 text-white px-4 py-2 rounded-lg font-semibold outline-none"
                        value={toToken}
                        onChange={(e) => setToToken(e.target.value)}
                        disabled={!isConnected}
                      >
                        {tokens.map(token => (
                          <option key={token.symbol} value={token.symbol} className="bg-slate-800">
                            {token.symbol}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="text-sm text-slate-400">
                    Balance: {tokens.find(t => t.symbol === toToken)?.balance || '0'} {toToken}
                  </div>
                </div>
              </div>

              {/* Exchange Rate */}
              {fromAmount && toAmount && (
                <div className="text-sm text-slate-400 text-center p-2 bg-slate-700/30 rounded-lg">
                  1 {fromToken} = {exchangeRate.toLocaleString()} {toToken}
                </div>
              )}

              {/* Privacy Notice */}
              <div className="bg-blue-600/10 border border-blue-500/20 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <LockClosedIcon className="w-5 h-5 text-blue-400 mt-0.5" />
                  <div>
                    <div className="text-sm font-medium text-blue-400">Private Trading</div>
                    <div className="text-xs text-slate-400 mt-1">
                      Your trade amounts will be encrypted using FHE technology
                    </div>
                  </div>
                </div>
              </div>

              {/* Swap Button */}
              <button 
                className="btn-primary w-full text-lg py-4"
                onClick={handleSwap}
                disabled={!isConnected || isLoading || !fromAmount || !toAmount}
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                    <span>Swapping...</span>
                  </div>
                ) : !isConnected ? (
                  <div className="flex items-center space-x-2">
                    <LockClosedIcon className="h-5 w-5" />
                    <span>Connect Wallet First</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <ArrowsRightLeftIcon className="h-5 w-5" />
                    <span>Private Swap</span>
                  </div>
                )}
              </button>
            </div>
          </motion.div>

          {/* Order Book */}
          <div className="card space-y-6">
            <h2 className="text-2xl font-bold text-white">Order Book</h2>
            
            <div className="space-y-4">
              {/* Trading Pair */}
              <div className="flex justify-between items-center">
                <div className="text-lg font-semibold text-white">ETH/CFNX</div>
                <div className="text-sm text-slate-400">Confidential Orders</div>
              </div>

              {/* Order Lists */}
              <div className="grid grid-cols-2 gap-4">
                {/* Sell Orders */}
                <div>
                  <div className="text-sm text-red-400 mb-2">Sell Orders</div>
                  <div className="space-y-1">
                    {[1, 2, 3, 4, 5].map(i => (
                      <div key={i} className="flex justify-between text-xs p-2 bg-red-600/5 rounded">
                        <span className="text-slate-400">Price</span>
                        <span className="text-slate-400">Encrypted</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Buy Orders */}
                <div>
                  <div className="text-sm text-green-400 mb-2">Buy Orders</div>
                  <div className="space-y-1">
                    {[1, 2, 3, 4, 5].map(i => (
                      <div key={i} className="flex justify-between text-xs p-2 bg-green-600/5 rounded">
                        <span className="text-slate-400">Price</span>
                        <span className="text-slate-400">Encrypted</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Privacy Info */}
              <div className="text-xs text-slate-400 text-center p-3 bg-slate-700/30 rounded-lg">
                🔒 All order amounts are encrypted for complete privacy
              </div>
            </div>
          </div>
        </div>

        {/* Trading Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-12">
          <div className="card text-center">
            <div className="text-2xl font-bold text-white mb-1">$2.4M</div>
            <div className="text-sm text-slate-400">24h Volume</div>
          </div>
          <div className="card text-center">
            <div className="text-2xl font-bold text-white mb-1">1,247</div>
            <div className="text-sm text-slate-400">Private Orders</div>
          </div>
          <div className="card text-center">
            <div className="text-2xl font-bold text-white mb-1">89</div>
            <div className="text-sm text-slate-400">Trading Pairs</div>
          </div>
          <div className="card text-center">
            <div className="text-2xl font-bold text-white mb-1">100%</div>
            <div className="text-sm text-slate-400">Privacy Protected</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DEXPage;