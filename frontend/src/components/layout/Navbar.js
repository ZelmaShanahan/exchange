import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useWeb3 } from '../../contexts/Web3Context';
import { 
  WalletIcon,
  CheckCircleIcon,
  ChevronDownIcon
} from '@heroicons/react/24/outline';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isWalletMenuOpen, setIsWalletMenuOpen] = useState(false);
  const location = useLocation();
  const { isConnected, connectWallet, disconnect, account, balance, formatAddress, formatBalance } = useWeb3();

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Projects', href: '/projects' },
    { name: 'DEX', href: '/dex' },
    { name: 'Create', href: '/create' },
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'About', href: '/about' }
  ];

  const isActive = (href) => {
    return location.pathname === href;
  };

  return (
    <nav className="bg-slate-900/95 backdrop-blur-sm border-b border-slate-700/50 sticky top-0 z-50">
      <div className="container-custom">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-black text-lg">CFN</span>
            </div>
            <span className="text-xl font-black text-white">CryptoFund Nexus</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  isActive(item.href)
                    ? 'bg-slate-700/50 text-white'
                    : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Wallet Connect Button */}
          <div className="hidden lg:flex items-center space-x-4">
            {!isConnected ? (
              <button 
                onClick={connectWallet}
                className="btn-primary flex items-center space-x-2"
              >
                <WalletIcon className="h-5 w-5" />
                <span>Connect Wallet</span>
              </button>
            ) : (
              <div className="relative">
                <button
                  onClick={() => setIsWalletMenuOpen(!isWalletMenuOpen)}
                  className="flex items-center space-x-3 bg-emerald-600/10 border border-emerald-500/20 rounded-lg px-4 py-2 hover:bg-emerald-600/20 transition-colors"
                >
                  <CheckCircleIcon className="h-5 w-5 text-emerald-400" />
                  <div className="text-left">
                    <div className="text-sm font-semibold text-white">{formatAddress(account)}</div>
                    <div className="text-xs text-slate-400">{formatBalance(balance)} ETH</div>
                  </div>
                  <ChevronDownIcon className={`h-4 w-4 text-slate-400 transition-transform ${isWalletMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {isWalletMenuOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-slate-800 border border-slate-700 rounded-lg shadow-xl z-50">
                    <div className="p-4 border-b border-slate-700">
                      <div className="text-sm text-slate-300 mb-1">Account</div>
                      <div className="text-white font-mono text-sm">{account}</div>
                    </div>
                    <div className="p-4 border-b border-slate-700">
                      <div className="text-sm text-slate-300 mb-1">Balance</div>
                      <div className="text-white font-semibold">{formatBalance(balance)} ETH</div>
                    </div>
                    <div className="p-2">
                      <button
                        onClick={() => {
                          disconnect();
                          setIsWalletMenuOpen(false);
                        }}
                        className="w-full text-left px-3 py-2 text-sm text-red-400 hover:bg-red-600/10 rounded-md transition-colors"
                      >
                        Disconnect Wallet
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 text-slate-300 hover:text-white"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden border-t border-slate-700/50 py-4">
            <div className="space-y-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={`block px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                    isActive(item.href)
                      ? 'bg-slate-700/50 text-white'
                      : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
              {!isConnected ? (
                <button 
                  onClick={connectWallet}
                  className="btn-primary w-full mt-4 flex items-center justify-center space-x-2"
                >
                  <WalletIcon className="h-5 w-5" />
                  <span>Connect Wallet</span>
                </button>
              ) : (
                <div className="mt-4 p-4 bg-emerald-600/10 border border-emerald-500/20 rounded-lg">
                  <div className="flex items-center space-x-3 mb-3">
                    <CheckCircleIcon className="h-5 w-5 text-emerald-400" />
                    <div>
                      <div className="text-sm font-semibold text-white">{formatAddress(account)}</div>
                      <div className="text-xs text-slate-400">{formatBalance(balance)} ETH</div>
                    </div>
                  </div>
                  <button
                    onClick={disconnect}
                    className="w-full text-sm text-red-400 hover:bg-red-600/10 px-3 py-2 rounded-md transition-colors"
                  >
                    Disconnect Wallet
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;