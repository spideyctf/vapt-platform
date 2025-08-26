import React, { useState } from 'react';
import { ActiveView } from './types';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import DashboardView from './components/DashboardView';
import WebAppVAPTView from './components/WebAppVAPTView';
import MobileAppVAPTView from './components/MobileAppVAPTView';
import ReportsView from './components/ReportsView';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<ActiveView>('dashboard');
  const [searchQuery, setSearchQuery] = useState('');

  const handleViewChange = (view: ActiveView) => {
    setActiveView(view);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    // In a real application, this would filter the current view's data
    console.log('Search query:', query);
  };

  const renderActiveView = () => {
    switch (activeView) {
      case 'dashboard':
        return <DashboardView />;
      case 'web-app-vapt':
        return <WebAppVAPTView />;
      case 'mobile-app-vapt':
        return <MobileAppVAPTView />;
      case 'reports':
        return <ReportsView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="min-h-screen bg-dark-bg">
      <Sidebar activeView={activeView} onViewChange={handleViewChange} />
      
      <div className="ml-64">
        <Header onSearch={handleSearch} />
        
        <main className="min-h-screen">
          {renderActiveView()}
        </main>
      </div>
    </div>
  );
};

export default App;
