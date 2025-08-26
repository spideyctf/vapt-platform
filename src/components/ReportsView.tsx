import React, { useState } from 'react';
import { Report } from '../types';
import { DownloadIcon, PlusIcon } from './Icons';

const ReportsView: React.FC = () => {
  const [reports] = useState<Report[]>([
    {
      id: '1',
      title: 'E-commerce Platform Security Assessment',
      type: 'Web App',
      dateGenerated: '2024-01-15',
      vulnerabilities: 12,
      status: 'Completed'
    },
    {
      id: '2',
      title: 'Banking Mobile App Penetration Test',
      type: 'Mobile App',
      dateGenerated: '2024-01-12',
      vulnerabilities: 8,
      status: 'Completed'
    },
    {
      id: '3',
      title: 'Healthcare Portal Vulnerability Scan',
      type: 'Web App',
      dateGenerated: '2024-01-10',
      vulnerabilities: 15,
      status: 'Pending'
    },
    {
      id: '4',
      title: 'Social Media App Security Review',
      type: 'Mobile App',
      dateGenerated: '2024-01-08',
      vulnerabilities: 6,
      status: 'Completed'
    },
    {
      id: '5',
      title: 'Government Portal Assessment',
      type: 'Web App',
      dateGenerated: '2024-01-05',
      vulnerabilities: 22,
      status: 'Failed'
    },
    {
      id: '6',
      title: 'Fintech Mobile App VAPT',
      type: 'Mobile App',
      dateGenerated: '2024-01-03',
      vulnerabilities: 9,
      status: 'Completed'
    }
  ]);

  const handleDownload = (reportId: string) => {
    // In a real application, this would trigger a download
    console.log(`Downloading report ${reportId}`);
    alert(`Downloading report ${reportId}`);
  };

  const handleGenerateReport = () => {
    // In a real application, this would open a form or modal
    console.log('Generate new report clicked');
    alert('Generate New Report functionality would open a form here');
  };

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
          className="btn-primary flex items-center space-x-2"
        >
          <PlusIcon />
          <span>Generate New Report</span>
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
              {reports.map((report) => (
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
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ReportsView;
