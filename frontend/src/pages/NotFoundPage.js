import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
      <div className="text-center max-w-md mx-auto px-4">
        <div className="mb-8">
          <div className="text-8xl font-black text-gradient mb-4">404</div>
          <h1 className="text-3xl font-bold text-white mb-4">Page Not Found</h1>
          <p className="text-slate-300 mb-8">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>
        
        <div className="space-y-4">
          <Link to="/" className="btn-primary inline-block">
            Back to Home
          </Link>
          
          <div className="text-sm text-slate-400">
            Or explore our platform:
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2 justify-center">
            <Link to="/projects" className="btn-ghost text-sm">
              Browse Projects
            </Link>
            <Link to="/dex" className="btn-ghost text-sm">
              Confidential DEX
            </Link>
            <Link to="/create" className="btn-ghost text-sm">
              Create Project
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;