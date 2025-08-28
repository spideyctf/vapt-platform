import React, { useState, useEffect } from 'react';
import { ShieldIcon, AlertIcon } from './Icons';

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

const DashboardView: React.FC = () => {
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
          <div className="text-white">Loading dashboard...</div>
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
      <h2 className="text-2xl font-bold text-white mb-6">Dashboard Overview</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Scans</p>
              <p className="text-3xl font-bold text-white">{summary?.totalScans.toLocaleString() || '0'}</p>
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
              <p className="text-3xl font-bold text-danger">{summary?.criticalVulnerabilities || '0'}</p>
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
              <p className="text-3xl font-bold text-info">{summary?.webApplications || '0'}</p>
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
              <p className="text-3xl font-bold text-warning">{summary?.mobileApplications || '0'}</p>
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
            {summary?.recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-center space-x-3">
                <div className={`w-2 h-2 rounded-full ${
                  activity.status === 'success' ? 'bg-success' :
                  activity.status === 'warning' ? 'bg-warning' :
                  activity.status === 'danger' ? 'bg-danger' : 'bg-gray-400'
                }`}></div>
                <div className="flex-1">
                  <p className="text-white text-sm">{activity.message}</p>
                  <p className="text-gray-400 text-xs">{activity.timestamp}</p>
                </div>
              </div>
            )) || (
              <div className="text-gray-400 text-sm">No recent activity</div>
            )}
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-white mb-4">Vulnerability Distribution</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Critical</span>
              <div className="flex items-center space-x-2">
                <div className="w-24 bg-dark-border rounded-full h-2">
                  <div className="bg-danger h-2 rounded-full" style={{ width: `${summary?.vulnerabilityDistribution.critical || 0}%` }}></div>
                </div>
                <span className="text-white text-sm">{summary?.vulnerabilityDistribution.critical || 0}%</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-300">High</span>
              <div className="flex items-center space-x-2">
                <div className="w-24 bg-dark-border rounded-full h-2">
                  <div className="bg-warning h-2 rounded-full" style={{ width: `${summary?.vulnerabilityDistribution.high || 0}%` }}></div>
                </div>
                <span className="text-white text-sm">{summary?.vulnerabilityDistribution.high || 0}%</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Medium</span>
              <div className="flex items-center space-x-2">
                <div className="w-24 bg-dark-border rounded-full h-2">
                  <div className="bg-info h-2 rounded-full" style={{ width: `${summary?.vulnerabilityDistribution.medium || 0}%` }}></div>
                </div>
                <span className="text-white text-sm">{summary?.vulnerabilityDistribution.medium || 0}%</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Low</span>
              <div className="flex items-center space-x-2">
                <div className="w-24 bg-dark-border rounded-full h-2">
                  <div className="bg-success h-2 rounded-full" style={{ width: `${summary?.vulnerabilityDistribution.low || 0}%` }}></div>
                </div>
                <span className="text-white text-sm">{summary?.vulnerabilityDistribution.low || 0}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardView;
