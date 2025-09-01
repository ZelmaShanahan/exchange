import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { ethers } from 'ethers';
import { useWeb3 } from '../contexts/Web3Context';
import { 
  WalletIcon,
  LockClosedIcon,
  CurrencyDollarIcon,
  HeartIcon,
  CheckCircleIcon 
} from '@heroicons/react/24/outline';

const ProjectDetailsPage = () => {
  const { id } = useParams();
  const { isConnected, connectWallet, signer, account } = useWeb3();
  const [investmentAmount, setInvestmentAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleInvestment = async (isInvestment = true) => {
    if (!isConnected) {
      toast.error('Please connect your wallet first');
      return;
    }

    if (!investmentAmount || isNaN(investmentAmount) || parseFloat(investmentAmount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    if (parseFloat(investmentAmount) < 0.1) {
      toast.error('Minimum investment is 0.1 ETH');
      return;
    }

    if (parseFloat(investmentAmount) > 10) {
      toast.error('Maximum investment is 10 ETH');
      return;
    }

    setIsLoading(true);
    
    try {
      const loadingToast = toast.loading(
        `Processing ${isInvestment ? 'investment' : 'donation'}... Please confirm transaction in MetaMask`
      );
      
      // Simulate contract interaction
      const tx = await signer.sendTransaction({
        to: '0x5FbDB2315678afecb367f032d93F642f64180aa3',
        value: ethers.parseEther(investmentAmount),
        data: '0x'
      });

      toast.dismiss(loadingToast);
      toast.loading('Transaction submitted. Waiting for confirmation...');
      
      await tx.wait();
      
      toast.success(`${isInvestment ? 'Investment' : 'Donation'} successful! Amount: ${investmentAmount} ETH`);
      setInvestmentAmount('');
      
    } catch (error) {
      console.error('Transaction failed:', error);
      if (error.code === 4001) {
        toast.error('Transaction rejected by user');
      } else {
        toast.error(`Failed to process ${isInvestment ? 'investment' : 'donation'}: ` + error.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="container-custom section-padding">
        {/* Project Header */}
        <div className="card mb-8">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <span className="badge-success">Verified</span>
                <span className="badge-primary">Gold Tier</span>
              </div>
              <h1 className="text-4xl font-black text-white mb-4">
                Revolutionary DeFi Project #{id}
              </h1>
              <p className="text-lg text-slate-300 mb-6">
                An innovative DeFi protocol that leverages privacy-preserving technology 
                to create a more secure and private financial ecosystem for all users.
              </p>
              <div className="flex items-center space-x-6 text-sm text-slate-400">
                <div className="flex items-center space-x-2">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0 0V3" />
                  </svg>
                  <span>Website</span>
                </div>
                <div className="flex items-center space-x-2">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span>Whitepaper</span>
                </div>
                <div className="flex items-center space-x-2">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                  <span>GitHub</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-6">
              {/* Funding Progress */}
              <div className="bg-slate-700/30 rounded-xl p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-bold text-white">Funding Progress</h3>
                  <span className="text-2xl font-black text-white">75%</span>
                </div>
                <div className="progress-bar h-3 mb-4">
                  <div className="progress-fill" style={{ width: '75%' }}></div>
                </div>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-sm text-slate-400">Raised</div>
                    <div className="text-white font-bold">Private</div>
                  </div>
                  <div>
                    <div className="text-sm text-slate-400">Investors</div>
                    <div className="text-white font-bold">247</div>
                  </div>
                  <div>
                    <div className="text-sm text-slate-400">Days Left</div>
                    <div className="text-white font-bold">15</div>
                  </div>
                </div>
              </div>

              {/* Wallet Connection Status */}
              {!isConnected && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 p-4 bg-amber-600/10 border border-amber-500/20 rounded-lg"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <WalletIcon className="h-5 w-5 text-amber-400" />
                      <div>
                        <h3 className="text-sm font-semibold text-amber-400">Connect Wallet</h3>
                        <p className="text-xs text-slate-300">Connect to invest or donate</p>
                      </div>
                    </div>
                    <button
                      onClick={connectWallet}
                      className="btn-primary text-sm px-4 py-2"
                    >
                      Connect
                    </button>
                  </div>
                </motion.div>
              )}

              {isConnected && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 p-4 bg-emerald-600/10 border border-emerald-500/20 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <CheckCircleIcon className="h-5 w-5 text-emerald-400" />
                    <div>
                      <h3 className="text-sm font-semibold text-emerald-400">Wallet Connected</h3>
                      <p className="text-xs text-slate-300">Account: {account?.slice(0, 6)}...{account?.slice(-4)}</p>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Investment Form */}
              <div className="bg-slate-700/30 rounded-xl p-6">
                <h3 className="text-lg font-bold text-white mb-4">Make Private Investment</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-slate-300 mb-2">Investment Amount (ETH)</label>
                    <input
                      type="number"
                      placeholder="0.0"
                      className="form-input"
                      min="0.1"
                      max="10"
                      step="0.1"
                      value={investmentAmount}
                      onChange={(e) => setInvestmentAmount(e.target.value)}
                      disabled={!isConnected || isLoading}
                    />
                    <p className="text-xs text-slate-400 mt-1">Min: 0.1 ETH | Max: 10 ETH</p>
                  </div>
                  
                  <div className="bg-blue-600/10 border border-blue-500/20 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      <LockClosedIcon className="w-5 h-5 text-blue-400 mt-0.5" />
                      <div>
                        <div className="text-sm font-medium text-blue-400">Private Investment</div>
                        <div className="text-xs text-slate-400 mt-1">
                          Your investment amount will be encrypted using FHE technology
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <button 
                      className="btn-primary text-lg py-3"
                      onClick={() => handleInvestment(true)}
                      disabled={!isConnected || isLoading || !investmentAmount}
                    >
                      {isLoading ? (
                        <div className="flex items-center space-x-2">
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                          <span>Processing...</span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <CurrencyDollarIcon className="h-4 w-4" />
                          <span>Invest</span>
                        </div>
                      )}
                    </button>
                    
                    <button 
                      className="btn-secondary text-lg py-3"
                      onClick={() => handleInvestment(false)}
                      disabled={!isConnected || isLoading || !investmentAmount}
                    >
                      {isLoading ? (
                        <div className="flex items-center space-x-2">
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                          <span>Processing...</span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <HeartIcon className="h-4 w-4" />
                          <span>Donate</span>
                        </div>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Project Description */}
            <div className="card">
              <h2 className="text-2xl font-bold text-white mb-6">Project Description</h2>
              <div className="prose prose-invert max-w-none">
                <p className="text-slate-300 leading-relaxed mb-4">
                  This revolutionary DeFi project aims to transform the financial landscape by implementing 
                  cutting-edge privacy-preserving technologies. Our protocol ensures that users can 
                  participate in DeFi activities while maintaining complete financial privacy.
                </p>
                <p className="text-slate-300 leading-relaxed mb-4">
                  Key innovations include homomorphic encryption for private computations, zero-knowledge 
                  proofs for transaction validation, and a novel consensus mechanism that maintains 
                  privacy without sacrificing security or decentralization.
                </p>
                <p className="text-slate-300 leading-relaxed">
                  The funds raised will be used for protocol development, security audits, team expansion, 
                  and community building initiatives to ensure widespread adoption of privacy-preserving DeFi.
                </p>
              </div>
            </div>

            {/* Tokenomics */}
            <div className="card">
              <h2 className="text-2xl font-bold text-white mb-6">Tokenomics</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-slate-300">Total Supply</span>
                    <span className="text-white font-semibold">1,000,000,000</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-300">Public Sale</span>
                    <span className="text-white font-semibold">30%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-300">Team & Advisors</span>
                    <span className="text-white font-semibold">20%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-300">Development</span>
                    <span className="text-white font-semibold">25%</span>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-slate-300">Marketing</span>
                    <span className="text-white font-semibold">10%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-300">Liquidity</span>
                    <span className="text-white font-semibold">10%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-300">Reserve</span>
                    <span className="text-white font-semibold">5%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-300">Token Price</span>
                    <span className="text-white font-semibold">0.001 ETH</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Roadmap */}
            <div className="card">
              <h2 className="text-2xl font-bold text-white mb-6">Roadmap</h2>
              <div className="space-y-6">
                {[
                  { quarter: 'Q2 2024', title: 'Protocol Development', status: 'completed' },
                  { quarter: 'Q3 2024', title: 'Testnet Launch', status: 'in-progress' },
                  { quarter: 'Q4 2024', title: 'Mainnet Launch', status: 'upcoming' },
                  { quarter: 'Q1 2025', title: 'Mobile App Release', status: 'upcoming' }
                ].map((milestone, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className={`w-4 h-4 rounded-full mt-1 ${
                      milestone.status === 'completed' ? 'bg-green-400' :
                      milestone.status === 'in-progress' ? 'bg-blue-400' :
                      'bg-slate-500'
                    }`}></div>
                    <div>
                      <div className="text-white font-semibold">{milestone.title}</div>
                      <div className="text-slate-400 text-sm">{milestone.quarter}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Project Stats */}
            <div className="card">
              <h3 className="text-lg font-bold text-white mb-4">Project Statistics</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-slate-400">Created</span>
                  <span className="text-white">March 15, 2024</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Category</span>
                  <span className="text-white">DeFi</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Verification</span>
                  <span className="text-green-400">Gold Tier</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Audit Status</span>
                  <span className="text-green-400">Completed</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">KYC Status</span>
                  <span className="text-green-400">Verified</span>
                </div>
              </div>
            </div>

            {/* Team */}
            <div className="card">
              <h3 className="text-lg font-bold text-white mb-4">Team</h3>
              <div className="space-y-4">
                {['CEO & Founder', 'CTO', 'Lead Developer'].map((role, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full"></div>
                    <div>
                      <div className="text-white font-medium">Team Member</div>
                      <div className="text-slate-400 text-sm">{role}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="card">
              <h3 className="text-lg font-bold text-white mb-4">Recent Activity</h3>
              <div className="space-y-3">
                {[
                  'New private investment received',
                  'Project milestone completed',
                  'Team AMA session scheduled',
                  'Security audit report published'
                ].map((activity, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-400 rounded-full mt-2"></div>
                    <div className="text-sm text-slate-300">{activity}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailsPage;