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
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">Reports</h2>
        <button
          onClick={handleGenerateReport}
          disabled={isGenerating}
          className={`btn-primary flex items-center space-x-2 ${isGenerating ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <PlusIcon />
          <span>{isGenerating ? 'Generating...' : 'Generate New Report'}</span>
        </button>
      </div>

      <div className="card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className="table-header">Report Title</th>
                <th className="table-header">Type</th>
                <th className="table-header">Date Generated</th>
                <th className="table-header">Vulnerabilities</th>
                <th className="table-header">Status</th>
                <th className="table-header">Actions</th>
              </tr>
            </thead>
            <tbody>
              {reports.length > 0 ? (
                reports.map((report) => (
                  <tr key={report.id} className="hover:bg-dark-bg/50 transition-colors">
                    <td className="table-cell font-medium text-white">
                      {report.title}
                    </td>
                    <td className="table-cell">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        report.type === 'Web App' 
                          ? 'bg-info/20 text-info' 
                          : 'bg-warning/20 text-warning'
                      }`}>
                        {report.type}
                      </span>
                    </td>
                    <td className="table-cell text-gray-400">
                      {report.dateGenerated}
                    </td>
                    <td className="table-cell">
                      <span className="font-mono text-lg font-semibold text-white">
                        {report.vulnerabilities}
                      </span>
                    </td>
                    <td className="table-cell">
                      <span className={`status-badge ${getStatusClass(report.status)}`}>
                        {report.status}
                      </span>
                    </td>
                    <td className="table-cell">
                      <button
                        onClick={() => handleDownload(report.id)}
                        className="flex items-center space-x-1 text-accent hover:text-accent-hover transition-colors"
                      >
                        <DownloadIcon />
                        <span>Download</span>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="table-cell text-center text-gray-400 py-8">
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
