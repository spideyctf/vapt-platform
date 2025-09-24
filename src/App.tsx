import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import NewHeader from './components/NewHeader';
import NewHero from './components/NewHero';
import Footer from './components/Footer';
import WebAppVAPTView from './components/WebAppVAPTView';
import MobileAppVAPTView from './components/MobileAppVAPTView';
import ReportsView from './components/ReportsView';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <div className="dark">
        <div className="relative flex min-h-screen w-full flex-col bg-background-light dark:bg-background-dark text-gray-800 dark:text-gray-200 font-display">
          <div className="absolute inset-0 h-full w-full bg-background-light dark:bg-background-dark bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
          <div className="relative flex h-full grow flex-col">
            <NewHeader />
            <Routes>
              <Route path="/" element={<NewHero />} />
              <Route path="/web" element={<div className="p-8"><WebAppVAPTView /></div>} />
              <Route path="/mobile" element={<div className="p-8"><MobileAppVAPTView /></div>} />
              <Route path="/reports" element={<div className="p-8"><ReportsView /></div>} />
            </Routes>
            <Footer />
          </div>
        </div>
      </div>
    </BrowserRouter>
  );
};

export default App;
