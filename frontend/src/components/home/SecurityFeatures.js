import React from 'react';

const SecurityFeatures = () => {
  const features = [
    {
      title: "Fully Homomorphic Encryption",
      description: "All data is encrypted and computations are performed on encrypted data, ensuring complete privacy",
      icon: "🔐",
      benefits: [
        "Zero data exposure",
        "Encrypted computations", 
        "Mathematical privacy guarantees"
      ]
    },
    {
      title: "Zero-Knowledge Proofs",
      description: "Verify transactions and milestones without revealing sensitive information or amounts",
      icon: "🔍", 
      benefits: [
        "Private verification",
        "Anonymous validation",
        "Trustless confirmation"
      ]
    },
    {
      title: "Anonymous Transactions",
      description: "Complete financial privacy with unlinkable transactions and hidden amounts",
      icon: "👤",
      benefits: [
        "Hidden transaction amounts",
        "Anonymous participants", 
        "Unlinkable transfers"
      ]
    },
    {
      title: "Decentralized Security",
      description: "No central authority can access your data or compromise your privacy",
      icon: "🌐",
      benefits: [
        "Distributed verification",
        "No single point of failure",
        "Censorship resistant"
      ]
    },
    {
      title: "Smart Contract Automation",
      description: "Automated milestone-based funding with privacy-preserving execution",
      icon: "⚡",
      benefits: [
        "Automated execution",
        "Transparent logic",
        "Trustless operation"
      ]
    },
    {
      title: "Regulatory Compliance",
      description: "Built-in compliance features while maintaining maximum privacy for users",
      icon: "⚖️",
      benefits: [
        "KYC/AML integration",
        "Regulatory reporting",
        "Compliant by design"
      ]
    }
  ];

  return (
    <section className="section-padding bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="container-custom">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold gradient-text mb-6">
            Advanced Security Features
          </h2>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Built with cutting-edge cryptographic technology to ensure maximum privacy and security
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="card-glass group hover:glow-blue transition-all duration-300"
            >
              <div className="text-center mb-6">
                <div className="text-5xl mb-4 group-hover:animate-pulse">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">
                  {feature.title}
                </h3>
              </div>
              
              <p className="text-slate-300 mb-6 text-center leading-relaxed">
                {feature.description}
              </p>
              
              <div className="space-y-3">
                {feature.benefits.map((benefit, benefitIndex) => (
                  <div key={benefitIndex} className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-gradient-to-r from-green-400 to-blue-400 rounded-full flex-shrink-0"></div>
                    <span className="text-sm text-slate-400">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16">
          <div className="card-glass p-8 md:p-12 text-center">
            <div className="mb-8">
              <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Enterprise-Grade Privacy
              </h3>
              <p className="text-xl text-slate-300 max-w-4xl mx-auto leading-relaxed">
                Our platform combines multiple layers of cryptographic protection to ensure 
                your financial activities remain completely private while maintaining full 
                transparency and auditability where required.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
              <div className="text-center">
                <div className="text-3xl font-bold gradient-text mb-2">256-bit</div>
                <div className="text-slate-400">Encryption Standard</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold gradient-text mb-2">Zero</div>
                <div className="text-slate-400">Data Breaches</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold gradient-text mb-2">100%</div>
                <div className="text-slate-400">Privacy Guarantee</div>
              </div>
            </div>
            
            <div className="flex flex-wrap justify-center gap-4">
              <button className="btn-primary">
                Learn More About Security
              </button>
              <button className="btn-secondary">
                View Technical Documentation
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SecurityFeatures;