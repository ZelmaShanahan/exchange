import React from 'react';

const DashboardPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="container-custom section-padding">
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4">
            Dashboard
          </h1>
          <p className="text-xl text-slate-300">
            Manage your private investments and projects
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="card text-center">
            <div className="text-3xl font-black text-white mb-2">Private</div>
            <div className="text-sm text-slate-400">Total Invested</div>
          </div>
          <div className="card text-center">
            <div className="text-3xl font-black text-white mb-2">12</div>
            <div className="text-sm text-slate-400">Active Investments</div>
          </div>
          <div className="card text-center">
            <div className="text-3xl font-black text-white mb-2">3</div>
            <div className="text-sm text-slate-400">My Projects</div>
          </div>
          <div className="card text-center">
            <div className="text-3xl font-black text-white mb-2">+24%</div>
            <div className="text-sm text-slate-400">Portfolio Growth</div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* My Investments */}
          <div className="card">
            <h2 className="text-2xl font-bold text-white mb-6">My Investments</h2>
            <div className="space-y-4">
              {[1, 2, 3].map(investment => (
                <div key={investment} className="bg-slate-700/30 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="text-white font-semibold">DeFi Project #{investment}</h3>
                      <p className="text-slate-400 text-sm">Invested on March {investment + 10}, 2024</p>
                    </div>
                    <span className="badge-success">Funded</span>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <div className="text-slate-400">Investment</div>
                      <div className="text-white font-semibold">Private</div>
                    </div>
                    <div>
                      <div className="text-slate-400">Tokens</div>
                      <div className="text-white font-semibold">{(investment * 1000).toLocaleString()}</div>
                    </div>
                    <div>
                      <div className="text-slate-400">Status</div>
                      <div className="text-green-400 font-semibold">Claimable</div>
                    </div>
                  </div>
                  <button className="btn-primary w-full mt-4">
                    Claim Tokens
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* My Projects */}
          <div className="card">
            <h2 className="text-2xl font-bold text-white mb-6">My Projects</h2>
            <div className="space-y-4">
              {[1, 2].map(project => (
                <div key={project} className="bg-slate-700/30 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="text-white font-semibold">My Project #{project}</h3>
                      <p className="text-slate-400 text-sm">Created on March {project * 5}, 2024</p>
                    </div>
                    <span className="badge-primary">Active</span>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">Progress</span>
                      <span className="text-white font-semibold">{65 + project * 15}%</span>
                    </div>
                    <div className="progress-bar h-2">
                      <div 
                        className="progress-fill" 
                        style={{ width: `${65 + project * 15}%` }}
                      ></div>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <div className="text-slate-400">Raised</div>
                        <div className="text-white font-semibold">Private</div>
                      </div>
                      <div>
                        <div className="text-slate-400">Investors</div>
                        <div className="text-white font-semibold">{120 + project * 50}</div>
                      </div>
                      <div>
                        <div className="text-slate-400">Days Left</div>
                        <div className="text-white font-semibold">{30 - project * 5}</div>
                      </div>
                    </div>
                  </div>
                  <button className="btn-secondary w-full mt-4">
                    Manage Project
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;