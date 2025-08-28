import React, { useState, useEffect } from 'react';
import { WebAppIcon, PlusIcon } from './Icons';

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

interface ScanReport {
  vulnerabilities?: Array<{
    name: string;
    severity: string;
    description: string;
  }>;
  summary?: {
    totalVulnerabilities: number;
    criticalCount: number;
    highCount: number;
    mediumCount: number;
    lowCount: number;
  };
}

const WebAppVAPTView: React.FC = () => {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Scan-related state variables
  const [targetUrl, setTargetUrl] = useState<string>('');
  const [scanStatus, setScanStatus] = useState<string>('');
  const [scanId, setScanId] = useState<string | null>(null);
  const [report, setReport] = useState<ScanReport | null>(null);
  const [scanLoading, setScanLoading] = useState<boolean>(false);
  const [pollingInterval, setPollingInterval] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Set loading to false immediately since we're not fetching dashboard data
    setLoading(false);
  }, []);

  // Cleanup polling interval on component unmount
  useEffect(() => {
    return () => {
      if (pollingInterval) {
        clearInterval(pollingInterval);
      }
    };
  }, [pollingInterval]);

  const startScan = async () => {
    try {
      setScanLoading(true);
      setScanStatus('Starting scan...');
      setReport(null);
      
      // Make request to start scan
      const response = await fetch('http://localhost:3001/api/start-scan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          targetUrl: targetUrl
        })
      });

      if (!response.ok) {
        throw new Error('Failed to start scan');
      }

      const data = await response.json();
      const newScanId = data.scanId;
      setScanId(newScanId);
      setScanStatus('Scan in progress...');
      setScanLoading(false);

      // Start polling for scan status
      const interval = setInterval(async () => {
        try {
          const statusResponse = await fetch(`http://localhost:3001/api/scan-status/${newScanId}`);
          if (!statusResponse.ok) {
            throw new Error('Failed to check scan status');
          }

          const statusData = await statusResponse.json();
          
          if (statusData.status === 'succeeded') {
            // Scan completed
            clearInterval(interval);
            setPollingInterval(null);
            setScanStatus('Scan completed!');
            setReport(statusData.report);
            setScanId(null);
          } else if (statusData.status === 'failed') {
            // Scan failed
            clearInterval(interval);
            setPollingInterval(null);
            setScanStatus('Scan failed.');
            setScanId(null);
          }
          // If still running, continue polling
        } catch (error) {
          console.error('Error checking scan status:', error);
          clearInterval(interval);
          setPollingInterval(null);
          setScanStatus('Error checking scan status.');
          setScanId(null);
        }
      }, 5000); // Poll every 5 seconds

      setPollingInterval(interval);
    } catch (error) {
      console.error('Error starting scan:', error);
      setScanStatus('Failed to start scan. Please try again.');
      setScanLoading(false);
    }
  };
  if (loading) {
    return (
      <div className="p-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-white">Loading web app data...</div>
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
        <h2 className="text-2xl font-bold text-white">Web Application VAPT</h2>
        <button className="btn-primary flex items-center space-x-2">
          <PlusIcon />
          <span>New Web App Scan</span>
        </button>
      </div>

             <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         <div className="lg:col-span-2">
           <div className="card mb-6">
             <h3 className="text-lg font-semibold text-white mb-4">Scan Configuration</h3>
             <div className="space-y-4">
               <div>
                 <label className="block text-gray-300 text-sm font-medium mb-2">
                   Target URL
                 </label>
                 <input
                   type="url"
                   placeholder="https://example.com"
                   value={targetUrl}
                   onChange={(e) => setTargetUrl(e.target.value)}
                   className="w-full bg-dark-bg border border-dark-border rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-accent"
                 />
               </div>
               <div className="flex items-center space-x-3">
                                   <button
                    onClick={startScan}
                    disabled={scanLoading || !targetUrl.trim()}
                    className={`btn-primary flex items-center space-x-2 ${scanLoading || !targetUrl.trim() ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <PlusIcon />
                    <span>{scanLoading ? 'Starting Scan...' : 'Start Scan'}</span>
                  </button>
                 {scanStatus && (
                   <span className={`text-sm ${
                     scanStatus.includes('completed') ? 'text-success' :
                     scanStatus.includes('failed') || scanStatus.includes('Error') ? 'text-danger' :
                     'text-warning'
                   }`}>
                     {scanStatus}
                   </span>
                 )}
               </div>
             </div>
           </div>

           {report && (
             <div className="card">
               <h3 className="text-lg font-semibold text-white mb-4">Scan Results</h3>
               <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                 <div className="text-center p-4 bg-dark-bg rounded-lg">
                   <p className="text-2xl font-bold text-white">{report.summary?.totalVulnerabilities || 0}</p>
                   <p className="text-gray-400 text-sm">Total Vulnerabilities</p>
                 </div>
                 <div className="text-center p-4 bg-dark-bg rounded-lg">
                   <p className="text-2xl font-bold text-danger">{report.summary?.criticalCount || 0}</p>
                   <p className="text-gray-400 text-sm">Critical</p>
                 </div>
                 <div className="text-center p-4 bg-dark-bg rounded-lg">
                   <p className="text-2xl font-bold text-warning">{report.summary?.highCount || 0}</p>
                   <p className="text-gray-400 text-sm">High</p>
                 </div>
               </div>
               
               {report.vulnerabilities && report.vulnerabilities.length > 0 && (
                 <div>
                   <h4 className="text-md font-semibold text-white mb-3">Vulnerabilities Found</h4>
                   <div className="space-y-2">
                     {report.vulnerabilities.map((vuln, index) => (
                       <div key={index} className="p-3 bg-dark-bg rounded-lg">
                         <div className="flex items-center justify-between mb-1">
                           <span className="text-white font-medium">{vuln.name}</span>
                           <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                             vuln.severity === 'Critical' ? 'bg-danger/20 text-danger' :
                             vuln.severity === 'High' ? 'bg-warning/20 text-warning' :
                             vuln.severity === 'Medium' ? 'bg-info/20 text-info' :
                             'bg-success/20 text-success'
                           }`}>
                             {vuln.severity}
                           </span>
                         </div>
                         <p className="text-gray-400 text-sm">{vuln.description}</p>
                       </div>
                     ))}
                   </div>
                 </div>
               )}
             </div>
           )}
         </div>

        <div>
          <div className="card mb-6">
            <h3 className="text-lg font-semibold text-white mb-4">Statistics</h3>
            <div className="space-y-4">
              <div className="text-center">
                <p className="text-3xl font-bold text-white">{summary?.webApplications || '0'}</p>
                <p className="text-gray-400 text-sm">Web Apps Scanned</p>
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
            <h3 className="text-lg font-semibold text-white mb-4">Common Vulnerabilities</h3>
            <div className="space-y-3">
              {report && report.vulnerabilities && report.vulnerabilities.length > 0 ? (
                report.vulnerabilities.slice(0, 5).map((vuln, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-gray-300 text-sm truncate">{vuln.name}</span>
                    <span className={`text-sm font-medium ${
                      vuln.severity === 'Critical' ? 'text-danger' :
                      vuln.severity === 'High' ? 'text-warning' :
                      vuln.severity === 'Medium' ? 'text-info' :
                      'text-success'
                    }`}>
                      {vuln.severity}
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-center text-gray-400 py-4">
                  No vulnerability data available. Run scans to see results here.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WebAppVAPTView;
