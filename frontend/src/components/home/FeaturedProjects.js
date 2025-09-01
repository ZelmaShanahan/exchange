import React from 'react';

const FeaturedProjects = () => {
  const featuredProjects = [
    {
      id: 1,
      title: "Privacy Healthcare Fund",
      description: "Confidential funding for medical research projects",
      progress: 85,
      target: "100 ETH",
      category: "Healthcare"
    },
    {
      id: 2,
      title: "Green Energy Initiative",
      description: "Sustainable energy projects with privacy protection",
      progress: 62,
      target: "250 ETH", 
      category: "Environment"
    },
    {
      id: 3,
      title: "Education Access Fund",
      description: "Anonymous funding for educational opportunities",
      progress: 91,
      target: "75 ETH",
      category: "Education"
    }
  ];

  return (
    <section className="section-padding bg-slate-900/50">
      <div className="container-custom">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold gradient-text mb-6">
            Featured Projects
          </h2>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Discover innovative projects seeking confidential funding through our privacy-preserving platform
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredProjects.map((project) => (
            <div key={project.id} className="card-hover group">
              <div className="flex items-center justify-between mb-4">
                <span className="badge badge-primary">{project.category}</span>
                <div className="text-sm text-slate-400">
                  Target: {project.target}
                </div>
              </div>
              
              <h3 className="text-xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors">
                {project.title}
              </h3>
              
              <p className="text-slate-300 mb-6 line-clamp-2">
                {project.description}
              </p>
              
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-slate-400">Progress</span>
                  <span className="text-sm font-semibold text-blue-400">{project.progress}%</span>
                </div>
                <div className="progress-bar h-2">
                  <div 
                    className="progress-fill h-full"
                    style={{ width: `${project.progress}%` }}
                  />
                </div>
              </div>
              
              <button className="btn-primary w-full">
                View Project
              </button>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <button className="btn-secondary">
            Explore All Projects
          </button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProjects;