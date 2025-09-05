import React, { useEffect, useState } from 'react';
import { PlusIcon } from './Icons';

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

interface MobsfStatus {
  status: 'starting' | 'in-progress' | 'succeeded' | 'failed';
  message: string;
  progress: number;
  hash?: string;
  report?: any;
}

const MobileAppVAPTView: React.FC = () => {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [packageName, setPackageName] = useState<string>('');
  const [platform, setPlatform] = useState<'Android' | 'iOS' | 'Cross-platform'>('Android');
  const [file, setFile] = useState<File | null>(null);

  const [scanId, setScanId] = useState<string>('');
  const [status, setStatus] = useState<MobsfStatus | null>(null);
  const [isStarting, setIsStarting] = useState<boolean>(false);
  const [pollTimer, setPollTimer] = useState<number | null>(null);

  useEffect(() => {
    setInitialLoading(false);
    return () => {
      if (pollTimer) window.clearInterval(pollTimer);
    };
  }, [pollTimer]);

  if (initialLoading) {
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
          <button
            className={`btn-primary flex items-center space-x-2 ${isStarting ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={isStarting}
            onClick={async () => {
              if (!file) {
                setError('Please select an APK or IPA file.');
                return;
              }
              try {
                setError(null);
                setIsStarting(true);
                setStatus({ status: 'starting', message: 'Uploading app to MobSF…', progress: 0 });

                const form = new FormData();
                form.append('app', file);

                const resp = await fetch('http://localhost:3001/api/start-mobsf-scan', {
                  method: 'POST',
                  body: form
                });

                if (!resp.ok) throw new Error('Failed to start MobSF scan');
                const data = await resp.json();
                if (!data.scanId) throw new Error('No scanId returned');
                setScanId(data.scanId);
                setStatus({ status: 'in-progress', message: 'Static analysis started…', progress: 20 });
                setIsStarting(false);

                const timer = window.setInterval(async () => {
                  try {
                    const s = await fetch(`http://localhost:3001/api/mobsf-scan-status/${data.scanId}`);
                    if (!s.ok) throw new Error('Failed to fetch MobSF scan status');
                    const payload: MobsfStatus = await s.json();
                    setStatus(payload);
                    if (payload.status === 'succeeded' || payload.status === 'failed') {
                      window.clearInterval(timer);
                      setPollTimer(null);
                    }
                  } catch (e) {
                    // keep polling, but log once
                    console.error(e);
                  }
                }, 2000);
                setPollTimer(timer);
              } catch (e: any) {
                setIsStarting(false);
                setStatus({ status: 'failed', message: e.message || 'Failed to start scan', progress: 0 });
              }
            }}
          >
            <PlusIcon />
            <span>{isStarting ? 'Starting Scan…' : 'Start Scan'}</span>
          </button>
        </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <div className="card mb-6">
            <h3 className="text-lg font-semibold text-white mb-4">Active Scan</h3>
            {!status && (
              <div className="text-center text-gray-400 py-8">No active scans. Start a new scan to see results here.</div>
            )}
            {status && (
              <div className="space-y-3">
                <p className="text-gray-300">{status.message}</p>
                <div className="w-full bg-dark-bg rounded-full h-2">
                  <div className={`h-2 rounded-full transition-all duration-500 ${status.status === 'failed' ? 'bg-red-500' : status.status === 'succeeded' ? 'bg-green-500' : 'bg-blue-500'}`}
                       style={{ width: `${Math.min(100, Math.max(0, status.progress || (status.status === 'succeeded' ? 100 : 0)))}%` }} />
                </div>
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${status.status === 'failed' ? 'bg-red-500' : status.status === 'succeeded' ? 'bg-green-500' : 'bg-yellow-500 animate-pulse'}`} />
                  <span className={`${status.status === 'failed' ? 'text-red-400' : status.status === 'succeeded' ? 'text-green-400' : 'text-yellow-400'} text-sm`}>
                    {status.status === 'failed' ? 'Failed' : status.status === 'succeeded' ? 'Completed' : 'In Progress'}
                  </span>
                </div>
              </div>
            )}
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
                  value={packageName}
                  onChange={(e) => setPackageName(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Platform
                </label>
                <select
                  className="w-full bg-dark-bg border border-dark-border rounded-lg px-3 py-2 text-white focus:outline-none focus:border-accent"
                  value={platform}
                  onChange={(e) => setPlatform(e.target.value as any)}
                >
                  <option value="Android">Android</option>
                  <option value="iOS">iOS</option>
                  <option value="Cross-platform">Cross-platform</option>
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
                  onChange={(e) => setFile(e.target.files && e.target.files[0] ? e.target.files[0] : null)}
                />
              </div>
              
            </div>
          </div>
        </div>

        <div>
          <div className="card h-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Scan Result</h3>
              {status && status.status === 'succeeded' && scanId && (
                <button
                  onClick={async () => {
                    try {
                      // First try to download via API
                      const response = await fetch(`http://localhost:3001/api/mobsf-download-pdf/${scanId}`);
                      
                      if (response.ok) {
                        const blob = await response.blob();
                        const url = window.URL.createObjectURL(blob);
                        const link = document.createElement('a');
                        link.href = url;
                        link.download = `mobsf-report-${scanId}.pdf`;
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                        window.URL.revokeObjectURL(url);
                      } else {
                        // If API fails, open MobSF static analyzer page
                        const errorData = await response.json();
                        console.error('PDF download failed:', errorData);
                        alert('PDF download failed. Opening MobSF report page instead...');
                        window.open(`http://localhost:8000/static_analyzer/${status.hash}/`, '_blank');
                      }
                    } catch (error) {
                      console.error('Download error:', error);
                      alert('PDF download failed. Opening MobSF report page instead...');
                      window.open(`http://localhost:8000/static_analyzer/${status.hash}/`, '_blank');
                    }
                  }}
                  className="btn-secondary text-sm px-3 py-1"
                >
                  📄 Download PDF
                </button>
              )}
            </div>
            {!status || status.status !== 'succeeded' ? (
              <div className="text-center text-gray-400 py-8">Run a scan to see results here.</div>
            ) : (
              <div className="space-y-4 text-gray-300 text-sm h-full overflow-y-auto">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-3 rounded bg-dark-bg">
                    <p className="text-gray-400">Package</p>
                    <p className="text-white break-all">{packageName || '-'}</p>
                  </div>
                  <div className="p-3 rounded bg-dark-bg">
                    <p className="text-gray-400">Platform</p>
                    <p className="text-white">{platform}</p>
                  </div>
                  <div className="p-3 rounded bg-dark-bg">
                    <p className="text-gray-400">Status</p>
                    <p className="text-green-400">Completed</p>
                  </div>
                </div>
                {status.report && (
                  <div className="space-y-4">
                    {/* App Info */}
                    {status.report.app_name && (
                      <div className="p-3 rounded bg-dark-bg">
                        <p className="text-gray-400">App Name</p>
                        <p className="text-white">{status.report.app_name}</p>
                      </div>
                    )}
                    
                    {/* Security Score */}
                    {status.report.security_score && (
                      <div className="p-3 rounded bg-dark-bg">
                        <p className="text-gray-400">Security Score</p>
                        <p className={`text-2xl font-bold ${status.report.security_score >= 80 ? 'text-green-400' : status.report.security_score >= 60 ? 'text-yellow-400' : 'text-red-400'}`}>
                          {status.report.security_score}/100
                        </p>
                      </div>
                    )}
                    
                    {/* Vulnerabilities Summary */}
                    {status.report.findings && (
                      <div className="p-3 rounded bg-dark-bg">
                        <p className="text-gray-400 mb-2">Vulnerabilities Found</p>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                          {Object.entries(status.report.findings).map(([severity, findings]: [string, any]) => (
                            <div key={severity} className="text-center">
                              <p className={`font-bold ${severity === 'high' ? 'text-red-400' : severity === 'medium' ? 'text-yellow-400' : severity === 'low' ? 'text-blue-400' : 'text-gray-400'}`}>
                                {Array.isArray(findings) ? findings.length : 0}
                              </p>
                              <p className="text-gray-400 capitalize">{severity}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* Top Issues */}
                    {status.report.findings && Object.keys(status.report.findings).length > 0 && (
                      <div className="p-3 rounded bg-dark-bg">
                        <p className="text-gray-400 mb-2">Top Security Issues</p>
                        <div className="space-y-2 max-h-48 overflow-y-auto">
                          {Object.entries(status.report.findings).slice(0, 5).map(([severity, findings]: [string, any]) => 
                            Array.isArray(findings) && findings.slice(0, 2).map((finding: any, idx: number) => (
                              <div key={`${severity}-${idx}`} className="text-sm">
                                <p className={`font-medium ${severity === 'high' ? 'text-red-400' : severity === 'medium' ? 'text-yellow-400' : 'text-blue-400'}`}>
                                  {finding.rule || finding.title || 'Security Issue'}
                                </p>
                                <p className="text-gray-400 text-xs">{finding.description || finding.desc || 'No description available'}</p>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    )}
                    
                    {/* Raw Report (Collapsible) */}
                    <details className="p-3 rounded bg-dark-bg">
                      <summary className="text-gray-400 cursor-pointer">View Raw Report</summary>
                      <pre className="text-xs whitespace-pre-wrap break-all text-gray-400 max-h-64 overflow-auto mt-2">
                        {JSON.stringify(status.report, null, 2)}
                      </pre>
                    </details>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileAppVAPTView;
