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
      <div className="px-4 sm:px-6 md:px-10 lg:px-20 xl:px-40 py-10">
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-900 dark:text-white">Loading mobile app data...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="px-4 sm:px-6 md:px-10 lg:px-20 xl:px-40 py-10">
        <div className="flex items-center justify-center h-64">
          <div className="text-red-500">Error: {error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 md:px-10 lg:px-20 xl:px-40 py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
          Mobile Application VAPT
        </h1>
        <button
          className={`flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white font-bold text-sm shadow-[0_4px_0_0_#0a44a5] hover:shadow-[0_2px_0_0_#0a44a5] hover:-translate-y-0.5 transition-all duration-200 ${isStarting ? 'opacity-50 cursor-not-allowed' : ''}`}
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
          <span className="text-base">+</span>
          {isStarting ? 'Starting Scan…' : 'Start Scan'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="rounded-xl border border-primary/20 dark:border-primary/30 bg-primary/5 dark:bg-primary/10 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Active Scan
          </h2>
          {!status ? (
            <div className="flex items-center justify-center h-48 text-gray-500 dark:text-gray-400">
              <p>No active scans. Start a new scan to see results here.</p>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-gray-600 dark:text-gray-400">{status.message}</p>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
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

        <div className="rounded-xl border border-primary/20 dark:border-primary/30 bg-primary/5 dark:bg-primary/10 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Scan Result
          </h2>
          {!status || status.status !== 'succeeded' ? (
            <div className="flex items-center justify-center h-48 text-gray-500 dark:text-gray-400">
              <p>Run a scan to see results here.</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <span></span>
                <button
                  onClick={async () => {
                    try {
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
                  className="px-3 py-1 rounded bg-primary/10 dark:bg-primary/20 text-primary font-medium text-sm hover:bg-primary/20 dark:hover:bg-primary/30 transition-colors"
                >
                  📄 Download PDF
                </button>
              </div>
              <div className="text-gray-600 dark:text-gray-400 text-sm overflow-y-auto">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-3 rounded bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                    <p className="text-gray-600 dark:text-gray-400">Package</p>
                    <p className="text-gray-900 dark:text-white break-all">{packageName || '-'}</p>
                  </div>
                  <div className="p-3 rounded bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                    <p className="text-gray-600 dark:text-gray-400">Platform</p>
                    <p className="text-gray-900 dark:text-white">{platform}</p>
                  </div>
                  <div className="p-3 rounded bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                    <p className="text-gray-600 dark:text-gray-400">Status</p>
                    <p className="text-green-500">Completed</p>
                  </div>
                </div>
                {status.report && (
                  <div className="space-y-4 mt-4">
                    {status.report.app_name && (
                      <div className="p-3 rounded bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                        <p className="text-gray-600 dark:text-gray-400">App Name</p>
                        <p className="text-gray-900 dark:text-white">{status.report.app_name}</p>
                      </div>
                    )}
                    
                    {status.report.security_score && (
                      <div className="p-3 rounded bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                        <p className="text-gray-600 dark:text-gray-400">Security Score</p>
                        <p className={`text-2xl font-bold ${status.report.security_score >= 80 ? 'text-green-500' : status.report.security_score >= 60 ? 'text-yellow-500' : 'text-red-500'}`}>
                          {status.report.security_score}/100
                        </p>
                      </div>
                    )}
                    
                    {status.report.findings && (
                      <div className="p-3 rounded bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                        <p className="text-gray-600 dark:text-gray-400 mb-2">Vulnerabilities Found</p>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                          {Object.entries(status.report.findings).map(([severity, findings]: [string, any]) => (
                            <div key={severity} className="text-center">
                              <p className={`font-bold ${severity === 'high' ? 'text-red-500' : severity === 'medium' ? 'text-yellow-500' : severity === 'low' ? 'text-blue-500' : 'text-gray-500'}`}>
                                {Array.isArray(findings) ? findings.length : 0}
                              </p>
                              <p className="text-gray-600 dark:text-gray-400 capitalize">{severity}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {status.report.findings && Object.keys(status.report.findings).length > 0 && (
                      <div className="p-3 rounded bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                        <p className="text-gray-600 dark:text-gray-400 mb-2">Top Security Issues</p>
                        <div className="space-y-2 max-h-48 overflow-y-auto">
                          {Object.entries(status.report.findings).slice(0, 5).map(([severity, findings]: [string, any]) => 
                            Array.isArray(findings) && findings.slice(0, 2).map((finding: any, idx: number) => (
                              <div key={`${severity}-${idx}`} className="text-sm">
                                <p className={`font-medium ${severity === 'high' ? 'text-red-500' : severity === 'medium' ? 'text-yellow-500' : 'text-blue-500'}`}>
                                  {finding.rule || finding.title || 'Security Issue'}
                                </p>
                                <p className="text-gray-600 dark:text-gray-400 text-xs">{finding.description || finding.desc || 'No description available'}</p>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    )}
                    
                    <details className="p-3 rounded bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                      <summary className="text-gray-600 dark:text-gray-400 cursor-pointer">View Raw Report</summary>
                      <pre className="text-xs whitespace-pre-wrap break-all text-gray-600 dark:text-gray-400 max-h-64 overflow-auto mt-2">
                        {JSON.stringify(status.report, null, 2)}
                      </pre>
                    </details>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div className="rounded-xl border border-primary/20 dark:border-primary/30 bg-primary/5 dark:bg-primary/10 p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          App Configuration
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" htmlFor="packageName">
              App Package Name
            </label>
            <input
              className="w-full rounded-md border-gray-300 dark:border-gray-600 bg-background-light dark:bg-background-dark/50 focus:border-primary focus:ring-primary text-base px-4 py-3"
              id="packageName"
              placeholder="com.example.app"
              type="text"
              value={packageName}
              onChange={(e) => setPackageName(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" htmlFor="platform">
              Platform
            </label>
            <select
              className="w-full rounded-md border-gray-300 dark:border-gray-600 bg-background-light dark:bg-background-dark/50 focus:border-primary focus:ring-primary text-base px-4 py-3"
              id="platform"
              value={platform}
              onChange={(e) => setPlatform(e.target.value as any)}
            >
              <option value="Android">Android</option>
              <option value="iOS">iOS</option>
              <option value="Cross-platform">Cross-platform</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" htmlFor="apkFile">
              APK/IPA File
            </label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-md">
              <div className="space-y-1 text-center">
                <svg
                  aria-hidden="true"
                  className="mx-auto h-12 w-12 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 48 48"
                >
                  <path
                    d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                  ></path>
                </svg>
                <div className="flex text-sm text-gray-600 dark:text-gray-400">
                  <label
                    className="relative cursor-pointer bg-transparent rounded-md font-medium text-primary hover:text-primary/80 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary"
                    htmlFor="file-upload"
                  >
                    <span>Choose file</span>
                    <input
                      className="sr-only"
                      id="file-upload"
                      name="file-upload"
                      type="file"
                      accept=".apk,.ipa"
                      onChange={(e) => setFile(e.target.files && e.target.files[0] ? e.target.files[0] : null)}
                    />
                  </label>
                  <p className="pl-1">{file ? file.name : 'No file chosen'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileAppVAPTView;