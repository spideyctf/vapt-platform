import React, { useState, useEffect } from 'react';
import { PlusIcon }       from './Icons';

/* ---------- ZAP alert/response types ---------- */
interface ZapAlert {
  alert: string;
  url: string;
  riskdesc: string;
  riskcode: string;      // "3" high, "2" medium, "1" low, "0" info
  description: string;
  solution: string;
}
interface ZapSite   { alerts: ZapAlert[] }
interface ZapAlertsResponse { site: ZapSite[] }

interface ReportData {
  totalVulnerabilities: number;
  high: number;
  medium: number;
  low: number;
  informational: number;
  details: ZapAlert[];
}

interface ScanProgress {
  status: 'starting' | 'in-progress' | 'succeeded' | 'failed';
  message: string;
  spiderProgress: number;
  activeScanProgress: number;
  report?: ZapAlertsResponse;
  targetUrl: string;
  scanId: string;
  timestamp: number;
}

/* -----------------------------------------------------------
   Web-Application VAPT view
----------------------------------------------------------- */
const WebAppVAPTView: React.FC = () => {
  /* ---- component state ---- */
  const [targetUrl,   setTargetUrl]   = useState('');
  const [loading,     setLoading]     = useState(false);
  const [scanId,      setScanId]      = useState<string>('');
  const [progress,    setProgress]    = useState<ScanProgress | null>(null);
  const [report,      setReport]      = useState<ReportData | null>(null);
  const [pollingInterval, setPollingInterval] = useState<NodeJS.Timeout | null>(null);

  /* ---- check for existing active scans on mount ---- */
  useEffect(() => {
    checkForActiveScans();
  }, []);

  const checkForActiveScans = () => {
    const activeScans = localStorage.getItem('vapt_active_scans');
    if (activeScans) {
      try {
        const scans: ScanProgress[] = JSON.parse(activeScans);
        const activeScan = scans.find(scan => 
          scan.status === 'starting' || scan.status === 'in-progress'
        );
        
        if (activeScan) {
          console.log('Found active scan:', activeScan);
          setScanId(activeScan.scanId);
          setTargetUrl(activeScan.targetUrl);
          setProgress(activeScan);
          
          // Resume polling for this scan
          startPolling(activeScan.scanId);
        }
      } catch (error) {
        console.error('Error parsing active scans:', error);
        localStorage.removeItem('vapt_active_scans');
      }
    }
  };

  const saveScanState = (scanData: ScanProgress) => {
    const existingScans = localStorage.getItem('vapt_active_scans');
    let scans: ScanProgress[] = [];
    
    if (existingScans) {
      try {
        scans = JSON.parse(existingScans);
      } catch (error) {
        scans = [];
      }
    }
    
    // Remove old scans (older than 1 hour)
    const oneHourAgo = Date.now() - (60 * 60 * 1000);
    scans = scans.filter(scan => scan.timestamp > oneHourAgo);
    
    // Add or update current scan
    const existingIndex = scans.findIndex(scan => scan.scanId === scanData.scanId);
    if (existingIndex >= 0) {
      scans[existingIndex] = scanData;
    } else {
      scans.push(scanData);
    }
    
    localStorage.setItem('vapt_active_scans', JSON.stringify(scans));
  };

  const removeScanState = (scanId: string) => {
    const existingScans = localStorage.getItem('vapt_active_scans');
    if (existingScans) {
      try {
        let scans: ScanProgress[] = JSON.parse(existingScans);
        scans = scans.filter(scan => scan.scanId !== scanId);
        localStorage.setItem('vapt_active_scans', JSON.stringify(scans));
      } catch (error) {
        console.error('Error removing scan state:', error);
      }
    }
  };

  /* ---- start scan ---- */
  const startScan = async () => {
    try {
      setLoading(true);
      setProgress(null);
      setReport(null);
      setScanId('');

      const resp = await fetch('http://localhost:3001/api/start-scan', {
        method : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body   : JSON.stringify({ targetUrl })
      });

      if (!resp.ok) throw new Error('Scan failed to start');
      const data = await resp.json();

      if (data.scanId) {
        setScanId(data.scanId);
        const initialProgress: ScanProgress = {
          status: 'starting', 
          message: 'Initializing ZAP scan...',
          spiderProgress: 0,
          activeScanProgress: 0,
          targetUrl: targetUrl,
          scanId: data.scanId,
          timestamp: Date.now()
        };
        setProgress(initialProgress);
        saveScanState(initialProgress);
        
        // Start polling for progress updates
        startPolling(data.scanId);
      } else {
        throw new Error('No scan ID received');
      }
    } catch (err) {
      console.error(err);
      setProgress({ 
        status: 'failed', 
        message: 'Error starting scan: ' + (err as Error).message,
        spiderProgress: 0,
        activeScanProgress: 0,
        targetUrl: targetUrl,
        scanId: '',
        timestamp: Date.now()
      });
    } finally {
      setLoading(false);
    }
  };

  /* ---- polling for progress updates ---- */
  const startPolling = (id: string) => {
    const interval = setInterval(async () => {
      try {
        const resp = await fetch(`http://localhost:3001/api/scan-status/${id}`);
        if (!resp.ok) throw new Error('Failed to get scan status');
        
        const progressData: ScanProgress = await resp.json();
        
        // Add our persistent data
        const fullProgressData: ScanProgress = {
          ...progressData,
          targetUrl: targetUrl,
          scanId: id,
          timestamp: Date.now()
        };
        
        setProgress(fullProgressData);
        saveScanState(fullProgressData);
        
        // If scan completed, stop polling and process results
        if (progressData.status === 'succeeded' && progressData.report) {
          clearInterval(interval);
          setPollingInterval(null);
          removeScanState(id);
          
          // Process the report
          const zap: ZapAlertsResponse = progressData.report;
          const all: ZapAlert[] = zap.site.flatMap(s => s.alerts);

          const byCode = (c: string) => all.filter(a => a.riskcode === c).length;

          setReport({
            totalVulnerabilities: all.length,
            high       : byCode('3'),
            medium     : byCode('2'),
            low        : byCode('1'),
            informational: byCode('0'),
            details    : all
          });
        } else if (progressData.status === 'failed') {
          clearInterval(interval);
          setPollingInterval(null);
          removeScanState(id);
        }
      } catch (err) {
        console.error('Error polling scan status:', err);
      }
    }, 2000); // Poll every 2 seconds
    
    setPollingInterval(interval);
  };

  /* ---- cleanup on unmount ---- */
  useEffect(() => {
    return () => {
      if (pollingInterval) {
        clearInterval(pollingInterval);
      }
    };
  }, [pollingInterval]);

  /* ---------- UI ---------- */
  return (
    <div className="p-8">
      {/* Header ------------------------------------------------ */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">Web Application VAPT</h2>
        <button className="btn-primary flex items-center space-x-2">
          <PlusIcon />
          <span>New Web App Scan</span>
        </button>
      </div>

      {/* Scan configuration card ------------------------------ */}
      <div className="card mb-6">
        <h3 className="text-lg font-semibold text-white mb-4">Scan Configuration</h3>

        <label className="block text-gray-300 text-sm font-medium mb-2">
          Target URL
        </label>
        <input
          className="w-full bg-dark-bg border border-dark-border rounded-lg px-3 py-2
                     text-white placeholder-gray-500 focus:outline-none focus:border-accent"
          type="url"
          placeholder="https://example.com"
          value={targetUrl}
          onChange={e => setTargetUrl(e.target.value)}
        />

        <div className="flex items-center space-x-3 mt-4">
          <button
            className={`btn-primary flex items-center space-x-2
                       ${loading || !targetUrl.trim() ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={loading || !targetUrl.trim()}
            onClick={startScan}
          >
            <PlusIcon />
            <span>{loading ? 'Starting ZAP scan…' : 'Start ZAP Scan'}</span>
          </button>
        </div>
      </div>

      {/* Progress Section ------------------------------------- */}
      {progress && (
        <div className="card mb-6">
          <h3 className="text-lg font-semibold text-white mb-4">Scan Progress</h3>
          
          <div className="mb-4">
            <p className="text-gray-300 mb-2">{progress.message}</p>
            <p className="text-sm text-gray-500">Target: {progress.targetUrl}</p>
          </div>

          {/* Spider Scan Progress */}
          <div className="mb-4">
            <div className="flex justify-between text-sm text-gray-400 mb-1">
              <span>Spider Scan</span>
              <span>{progress.spiderProgress}%</span>
            </div>
            <div className="w-full bg-dark-bg rounded-full h-2">
              <div 
                className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${progress.spiderProgress}%` }}
              ></div>
            </div>
          </div>

          {/* Active Scan Progress */}
          <div className="mb-4">
            <div className="flex justify-between text-sm text-gray-400 mb-1">
              <span>Active Scan</span>
              <span>{progress.activeScanProgress}%</span>
            </div>
            <div className="w-full bg-dark-bg rounded-full h-2">
              <div 
                className="bg-green-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${progress.activeScanProgress}%` }}
              ></div>
            </div>
          </div>

          {/* Status Indicator */}
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${
              progress.status === 'failed' ? 'bg-red-500' :
              progress.status === 'succeeded' ? 'bg-green-500' :
              'bg-yellow-500 animate-pulse'
            }`}></div>
            <span className={`text-sm ${
              progress.status === 'failed' ? 'text-red-400' :
              progress.status === 'succeeded' ? 'text-green-400' :
              'text-yellow-400'
            }`}>
              {progress.status === 'failed' ? 'Failed' :
               progress.status === 'succeeded' ? 'Completed' :
               'In Progress'}
            </span>
          </div>
        </div>
      )}

      {/* Results ---------------------------------------------- */}
      {report && (
        <div className="card">
          <h3 className="text-lg font-semibold text-white mb-4">ZAP Scan Results</h3>

          {/* summary tiles */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
            {[
              { label: 'Total',     value: report.totalVulnerabilities,  colour: 'white' },
              { label: 'High',      value: report.high,   colour: 'danger' },
              { label: 'Medium',    value: report.medium, colour: 'warning' },
              { label: 'Low',       value: report.low,    colour: 'info' },
              { label: 'Info',      value: report.informational, colour: 'gray-400' },
            ].map((t, i) => (
              <div key={i} className="text-center p-4 bg-dark-bg rounded-lg">
                <p className={`text-2xl font-bold text-${t.colour}`}>{t.value}</p>
                <p className="text-gray-400 text-sm">{t.label}</p>
              </div>
            ))}
          </div>

          {/* detailed table */}
          {report.details.length > 0 && (
            <>
              <h4 className="text-md font-semibold text-white mb-3">Detailed Findings</h4>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-dark-border">
                      <th className="text-left py-2 px-3 text-gray-300">Vulnerability</th>
                      <th className="text-left py-2 px-3 text-gray-300">URL</th>
                      <th className="text-left py-2 px-3 text-gray-300">Risk</th>
                    </tr>
                  </thead>
                  <tbody>
                    {report.details.map((a, idx) => (
                      <tr key={idx} className="border-b border-dark-border/50">
                        <td className="py-2 px-3 text-white">{a.alert}</td>
                        <td className="py-2 px-3 text-gray-400 truncate max-w-xs">{a.url}</td>
                        <td className="py-2 px-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            a.riskcode === '3' ? 'bg-danger/20 text-danger'
                          : a.riskcode === '2' ? 'bg-warning/20 text-warning'
                          : a.riskcode === '1' ? 'bg-info/20 text-info'
                          : 'bg-gray-400/20 text-gray-400'}`}>
                            {a.riskdesc}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default WebAppVAPTView;
