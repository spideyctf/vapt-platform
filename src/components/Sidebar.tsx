import React from 'react';
import { ActiveView } from '../types';
import { DashboardIcon, WebAppIcon, MobileAppIcon, ReportsIcon, ShieldIcon } from './Icons';

interface SidebarProps {
  activeView: ActiveView;
  onViewChange: (view: ActiveView) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeView, onViewChange }) => {
  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <DashboardIcon /> },
    { id: 'web-app-vapt', label: 'Web App VAPT', icon: <WebAppIcon /> },
    { id: 'mobile-app-vapt', label: 'Mobile App VAPT', icon: <MobileAppIcon /> },
    { id: 'reports', label: 'Reports', icon: <ReportsIcon /> },
  ];

  return (
    <div className="w-64 bg-dark-card border-r border-dark-border h-screen fixed left-0 top-0">
      <div className="p-6">
        <div className="flex items-center space-x-2 mb-8">
          <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
            <ShieldIcon className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-white">VAPT</span>
        </div>
        
        <nav className="space-y-2">
          {navigationItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id as ActiveView)}
              className={`sidebar-link w-full ${
                activeView === item.id ? 'active' : ''
              }`}
            >
              <span className="mr-3">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
