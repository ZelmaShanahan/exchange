import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-slate-900/95 border-t border-slate-700/50">
      <div className="container-custom py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-black text-lg">CFN</span>
              </div>
              <span className="text-xl font-black text-white">CryptoFund Nexus</span>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed">
              The future of privacy-preserving fundraising using advanced FHE technology.
            </p>
          </div>

          {/* Platform */}
          <div>
            <h3 className="text-white font-semibold mb-4">Platform</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/projects" className="text-slate-400 hover:text-white text-sm transition-colors">
                  Browse Projects
                </Link>
              </li>
              <li>
                <Link to="/create" className="text-slate-400 hover:text-white text-sm transition-colors">
                  Create Project
                </Link>
              </li>
              <li>
                <Link to="/dex" className="text-slate-400 hover:text-white text-sm transition-colors">
                  Confidential DEX
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-slate-400 hover:text-white text-sm transition-colors">
                  Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-white font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-slate-400 hover:text-white text-sm transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <a href="#" className="text-slate-400 hover:text-white text-sm transition-colors">
                  Documentation
                </a>
              </li>
              <li>
                <a href="#" className="text-slate-400 hover:text-white text-sm transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-slate-400 hover:text-white text-sm transition-colors">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>

          {/* Community */}
          <div>
            <h3 className="text-white font-semibold mb-4">Community</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-slate-400 hover:text-white text-sm transition-colors">
                  Discord
                </a>
              </li>
              <li>
                <a href="#" className="text-slate-400 hover:text-white text-sm transition-colors">
                  Twitter
                </a>
              </li>
              <li>
                <a href="#" className="text-slate-400 hover:text-white text-sm transition-colors">
                  GitHub
                </a>
              </li>
              <li>
                <a href="#" className="text-slate-400 hover:text-white text-sm transition-colors">
                  Telegram
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-700/50 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-slate-400 text-sm">
            © 2024 CryptoFund Nexus. All rights reserved.
          </p>
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <span className="text-slate-400 text-sm">Powered by</span>
            <div className="flex items-center space-x-2">
              <span className="text-sm font-semibold text-purple-400">Zama FHE</span>
              <span className="text-slate-500">•</span>
              <span className="text-sm font-semibold text-blue-400">Ethereum</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;