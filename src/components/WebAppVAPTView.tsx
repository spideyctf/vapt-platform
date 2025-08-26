import React from 'react';
import { WebAppIcon, PlusIcon } from './Icons';

const WebAppVAPTView: React.FC = () => {
  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">Web Application VAPT</h2>
        <button className="btn-primary flex items-center space-x-2">
          <PlusIcon />
          <span>New Web App Scan</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="card mb-6">
            <h3 className="text-lg font-semibold text-white mb-4">Active Scans</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-dark-bg rounded-lg">
                <div className="flex items-center space-x-3">
                  <WebAppIcon className="w-5 h-5 text-info" />
                  <div>
                    <p className="text-white font-medium">E-commerce Platform</p>
                    <p className="text-gray-400 text-sm">https://example-store.com</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-warning rounded-full animate-pulse"></div>
                  <span className="text-warning text-sm">In Progress</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-dark-bg rounded-lg">
                <div className="flex items-center space-x-3">
                  <WebAppIcon className="w-5 h-5 text-info" />
                  <div>
                    <p className="text-white font-medium">Banking Portal</p>
                    <p className="text-gray-400 text-sm">https://secure-bank.com</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-success rounded-full"></div>
                  <span className="text-success text-sm">Completed</span>
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <h3 className="text-lg font-semibold text-white mb-4">Scan Configuration</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Target URL
                </label>
                <input
                  type="url"
                  placeholder="https://example.com"
                  className="w-full bg-dark-bg border border-dark-border rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-accent"
                />
              </div>
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Scan Type
                </label>
                <select className="w-full bg-dark-bg border border-dark-border rounded-lg px-3 py-2 text-white focus:outline-none focus:border-accent">
                  <option>Full Scan</option>
                  <option>Quick Scan</option>
                  <option>Custom Scan</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Authentication
                </label>
                <select className="w-full bg-dark-bg border border-dark-border rounded-lg px-3 py-2 text-white focus:outline-none focus:border-accent">
                  <option>None</option>
                  <option>Basic Auth</option>
                  <option>Form-based</option>
                  <option>OAuth</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Crawl Depth
                </label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  defaultValue="3"
                  className="w-full bg-dark-bg border border-dark-border rounded-lg px-3 py-2 text-white focus:outline-none focus:border-accent"
                />
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="card mb-6">
            <h3 className="text-lg font-semibold text-white mb-4">Statistics</h3>
            <div className="space-y-4">
              <div className="text-center">
                <p className="text-3xl font-bold text-white">156</p>
                <p className="text-gray-400 text-sm">Web Apps Scanned</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-danger">342</p>
                <p className="text-gray-400 text-sm">Vulnerabilities Found</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-success">89%</p>
                <p className="text-gray-400 text-sm">Success Rate</p>
              </div>
            </div>
          </div>

          <div className="card">
            <h3 className="text-lg font-semibold text-white mb-4">Common Vulnerabilities</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-300 text-sm">SQL Injection</span>
                <span className="text-danger text-sm font-medium">23</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-300 text-sm">XSS</span>
                <span className="text-warning text-sm font-medium">45</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-300 text-sm">CSRF</span>
                <span className="text-info text-sm font-medium">18</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-300 text-sm">Broken Auth</span>
                <span className="text-danger text-sm font-medium">12</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WebAppVAPTView;
