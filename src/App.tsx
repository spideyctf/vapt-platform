import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Topbar from './components/Topbar';
import Hero from './components/Hero';
import WebAppVAPTView from './components/WebAppVAPTView';
import MobileAppVAPTView from './components/MobileAppVAPTView';
import ReportsView from './components/ReportsView';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-dark-bg">
        <Topbar />
        <main className="max-w-7xl mx-auto px-4 py-6">
          <Routes>
            <Route path="/" element={<Hero />} />
            <Route path="/web" element={<WebAppVAPTView />} />
            <Route path="/mobile" element={<MobileAppVAPTView />} />
            <Route path="/reports" element={<ReportsView />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
};

export default App;
