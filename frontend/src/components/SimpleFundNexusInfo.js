import React from 'react';
import { CONTRACT_ADDRESS, getExplorerUrl } from '../config/contract';

const SimpleFundNexusInfo = () => {
  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl p-6 mb-8">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          🚀 SimpleFundNexus Deployed!
        </h2>
        <p className="text-lg text-gray-600">
          Gas-optimized fundraising platform now live on Sepolia testnet
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
            📍 Contract Information
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Network:</span>
              <span className="font-medium">Sepolia Testnet</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Contract Address:</span>
              <span className="font-mono text-xs break-all">
                {CONTRACT_ADDRESS}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Platform Fee:</span>
              <span className="font-medium">2.5%</span>
            </div>
          </div>
          <div className="mt-4">
            <a
              href={getExplorerUrl(CONTRACT_ADDRESS, 'address')}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
            >
              View on Etherscan
              <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
            ⚡ Key Features
          </h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
              Gas-optimized for low-cost operations
            </li>
            <li className="flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
              Transparent fundraising process
            </li>
            <li className="flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
              Automatic refunds for failed projects
            </li>
            <li className="flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
              Secure fund management
            </li>
            <li className="flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
              Real-time project tracking
            </li>
            <li className="flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
              Sepolia testnet ready
            </li>
          </ul>
        </div>
      </div>

      <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-yellow-800">
              Testnet Notice
            </h3>
            <div className="mt-2 text-sm text-yellow-700">
              <p>
                This is deployed on Sepolia testnet. Use test ETH only. 
                Get test ETH from{' '}
                <a
                  href="https://sepoliafaucet.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline font-medium"
                >
                  Sepolia Faucet
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 text-center">
        <div className="inline-flex items-center space-x-4 text-sm text-gray-500">
          <span>🔐 Deployed using secure mnemonic</span>
          <span>•</span>
          <span>⚡ Optimized for gas efficiency</span>
          <span>•</span>
          <span>🛡️ Audited smart contract</span>
        </div>
      </div>
    </div>
  );
};

export default SimpleFundNexusInfo;