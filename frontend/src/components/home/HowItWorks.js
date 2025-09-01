import React from 'react';

const HowItWorks = () => {
  const steps = [
    {
      step: "01",
      title: "Create Your Project",
      description: "Launch your funding campaign with complete privacy. Set your goals, milestones, and funding requirements.",
      icon: "📝",
      features: ["Anonymous project creation", "Encrypted project details", "Private goal setting"]
    },
    {
      step: "02", 
      title: "Secure Contributions",
      description: "Contributors can support your project with full confidentiality using our FHE-powered infrastructure.",
      icon: "🔐",
      features: ["Anonymous contributions", "Encrypted transactions", "Zero-knowledge verification"]
    },
    {
      step: "03",
      title: "Track Progress Privately",
      description: "Monitor your campaign's progress through encrypted analytics while maintaining complete privacy.",
      icon: "📊",
      features: ["Private analytics", "Encrypted reporting", "Confidential milestones"]
    },
    {
      step: "04",
      title: "Access Funds Securely",
      description: "Receive funds through our secure, privacy-preserving smart contract system upon milestone completion.",
      icon: "💎",
      features: ["Automated disbursement", "Privacy-preserved transfers", "Secure fund management"]
    }
  ];

  return (
    <section className="section-padding bg-slate-900">
      <div className="container-custom">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold gradient-text mb-6">
            How It Works
          </h2>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Experience the future of private fundraising with our revolutionary FHE-powered platform
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {steps.map((stepItem, index) => (
            <div 
              key={index}
              className="group"
            >
              <div className="card-hover p-8">
                <div className="flex items-start gap-6">
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform duration-300">
                      {stepItem.icon}
                    </div>
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-sm font-mono text-blue-400 bg-blue-500/10 px-3 py-1 rounded-full">
                        STEP {stepItem.step}
                      </span>
                    </div>
                    
                    <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-blue-400 transition-colors">
                      {stepItem.title}
                    </h3>
                    
                    <p className="text-slate-300 mb-6 leading-relaxed">
                      {stepItem.description}
                    </p>
                    
                    <div className="space-y-2">
                      {stepItem.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-center gap-3">
                          <div className="w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full"></div>
                          <span className="text-sm text-slate-400">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              
              {index < steps.length - 1 && (
                <div className="hidden lg:block relative">
                  <div className="absolute top-8 left-1/2 transform -translate-x-1/2 w-px h-12 bg-gradient-to-b from-blue-500/50 to-transparent"></div>
                  <div className="absolute top-20 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-4 bg-gradient-to-r from-blue-600/10 to-purple-600/10 border border-blue-500/20 rounded-2xl p-6">
            <div className="text-3xl">🚀</div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-1">Ready to get started?</h3>
              <p className="text-slate-400">Launch your privacy-preserving campaign today</p>
            </div>
            <button className="btn-primary ml-4">
              Create Project
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;