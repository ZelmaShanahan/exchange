import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { ethers } from 'ethers';
import { useWeb3 } from '../contexts/Web3Context';
import { Link } from 'react-router-dom';
import { 
  WalletIcon,
  LockClosedIcon,
  CurrencyDollarIcon,
  HeartIcon,
  EyeIcon 
} from '@heroicons/react/24/outline';

const ProjectsPage = () => {
  const { isConnected, connectWallet, signer, account } = useWeb3();
  const [loadingStates, setLoadingStates] = useState({});

  const handleInvest = async (projectId, isInvestment = true) => {
    if (!isConnected) {
      toast.error('Please connect your wallet first');
      return;
    }

    const amount = prompt(`Enter ${isInvestment ? 'investment' : 'donation'} amount (ETH):`);
    if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    setLoadingStates(prev => ({ ...prev, [projectId]: true }));
    
    try {
      const loadingToast = toast.loading(
        `Processing ${isInvestment ? 'investment' : 'donation'}... Please confirm transaction in MetaMask`
      );
      
      // Simulate contract interaction
      const tx = await signer.sendTransaction({
        to: '0x5FbDB2315678afecb367f032d93F642f64180aa3', // Contract address
        value: ethers.parseEther(amount),
        data: '0x' // Investment/donation data would go here
      });

      toast.dismiss(loadingToast);
      toast.loading('Transaction submitted. Waiting for confirmation...');
      
      await tx.wait();
      
      toast.success(`${isInvestment ? 'Investment' : 'Donation'} successful! Amount: ${amount} ETH`);
      
    } catch (error) {
      console.error('Transaction failed:', error);
      if (error.code === 4001) {
        toast.error('Transaction rejected by user');
      } else {
        toast.error(`Failed to process ${isInvestment ? 'investment' : 'donation'}: ` + error.message);
      }
    } finally {
      setLoadingStates(prev => ({ ...prev, [projectId]: false }));
    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="container-custom section-padding">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-black text-white mb-6">
            Active <span className="text-gradient">Projects</span>
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Discover innovative projects raising funds with complete privacy protection
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
                  <h3 className="text-lg font-semibold text-amber-400">Connect Wallet to Invest</h3>
                  <p className="text-slate-300">Connect your wallet to participate in projects</p>
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Sample Project Cards */}
          {[1, 2, 3, 4, 5, 6].map((project) => (
            <motion.div 
              key={project} 
              className="card-hover"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: project * 0.1 }}
            >
              <div className="space-y-6">
                {/* Project Image */}
                <div className="h-48 bg-gradient-to-br from-blue-600/20 to-purple-600/20 rounded-xl flex items-center justify-center">
                  <div className="text-6xl">🚀</div>
                </div>

                {/* Project Info */}
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">
                      DeFi Project #{project}
                    </h3>
                    <p className="text-slate-300 text-sm">
                      Revolutionary DeFi protocol with private fundraising capabilities using advanced encryption.
                    </p>
                  </div>

                  {/* Privacy Badge */}
                  <div className="flex items-center space-x-2 p-2 bg-blue-600/10 border border-blue-500/20 rounded-lg">
                    <LockClosedIcon className="h-4 w-4 text-blue-400" />
                    <span className="text-xs text-blue-400">Private Investment Protected</span>
                  </div>

                  {/* Progress */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">Progress</span>
                      <span className="text-white font-semibold">{65 + project * 5}%</span>
                    </div>
                    <div className="progress-bar h-2">
                      <div 
                        className="progress-fill" 
                        style={{ width: `${65 + project * 5}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-sm text-slate-400">Raised</div>
                      <div className="text-white font-bold">Private</div>
                    </div>
                    <div>
                      <div className="text-sm text-slate-400">Investors</div>
                      <div className="text-white font-bold">{120 + project * 15}</div>
                    </div>
                    <div>
                      <div className="text-sm text-slate-400">Days Left</div>
                      <div className="text-white font-bold">{30 - project * 2}</div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="grid grid-cols-2 gap-3">
                    <button 
                      className="btn-primary"
                      onClick={() => handleInvest(project, true)}
                      disabled={!isConnected || loadingStates[project]}
                    >
                      {loadingStates[project] ? (
                        <div className="flex items-center space-x-1">
                          <div className="animate-spin rounded-full h-3 w-3 border-2 border-white border-t-transparent"></div>
                          <span className="text-xs">Processing...</span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-1">
                          <CurrencyDollarIcon className="h-4 w-4" />
                          <span>Invest</span>
                        </div>
                      )}
                    </button>
                    
                    <button 
                      className="btn-secondary"
                      onClick={() => handleInvest(project, false)}
                      disabled={!isConnected || loadingStates[project]}
                    >
                      {loadingStates[project] ? (
                        <div className="flex items-center space-x-1">
                          <div className="animate-spin rounded-full h-3 w-3 border-2 border-white border-t-transparent"></div>
                          <span className="text-xs">Processing...</span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-1">
                          <HeartIcon className="h-4 w-4" />
                          <span>Donate</span>
                        </div>
                      )}
                    </button>
                  </div>
                  
                  {/* View Details Button */}
                  <Link 
                    to={`/projects/${project}`}
                    className="btn-outline w-full flex items-center justify-center space-x-2"
                  >
                    <EyeIcon className="h-4 w-4" />
                    <span>View Details</span>
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProjectsPage;