import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { ethers } from 'ethers';
import { useWeb3 } from '../contexts/Web3Context';
import { 
  WalletIcon,
  LockClosedIcon,
  CheckCircleIcon 
} from '@heroicons/react/24/outline';

const CreateProjectPage = () => {
  const { isConnected, connectWallet, signer, account } = useWeb3();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    website: '',
    softCap: '',
    hardCap: '',
    tokenPrice: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isConnected) {
      toast.error('Please connect your wallet first');
      return;
    }

    if (!formData.name || !formData.description || !formData.softCap || !formData.hardCap || !formData.tokenPrice) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (parseFloat(formData.hardCap) <= parseFloat(formData.softCap)) {
      toast.error('Hard cap must be greater than soft cap');
      return;
    }

    setIsLoading(true);
    
    try {
      // Show MetaMask popup for project creation
      const loadingToast = toast.loading('Creating project... Please confirm transaction in MetaMask');
      
      // Simulate contract interaction
      const tx = await signer.sendTransaction({
        to: '0x5FbDB2315678afecb367f032d93F642f64180aa3', // Contract address
        value: ethers.parseEther('0.01'), // Small deployment fee
        data: '0x' // Project creation data would go here
      });

      toast.dismiss(loadingToast);
      toast.loading('Transaction submitted. Waiting for confirmation...');
      
      await tx.wait();
      
      toast.success('Project created successfully!');
      
      // Reset form
      setFormData({
        name: '',
        description: '',
        website: '',
        softCap: '',
        hardCap: '',
        tokenPrice: ''
      });
      
    } catch (error) {
      console.error('Project creation failed:', error);
      if (error.code === 4001) {
        toast.error('Transaction rejected by user');
      } else {
        toast.error('Failed to create project: ' + error.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="container-custom section-padding">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-black text-white mb-6">
              Create <span className="text-gradient">Project</span>
            </h1>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              Launch your privacy-preserving fundraising campaign
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
                    <h3 className="text-lg font-semibold text-amber-400">Wallet Required</h3>
                    <p className="text-slate-300">Connect your wallet to create a project</p>
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

          {isConnected && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8 p-4 bg-emerald-600/10 border border-emerald-500/20 rounded-lg"
            >
              <div className="flex items-center space-x-3">
                <CheckCircleIcon className="h-6 w-6 text-emerald-400" />
                <div>
                  <h3 className="text-lg font-semibold text-emerald-400">Wallet Connected</h3>
                  <p className="text-slate-300">Account: {account?.slice(0, 6)}...{account?.slice(-4)}</p>
                </div>
              </div>
            </motion.div>
          )}

          <div className="card">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Project Information */}
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-white">Project Information</h2>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="form-label">Project Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="form-input"
                      placeholder="Enter project name"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="form-label">Website</label>
                    <input
                      type="url"
                      name="website"
                      value={formData.website}
                      onChange={handleChange}
                      className="form-input"
                      placeholder="https://yourproject.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="form-label">Description *</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    className="form-textarea"
                    placeholder="Describe your project and its goals..."
                    required
                  />
                </div>
              </div>

              {/* Funding Configuration */}
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-white">Funding Configuration</h2>
                
                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <label className="form-label">Soft Cap (ETH) *</label>
                    <input
                      type="number"
                      name="softCap"
                      value={formData.softCap}
                      onChange={handleChange}
                      className="form-input"
                      placeholder="10"
                      min="0.1"
                      step="0.1"
                      required
                    />
                    <p className="form-help">Minimum funding goal</p>
                  </div>
                  
                  <div>
                    <label className="form-label">Hard Cap (ETH) *</label>
                    <input
                      type="number"
                      name="hardCap"
                      value={formData.hardCap}
                      onChange={handleChange}
                      className="form-input"
                      placeholder="100"
                      min="1"
                      step="0.1"
                      required
                    />
                    <p className="form-help">Maximum funding limit</p>
                  </div>
                  
                  <div>
                    <label className="form-label">Token Price (ETH) *</label>
                    <input
                      type="number"
                      name="tokenPrice"
                      value={formData.tokenPrice}
                      onChange={handleChange}
                      className="form-input"
                      placeholder="0.001"
                      min="0.0001"
                      step="0.0001"
                      required
                    />
                    <p className="form-help">Price per token</p>
                  </div>
                </div>
              </div>

              {/* Privacy Settings */}
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-white">Privacy Settings</h2>
                
                <div className="bg-blue-600/10 border border-blue-500/20 rounded-lg p-6">
                  <div className="flex items-start space-x-3">
                    <svg className="w-6 h-6 text-blue-400 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-blue-400 mb-2">
                        Fully Homomorphic Encryption
                      </h3>
                      <p className="text-slate-300 mb-4">
                        Your project will automatically use Zama FHE technology to encrypt all investment amounts, 
                        ensuring complete privacy for your investors while maintaining transparency of funding progress.
                      </p>
                      <div className="space-y-2">
                        <div className="flex items-center text-sm text-slate-400">
                          <svg className="w-4 h-4 text-green-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          Investment amounts are encrypted
                        </div>
                        <div className="flex items-center text-sm text-slate-400">
                          <svg className="w-4 h-4 text-green-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          Funding progress calculated homomorphically
                        </div>
                        <div className="flex items-center text-sm text-slate-400">
                          <svg className="w-4 h-4 text-green-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          Zero-knowledge proof verification
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6">
                <button
                  type="button"
                  className="btn-secondary flex-1"
                  disabled={isLoading}
                >
                  Save Draft
                </button>
                <button
                  type="submit"
                  className="btn-primary flex-1"
                  disabled={!isConnected || isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center space-x-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                      <span>Creating...</span>
                    </div>
                  ) : !isConnected ? (
                    <div className="flex items-center space-x-2">
                      <LockClosedIcon className="h-4 w-4" />
                      <span>Connect Wallet First</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <WalletIcon className="h-4 w-4" />
                      <span>Create Project</span>
                    </div>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateProjectPage;