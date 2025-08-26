import React from 'react';
import { ShieldIcon, AlertIcon } from './Icons';

const DashboardView: React.FC = () => {
  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold text-white mb-6">Dashboard Overview</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Scans</p>
              <p className="text-3xl font-bold text-white">1,247</p>
            </div>
            <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center">
              <ShieldIcon className="w-6 h-6 text-accent" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Critical Vulnerabilities</p>
              <p className="text-3xl font-bold text-danger">23</p>
            </div>
            <div className="w-12 h-12 bg-danger/20 rounded-lg flex items-center justify-center">
              <AlertIcon className="w-6 h-6 text-danger" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Web Applications</p>
              <p className="text-3xl font-bold text-info">156</p>
            </div>
            <div className="w-12 h-12 bg-info/20 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-info" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
              </svg>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Mobile Applications</p>
              <p className="text-3xl font-bold text-warning">89</p>
            </div>
            <div className="w-12 h-12 bg-warning/20 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-warning" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold text-white mb-4">Recent Activity</h3>
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-success rounded-full"></div>
              <div className="flex-1">
                <p className="text-white text-sm">E-commerce platform scan completed</p>
                <p className="text-gray-400 text-xs">2 hours ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-warning rounded-full"></div>
              <div className="flex-1">
                <p className="text-white text-sm">Mobile banking app scan in progress</p>
                <p className="text-gray-400 text-xs">4 hours ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-danger rounded-full"></div>
              <div className="flex-1">
                <p className="text-white text-sm">Critical vulnerability detected in healthcare portal</p>
                <p className="text-gray-400 text-xs">6 hours ago</p>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-white mb-4">Vulnerability Distribution</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Critical</span>
              <div className="flex items-center space-x-2">
                <div className="w-24 bg-dark-border rounded-full h-2">
                  <div className="bg-danger h-2 rounded-full" style={{ width: '15%' }}></div>
                </div>
                <span className="text-white text-sm">15%</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-300">High</span>
              <div className="flex items-center space-x-2">
                <div className="w-24 bg-dark-border rounded-full h-2">
                  <div className="bg-warning h-2 rounded-full" style={{ width: '25%' }}></div>
                </div>
                <span className="text-white text-sm">25%</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Medium</span>
              <div className="flex items-center space-x-2">
                <div className="w-24 bg-dark-border rounded-full h-2">
                  <div className="bg-info h-2 rounded-full" style={{ width: '35%' }}></div>
                </div>
                <span className="text-white text-sm">35%</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Low</span>
              <div className="flex items-center space-x-2">
                <div className="w-24 bg-dark-border rounded-full h-2">
                  <div className="bg-success h-2 rounded-full" style={{ width: '25%' }}></div>
                </div>
                <span className="text-white text-sm">25%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardView;
