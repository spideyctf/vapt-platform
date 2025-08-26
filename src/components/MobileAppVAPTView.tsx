import React from 'react';
import { MobileAppIcon, PlusIcon } from './Icons';

const MobileAppVAPTView: React.FC = () => {
  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">Mobile Application VAPT</h2>
        <button className="btn-primary flex items-center space-x-2">
          <PlusIcon />
          <span>New Mobile App Scan</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="card mb-6">
            <h3 className="text-lg font-semibold text-white mb-4">Active Scans</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-dark-bg rounded-lg">
                <div className="flex items-center space-x-3">
                  <MobileAppIcon className="w-5 h-5 text-warning" />
                  <div>
                    <p className="text-white font-medium">Banking Mobile App</p>
                    <p className="text-gray-400 text-sm">com.bank.mobile</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-success rounded-full"></div>
                  <span className="text-success text-sm">Completed</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-dark-bg rounded-lg">
                <div className="flex items-center space-x-3">
                  <MobileAppIcon className="w-5 h-5 text-warning" />
                  <div>
                    <p className="text-white font-medium">Social Media App</p>
                    <p className="text-gray-400 text-sm">com.social.app</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-warning rounded-full animate-pulse"></div>
                  <span className="text-warning text-sm">In Progress</span>
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <h3 className="text-lg font-semibold text-white mb-4">App Configuration</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  App Package Name
                </label>
                <input
                  type="text"
                  placeholder="com.example.app"
                  className="w-full bg-dark-bg border border-dark-border rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-accent"
                />
              </div>
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Platform
                </label>
                <select className="w-full bg-dark-bg border border-dark-border rounded-lg px-3 py-2 text-white focus:outline-none focus:border-accent">
                  <option>Android</option>
                  <option>iOS</option>
                  <option>Cross-platform</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  APK/IPA File
                </label>
                <input
                  type="file"
                  accept=".apk,.ipa"
                  className="w-full bg-dark-bg border border-dark-border rounded-lg px-3 py-2 text-white focus:outline-none focus:border-accent"
                />
              </div>
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Scan Type
                </label>
                <select className="w-full bg-dark-bg border border-dark-border rounded-lg px-3 py-2 text-white focus:outline-none focus:border-accent">
                  <option>Static Analysis</option>
                  <option>Dynamic Analysis</option>
                  <option>Full Analysis</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="card mb-6">
            <h3 className="text-lg font-semibold text-white mb-4">Statistics</h3>
            <div className="space-y-4">
              <div className="text-center">
                <p className="text-3xl font-bold text-white">89</p>
                <p className="text-gray-400 text-sm">Mobile Apps Scanned</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-danger">156</p>
                <p className="text-gray-400 text-sm">Vulnerabilities Found</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-success">92%</p>
                <p className="text-gray-400 text-sm">Success Rate</p>
              </div>
            </div>
          </div>

          <div className="card">
            <h3 className="text-lg font-semibold text-white mb-4">Common Mobile Vulnerabilities</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-300 text-sm">Insecure Data Storage</span>
                <span className="text-danger text-sm font-medium">34</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-300 text-sm">Weak Cryptography</span>
                <span className="text-warning text-sm font-medium">28</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-300 text-sm">Insecure Communication</span>
                <span className="text-info text-sm font-medium">22</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-300 text-sm">Code Tampering</span>
                <span className="text-danger text-sm font-medium">15</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-300 text-sm">Reverse Engineering</span>
                <span className="text-warning text-sm font-medium">19</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileAppVAPTView;
