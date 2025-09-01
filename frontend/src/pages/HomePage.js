import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldCheckIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  LockClosedIcon,
  ArrowRightIcon,
  SparklesIcon,
  GlobeAltIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';

// Components
import FeaturedProjects from '../components/home/FeaturedProjects';
import StatsSection from '../components/home/StatsSection';
import HowItWorks from '../components/home/HowItWorks';
import SecurityFeatures from '../components/home/SecurityFeatures';

const HomePage = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <motion.section 
        className="relative overflow-hidden"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900/20 to-purple-900/20" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(59,130,246,0.1),transparent_50%)]" />
        
        <div className="relative container-custom section-padding">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Hero Content */}
            <motion.div variants={itemVariants} className="space-y-8">
              {/* Badge */}
              <motion.div 
                className="inline-flex items-center space-x-2 badge-primary text-sm"
                variants={itemVariants}
              >
                <SparklesIcon className="h-4 w-4" />
                <span>Powered by Zama FHE Protocol</span>
              </motion.div>
              
              {/* Title */}
              <motion.h1 
                className="text-4xl md:text-6xl lg:text-7xl font-black leading-tight"
                variants={itemVariants}
              >
                <span className="text-gradient">Privacy-First</span>
                <br />
                <span className="text-white">Fundraising</span>
                <br />
                <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                  Platform
                </span>
              </motion.h1>
              
              {/* Subtitle */}
              <motion.p 
                className="text-xl text-slate-300 max-w-2xl leading-relaxed"
                variants={itemVariants}
              >
                Revolutionary fundraising platform using <strong className="text-blue-400">Fully Homomorphic Encryption</strong> 
                to ensure complete investment privacy while maintaining transparency and security.
              </motion.p>
              
              {/* CTA Buttons */}
              <motion.div 
                className="flex flex-col sm:flex-row gap-4"
                variants={itemVariants}
              >
                <Link to="/projects" className="btn-primary group">
                  Explore Projects
                  <ArrowRightIcon className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
                
                <Link to="/create" className="btn-secondary">
                  Launch Campaign
                </Link>
              </motion.div>
              
              {/* Trust Indicators */}
              <motion.div 
                className="flex items-center space-x-8 pt-8"
                variants={itemVariants}
              >
                <div className="flex items-center space-x-2 text-slate-400">
                  <ShieldCheckIcon className="h-5 w-5 text-emerald-400" />
                  <span className="text-sm">Audited Security</span>
                </div>
                <div className="flex items-center space-x-2 text-slate-400">
                  <LockClosedIcon className="h-5 w-5 text-blue-400" />
                  <span className="text-sm">FHE Encryption</span>
                </div>
                <div className="flex items-center space-x-2 text-slate-400">
                  <GlobeAltIcon className="h-5 w-5 text-purple-400" />
                  <span className="text-sm">Decentralized</span>
                </div>
              </motion.div>
            </motion.div>
            
            {/* Hero Visual */}
            <motion.div 
              className="relative"
              variants={itemVariants}
            >
              <div className="relative">
                {/* Main Card */}
                <div className="card-glass p-8 relative z-10">
                  <div className="space-y-6">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-bold text-white">CryptoFund Nexus</h3>
                      <div className="flex items-center space-x-2">
                        <div className="h-2 w-2 bg-emerald-400 rounded-full animate-pulse"></div>
                        <span className="text-xs text-emerald-400">Live</span>
                      </div>
                    </div>
                    
                    {/* Metrics */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <p className="text-xs text-slate-400">Total Raised</p>
                        <p className="text-xl font-bold text-white">$2.4M</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs text-slate-400">Private Investments</p>
                        <p className="text-xl font-bold text-white">1,247</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs text-slate-400">Active Projects</p>
                        <p className="text-xl font-bold text-white">89</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs text-slate-400">Success Rate</p>
                        <p className="text-xl font-bold text-white">94%</p>
                      </div>
                    </div>
                    
                    {/* Privacy Indicator */}
                    <div className="flex items-center space-x-2 p-3 bg-blue-600/10 rounded-lg border border-blue-500/20">
                      <LockClosedIcon className="h-5 w-5 text-blue-400" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-blue-400">Private Investment Protected</p>
                        <p className="text-xs text-slate-400">Your contribution amounts are fully encrypted</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Floating Elements */}
                <motion.div 
                  className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full opacity-20 blur-xl"
                  animate={{
                    scale: [1, 1.2, 1],
                    rotate: [0, 180, 360]
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
                
                <motion.div 
                  className="absolute -bottom-6 -left-6 w-16 h-16 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full opacity-20 blur-xl"
                  animate={{
                    scale: [1, 0.8, 1],
                    rotate: [360, 180, 0]
                  }}
                  transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Stats Section */}
      <StatsSection />

      {/* How It Works Section */}
      <HowItWorks />

      {/* Featured Projects */}
      <FeaturedProjects />

      {/* Security Features */}
      <SecurityFeatures />

      {/* CTA Section */}
      <motion.section 
        className="section-padding bg-gradient-to-r from-blue-600/10 to-purple-600/10"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
      >
        <div className="container-custom">
          <motion.div 
            className="text-center space-y-8"
            variants={itemVariants}
          >
            <h2 className="text-3xl md:text-5xl font-black text-white">
              Ready to Launch Your
              <span className="text-gradient block">Private Campaign?</span>
            </h2>
            
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              Join the privacy revolution in fundraising. Create your campaign with complete 
              confidentiality and reach investors worldwide.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link to="/create" className="btn-primary group text-lg px-8 py-4">
                Launch Campaign
                <ArrowRightIcon className="h-6 w-6 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
              
              <Link to="/dex" className="btn-secondary text-lg px-8 py-4">
                Access DEX
              </Link>
            </div>
            
            <div className="flex items-center justify-center space-x-12 pt-8 text-slate-400">
              <div className="flex items-center space-x-2">
                <UserGroupIcon className="h-6 w-6" />
                <span>1,200+ Projects</span>
              </div>
              <div className="flex items-center space-x-2">
                <CurrencyDollarIcon className="h-6 w-6" />
                <span>$50M+ Raised</span>
              </div>
              <div className="flex items-center space-x-2">
                <ChartBarIcon className="h-6 w-6" />
                <span>94% Success Rate</span>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
};

export default HomePage;