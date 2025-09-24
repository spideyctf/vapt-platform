import React from 'react';
import { Link } from 'react-router-dom';
import { LogoIcon } from './Icons';

const NewHeader: React.FC = () => {
  return (
    <header className="flex items-center justify-between whitespace-nowrap border-b border-primary/20 dark:border-primary/30 px-10 py-3">
      <div className="flex items-center gap-4 text-gray-900 dark:text-white">
        <LogoIcon className="w-8 h-8" />
        <h2 className="text-lg font-bold">VAPT Platform</h2>
      </div>
      <div className="flex flex-1 justify-end gap-6 items-center">
        <div className="hidden md:flex items-center gap-6">
          <Link className="text-sm font-medium hover:text-primary transition-colors" to="/">Home</Link>
          <Link className="text-sm font-medium hover:text-primary transition-colors" to="/dashboard">Dashboard</Link>
          <Link className="text-sm font-medium hover:text-primary transition-colors" to="/web">Web VAPT</Link>
          <Link className="text-sm font-medium hover:text-primary transition-colors" to="/mobile">Mobile VAPT</Link>
          <Link className="text-sm font-medium hover:text-primary transition-colors" to="/reports">Reports</Link>
        </div>
        <button className="flex items-center justify-center rounded-full size-10 bg-primary/10 dark:bg-primary/20 text-gray-600 dark:text-gray-300 hover:bg-primary/20 dark:hover:bg-primary/30 transition-colors">
          <svg fill="currentColor" height="20px" viewBox="0 0 256 256" width="20px" xmlns="http://www.w3.org/2000/svg">
            <path d="M221.8,175.94C216.25,166.38,208,139.33,208,104a80,80,0,1,0-160,0c0,35.34-8.26,62.38-13.81,71.94A16,16,0,0,0,48,200H88.81a40,40,0,0,0,78.38,0H208a16,16,0,0,0,13.8-24.06ZM128,216a24,24,0,0,1-22.62-16h45.24A24,24,0,0,1,128,216ZM48,184c7.7-13.24,16-43.92,16-80a64,64,0,1,1,128,0c0,36.05,8.28,66.73,16,80Z"></path>
          </svg>
        </button>

      </div>
    </header>
  );
};

export default NewHeader;