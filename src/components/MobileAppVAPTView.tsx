import React, { useState, useEffect } from 'react';
import { MobileAppIcon, PlusIcon } from './Icons';

interface DashboardSummary {
  totalScans: number;
  criticalVulnerabilities: number;
  webApplications: number;
  mobileApplications: number;
  recentActivity: Array<{
    id: number;
    message: string;
    timestamp: string;
    status: string;
  }>;
  vulnerabilityDistribution: {
    critical: number;
    high: number;
    medium: number;
    low: number;
  };
}

const MobileAppVAPTView: React.FC = () => {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Set loading to false immediately since we're not fetching dashboard data
    setLoading(false);
  }, []);
  if (loading) {
    return (
      <div className="p-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-white">Loading mobile app data...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-red-400">Error: {error}</div>
        </div>
      </div>
    );
  }

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
              <div className="text-center text-gray-400 py-8">
                No active scans. Start a new scan to see results here.
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
                <p className="text-3xl font-bold text-white">{summary?.mobileApplications || '0'}</p>
                <p className="text-gray-400 text-sm">Mobile Apps Scanned</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-danger">{summary?.criticalVulnerabilities || '0'}</p>
                <p className="text-gray-400 text-sm">Vulnerabilities Found</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-success">--</p>
                <p className="text-gray-400 text-sm">Success Rate</p>
              </div>
            </div>
          </div>

          <div className="card">
            <h3 className="text-lg font-semibold text-white mb-4">Common Mobile Vulnerabilities</h3>
            <div className="space-y-3">
              <div className="text-center text-gray-400 py-4">
                No vulnerability data available. Run scans to see results here.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileAppVAPTView;
