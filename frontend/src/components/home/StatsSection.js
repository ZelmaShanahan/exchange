import React from 'react';

const StatsSection = () => {
  const stats = [
    {
      value: "500M+",
      label: "Total Raised",
      description: "Confidentially funded through our platform",
      icon: "💰"
    },
    {
      value: "1,200+",
      label: "Projects Funded",
      description: "Successful privacy-preserving campaigns",
      icon: "🚀"
    },
    {
      value: "50,000+",
      label: "Contributors",
      description: "Anonymous supporters worldwide",
      icon: "👥"
    },
    {
      value: "99.9%",
      label: "Privacy Score",
      description: "Complete financial confidentiality",
      icon: "🔒"
    }
  ];

  return (
    <section className="section-padding bg-gradient-to-br from-slate-800/50 to-slate-900/50">
      <div className="container-custom">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Platform Statistics
          </h2>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            See the impact of privacy-preserving fundraising on our platform
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div 
              key={index} 
              className="card-glass text-center group hover:scale-105 transition-all duration-300"
            >
              <div className="text-4xl mb-4 group-hover:animate-bounce">
                {stat.icon}
              </div>
              
              <div className="text-3xl md:text-4xl font-bold gradient-text mb-2">
                {stat.value}
              </div>
              
              <h3 className="text-lg font-semibold text-white mb-2">
                {stat.label}
              </h3>
              
              <p className="text-sm text-slate-400">
                {stat.description}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <div className="card-glass inline-block p-8">
            <h3 className="text-2xl font-bold text-white mb-4">
              Privacy-First Fundraising
            </h3>
            <p className="text-slate-300 mb-6 max-w-2xl mx-auto">
              Our platform uses cutting-edge Fully Homomorphic Encryption (FHE) to ensure 
              complete privacy for all participants while maintaining transparency and trust.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <span className="badge badge-primary">Zero-Knowledge Proofs</span>
              <span className="badge badge-success">FHE Technology</span>
              <span className="badge badge-warning">Anonymous Transactions</span>
              <span className="badge badge-gray">Regulatory Compliant</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StatsSection;