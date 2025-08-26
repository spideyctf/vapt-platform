import React, { useState } from 'react';
import { SearchIcon } from './Icons';

interface HeaderProps {
  onSearch: (query: string) => void;
}

const Header: React.FC<HeaderProps> = ({ onSearch }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  return (
    <header className="bg-dark-card border-b border-dark-border px-8 py-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">VAPT DASHBOARD | MIT CBC</h1>
        
        <form onSubmit={handleSearch} className="flex items-center">
          <div className="relative">
            <input
              type="text"
              placeholder="Search reports, vulnerabilities..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-dark-bg border border-dark-border rounded-lg pl-10 pr-4 py-2 text-gray-300 placeholder-gray-500 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent w-80"
            />
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
          </div>
          <button
            type="submit"
            className="ml-3 btn-primary"
          >
            Search
          </button>
        </form>
      </div>
    </header>
  );
};

export default Header;
