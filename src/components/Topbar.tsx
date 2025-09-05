import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Topbar: React.FC = () => {
  const { pathname } = useLocation();
  const isActive = (path: string) => pathname === path ? 'text-accent' : 'text-gray-300 hover:text-white';

  return (
    <header className="bg-dark-card border-b border-dark-border sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="text-white font-bold text-lg">VAPT Platform</Link>
        <nav className="flex items-center gap-6">
          <Link to="/" className={isActive('/')}>Home</Link>
          <Link to="/web" className={isActive('/web')}>Web VAPT</Link>
          <Link to="/mobile" className={isActive('/mobile')}>Mobile VAPT</Link>
          <Link to="/reports" className={isActive('/reports')}>Reports</Link>
        </nav>
      </div>
    </header>
  );
};

export default Topbar;


