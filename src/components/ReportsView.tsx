import React, { useState, useEffect } from 'react';
import { Report } from '../types';
import { DownloadIcon, PlusIcon } from './Icons';

const ReportsView: React.FC = () => {
  const [reports, setReports] = useState<Report[]>([]);

  const handleDownload = (reportId: string) => {
    // In a real application, this would trigger a download
    console.log(`Downloading report ${reportId}`);
    alert(`Downloading report ${reportId}`);
  };

  const [isGenerating, setIsGenerating] = useState(false);
  const [currentScanId, setCurrentScanId] = useState<string | null>(null);
  const [pollingInterval, setPollingInterval] = useState<NodeJS.Timeout | null>(null);

  const handleGenerateReport = async () => {
    try {
      setIsGenerating(true);
      
      // Start a new scan with a hardcoded URL
      const response = await fetch('http://localhost:3001/api/start-scan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          targetUrl: 'http://example.com'
        })
      });

      if (!response.ok) {
        throw new Error('Failed to start scan');
      }

      const data = await response.json();
      const scanId = data.scanId;
      setCurrentScanId(scanId);

      // Start polling for scan status
      const interval = setInterval(async () => {
        try {
          const statusResponse = await fetch(`http://localhost:3001/api/scan-status/${scanId}`);
          if (!statusResponse.ok) {
            throw new Error('Failed to check scan status');
          }

          const statusData = await statusResponse.json();
          
          if (statusData.status === 'succeeded') {
            // Scan completed, add to reports
            const newReport: Report = {
              id: scanId,
              title: `Security Scan - ${new Date().toLocaleDateString()}`,
              type: 'Web App',
              dateGenerated: new Date().toISOString().split('T')[0],
              vulnerabilities: statusData.report?.vulnerabilities?.length || 0,
              status: 'Completed'
            };
            
            setReports(prev => [newReport, ...prev]);
            clearInterval(interval);
            setPollingInterval(null);
            setCurrentScanId(null);
            setIsGenerating(false);
          } else if (statusData.status === 'failed') {
            // Scan failed
            clearInterval(interval);
            setPollingInterval(null);
            setCurrentScanId(null);
            setIsGenerating(false);
            alert('Scan failed. Please try again.');
          }
          // If still running, continue polling
        } catch (error) {
          console.error('Error checking scan status:', error);
          clearInterval(interval);
          setPollingInterval(null);
          setCurrentScanId(null);
          setIsGenerating(false);
          alert('Error checking scan status. Please try again.');
        }
      }, 5000); // Poll every 5 seconds

      setPollingInterval(interval);
    } catch (error) {
      console.error('Error starting scan:', error);
      setIsGenerating(false);
      alert('Failed to start scan. Please try again.');
    }
  };

  // Cleanup polling interval on component unmount
  useEffect(() => {
    return () => {
      if (pollingInterval) {
        clearInterval(pollingInterval);
      }
    };
  }, [pollingInterval]);

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'status-completed';
      case 'Pending':
        return 'status-pending';
      case 'Failed':
        return 'status-failed';
      default:
        return '';
    }
  };

  return (
    <div className="px-4 sm:px-6 md:px-10 lg:px-20 xl:px-40 py-10">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Reports</h2>
        <button
          onClick={handleGenerateReport}
          disabled={isGenerating}
          className={`px-5 py-3 rounded-lg bg-primary text-white font-bold text-sm shadow-[0_4px_0_0_#0a44a5] hover:shadow-[0_2px_0_0_#0a44a5] hover:-translate-y-0.5 transition-all duration-200 flex items-center space-x-2 ${isGenerating ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <PlusIcon />
          <span>{isGenerating ? 'Generating...' : 'Generate New Report'}</span>
        </button>
      </div>

      <div className="rounded-xl border border-primary/20 dark:border-primary/30 bg-primary/5 dark:bg-primary/10 p-6 shadow-lg backdrop-blur-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className="text-left py-3 px-4 text-gray-600 dark:text-gray-400 font-medium">Report Title</th>
                <th className="text-left py-3 px-4 text-gray-600 dark:text-gray-400 font-medium">Type</th>
                <th className="text-left py-3 px-4 text-gray-600 dark:text-gray-400 font-medium">Date Generated</th>
                <th className="text-left py-3 px-4 text-gray-600 dark:text-gray-400 font-medium">Vulnerabilities</th>
                <th className="text-left py-3 px-4 text-gray-600 dark:text-gray-400 font-medium">Status</th>
                <th className="text-left py-3 px-4 text-gray-600 dark:text-gray-400 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {reports.length > 0 ? (
                reports.map((report) => (
                  <tr key={report.id} className="hover:bg-white/50 dark:hover:bg-gray-800/50 transition-colors border-b border-gray-200 dark:border-gray-700">
                    <td className="py-3 px-4 font-medium text-gray-900 dark:text-white">
                      {report.title}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        report.type === 'Web App' 
                          ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' 
                          : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400'
                      }`}>
                        {report.type}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-600 dark:text-gray-400">
                      {report.dateGenerated}
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-mono text-lg font-semibold text-gray-900 dark:text-white">
                        {report.vulnerabilities}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        report.status === 'Completed' ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' :
                        report.status === 'Pending' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400' :
                        'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
                      }`}>
                        {report.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => handleDownload(report.id)}
                        className="flex items-center space-x-1 text-primary hover:text-primary/80 transition-colors"
                      >
                        <DownloadIcon />
                        <span>Download</span>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-8 px-4 text-center text-gray-600 dark:text-gray-400">
                    No reports available. Generate your first report to get started.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ReportsView;
