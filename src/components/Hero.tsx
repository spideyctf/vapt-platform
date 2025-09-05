import React from 'react';
import { Link } from 'react-router-dom';

const Hero: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Section - Text & CTAs */}
          <div className="text-center lg:text-left">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
              Secure your digital presence from threats
            </h1>
            
            <p className="text-lg sm:text-xl text-gray-300 mb-8 max-w-2xl lg:max-w-none">
              Keep your applications safe with comprehensive vulnerability assessments from MIT CBC, your partner in cybersecurity.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link
                to="/web"
                className="inline-flex items-center justify-center px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-lg transition-all duration-200 transform hover:scale-105"
              >
                Start VAPT Scan
              </Link>
              
              <button className="inline-flex items-center justify-center px-8 py-4 bg-gray-800 hover:bg-gray-700 text-gray-200 font-semibold rounded-lg border border-gray-600 transition-all duration-200">
                Learn more
              </button>
            </div>
          </div>

          {/* Right Section - Abstract Visual */}
          <div className="relative flex justify-center lg:justify-end">
            <div className="relative w-80 h-96">
              {/* Background Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-blue-600/20 rounded-3xl blur-3xl"></div>
              
              {/* Stack of Cards */}
              <div className="relative space-y-4">
                {/* Bottom Card (Background) */}
                <div className="absolute bottom-0 left-4 w-72 h-80 bg-gray-800/40 rounded-2xl border border-gray-700/50 transform rotate-2"></div>
                
                {/* Middle Card */}
                <div className="absolute bottom-2 left-2 w-72 h-80 bg-gray-700/60 rounded-2xl border border-gray-600/50 transform -rotate-1"></div>
                
                {/* Main Card (Foreground) */}
                <div className="relative w-72 h-80 bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl border border-gray-600 shadow-2xl p-6">
                  {/* Card Header */}
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-white font-semibold text-lg">Web App VAPT</h3>
                    <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                  </div>
                  
                  {/* Central Metric */}
                  <div className="text-center mb-8">
                    <div className="text-6xl font-bold text-white mb-2">127</div>
                    <div className="text-gray-400 text-sm">Total Vulnerabilities</div>
                  </div>
                  
                  {/* Vulnerability Breakdown */}
                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-3 text-center">
                      <div className="text-2xl font-bold text-red-400">12</div>
                      <div className="text-red-300 text-xs">Critical</div>
                    </div>
                    
                    <div className="bg-orange-500/20 border border-orange-500/30 rounded-lg p-3 text-center">
                      <div className="text-2xl font-bold text-orange-400">34</div>
                      <div className="text-orange-300 text-xs">High</div>
                    </div>
                    
                    <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-lg p-3 text-center">
                      <div className="text-2xl font-bold text-yellow-400">81</div>
                      <div className="text-yellow-300 text-xs">Medium</div>
                    </div>
                  </div>
                  
                  {/* Security Features */}
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="flex items-center justify-center space-x-4 text-xs text-gray-400">
                      <div className="flex items-center space-x-1">
                        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                        <span>Authentication</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                        <span>Encryption</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                        <span>Firewall</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
