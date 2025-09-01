import React from 'react';

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="container-custom section-padding">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-black text-white mb-6">
            About <span className="text-gradient">CryptoFund Nexus</span>
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            The future of privacy-preserving fundraising is here
          </p>
        </div>

        <div className="space-y-16">
          {/* Mission */}
          <div className="card text-center">
            <h2 className="text-3xl font-bold text-white mb-6">Our Mission</h2>
            <p className="text-lg text-slate-300 max-w-3xl mx-auto leading-relaxed">
              CryptoFund Nexus revolutionizes fundraising by combining cutting-edge privacy technology 
              with decentralized finance. We believe everyone deserves financial privacy while 
              maintaining transparency and trust in the fundraising ecosystem.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="card text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-blue-600/20 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Complete Privacy</h3>
              <p className="text-slate-300">
                Investment amounts are encrypted using Zama's FHE technology, ensuring complete confidentiality.
              </p>
            </div>

            <div className="card text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-purple-600/20 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Advanced Technology</h3>
              <p className="text-slate-300">
                Built with the latest FHE protocols and zero-knowledge proofs for maximum security.
              </p>
            </div>

            <div className="card text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-emerald-600/20 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Community Driven</h3>
              <p className="text-slate-300">
                Governed by the community with transparent decision-making and decentralized control.
              </p>
            </div>

            <div className="card text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-yellow-600/20 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Verified Projects</h3>
              <p className="text-slate-300">
                Multi-tier verification system ensures only legitimate projects reach our platform.
              </p>
            </div>

            <div className="card text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-red-600/20 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">High Success Rate</h3>
              <p className="text-slate-300">
                Our platform maintains a 94% success rate for funded projects with comprehensive support.
              </p>
            </div>

            <div className="card text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-indigo-600/20 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Global Access</h3>
              <p className="text-slate-300">
                Decentralized platform accessible worldwide with no geographical restrictions.
              </p>
            </div>
          </div>

          {/* Technology Stack */}
          <div className="card">
            <h2 className="text-3xl font-bold text-white mb-8 text-center">Technology Stack</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-bold text-white mb-4">Blockchain & Privacy</h3>
                <ul className="space-y-2 text-slate-300">
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-blue-400 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Zama Fully Homomorphic Encryption
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-blue-400 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Ethereum Smart Contracts
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-blue-400 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Zero-Knowledge Proofs
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-blue-400 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    OpenZeppelin Security Standards
                  </li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-xl font-bold text-white mb-4">Frontend & User Experience</h3>
                <ul className="space-y-2 text-slate-300">
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-blue-400 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    React 18 with Modern Hooks
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-blue-400 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Tailwind CSS Design System
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-blue-400 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Ethers.js Web3 Integration
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-blue-400 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Framer Motion Animations
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Team */}
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white mb-8">Our Team</h2>
            <p className="text-lg text-slate-300 mb-8 max-w-2xl mx-auto">
              Built by a team of blockchain experts, cryptography researchers, and privacy advocates 
              dedicated to revolutionizing decentralized fundraising.
            </p>
            
            <div className="flex justify-center space-x-6">
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mx-auto mb-4"></div>
                <div className="text-white font-semibold">Privacy Team</div>
                <div className="text-slate-400 text-sm">Cryptography & FHE</div>
              </div>
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full mx-auto mb-4"></div>
                <div className="text-white font-semibold">Blockchain Team</div>
                <div className="text-slate-400 text-sm">Smart Contracts & DeFi</div>
              </div>
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-r from-emerald-600 to-blue-600 rounded-full mx-auto mb-4"></div>
                <div className="text-white font-semibold">Frontend Team</div>
                <div className="text-slate-400 text-sm">UI/UX & Development</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;