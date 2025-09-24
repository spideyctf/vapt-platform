import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const NewHero: React.FC = () => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = 127;
    const duration = 1500;
    const increment = end / (duration / 16);
    
    const interval = setInterval(() => {
      start += increment;
      if (start >= end) {
        start = end;
        clearInterval(interval);
      }
      setCount(Math.ceil(start));
    }, 16);

    return () => clearInterval(interval);
  }, []);

  return (
    <main className="flex-1 px-4 sm:px-6 md:px-10 lg:px-20 xl:px-40 py-10 lg:py-20">
      <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-center">
        <div className="flex-1 space-y-6 animate-fade-in-up">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white leading-tight">
            Secure your digital presence with VAPT Platform's VAPT platform
          </h1>
          <p className="text-base md:text-lg text-gray-600 dark:text-gray-400">
            Our Vulnerability Assessment and Penetration Testing (VAPT) platform provides comprehensive security insights to protect your digital assets.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link 
              to="/web"
              className="px-5 py-3 rounded-lg bg-primary text-white font-bold text-sm shadow-[0_4px_0_0_#0a44a5] hover:shadow-[0_2px_0_0_#0a44a5] hover:-translate-y-0.5 transition-all duration-200"
            >
              Start VAPT Scan
            </Link>
            <button className="px-5 py-3 rounded-lg bg-primary/10 dark:bg-primary/20 text-primary font-bold text-sm hover:bg-primary/20 dark:hover:bg-primary/30 transition-colors">
              Learn more
            </button>
          </div>
        </div>
        <div className="flex-1 w-full animate-fade-in-down">
          <div className="rounded-xl border border-primary/20 dark:border-primary/30 bg-primary/5 dark:bg-primary/10 p-6 shadow-lg backdrop-blur-sm">
            <p className="font-bold text-lg text-gray-900 dark:text-white">Total Vulnerabilities</p>
            <div className="my-4 text-6xl font-bold text-primary tabular-nums">
              {count}
            </div>
            <div className="text-sm space-y-1 text-gray-600 dark:text-gray-400">
              <p><span className="font-semibold text-gray-800 dark:text-gray-200">High:</span> 15</p>
              <p><span className="font-semibold text-gray-800 dark:text-gray-200">Medium:</span> 42</p>
              <p><span className="font-semibold text-gray-800 dark:text-gray-200">Low:</span> 70</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-16 lg:mt-24">
        <h3 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-8">Security Pillars</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="flex items-center gap-4 rounded-lg border border-primary/20 dark:border-primary/30 bg-primary/5 dark:bg-primary/10 p-4">
            <div className="text-primary bg-primary/10 dark:bg-primary/20 p-3 rounded-full">
              <svg fill="currentColor" height="24px" viewBox="0 0 256 256" width="24px" xmlns="http://www.w3.org/2000/svg">
                <path d="M208,40H48A16,16,0,0,0,32,56v58.78c0,89.61,75.82,119.34,91,124.39a15.53,15.53,0,0,0,10,0c15.2-5.05,91-34.78,91-124.39V56A16,16,0,0,0,208,40Zm0,74.79c0,78.42-66.35,104.62-80,109.18-13.53-4.51-80-30.69-80-109.18V56H208ZM82.34,141.66a8,8,0,0,1,11.32-11.32L112,148.68l50.34-50.34a8,8,0,0,1,11.32,11.32l-56,56a8,8,0,0,1-11.32,0Z"></path>
              </svg>
            </div>
            <h2 className="font-bold text-gray-900 dark:text-white">Authentication</h2>
          </div>
          <div className="flex items-center gap-4 rounded-lg border border-primary/20 dark:border-primary/30 bg-primary/5 dark:bg-primary/10 p-4">
            <div className="text-primary bg-primary/10 dark:bg-primary/20 p-3 rounded-full">
              <svg fill="currentColor" height="24px" viewBox="0 0 256 256" width="24px" xmlns="http://www.w3.org/2000/svg">
                <path d="M128,112a28,28,0,0,0-8,54.83V184a8,8,0,0,0,16,0V166.83A28,28,0,0,0,128,112Zm0,40a12,12,0,1,1,12-12A12,12,0,0,1,128,152Zm80-72H176V56a48,48,0,0,0-96,0V80H48A16,16,0,0,0,32,96V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V96A16,16,0,0,0,208,80ZM96,56a32,32,0,0,1,64,0V80H96ZM208,208H48V96H208V208Z"></path>
              </svg>
            </div>
            <h2 className="font-bold text-gray-900 dark:text-white">Encryption</h2>
          </div>
          <div className="flex items-center gap-4 rounded-lg border border-primary/20 dark:border-primary/30 bg-primary/5 dark:bg-primary/10 p-4">
            <div className="text-primary bg-primary/10 dark:bg-primary/20 p-3 rounded-full">
              <svg fill="currentColor" height="24px" viewBox="0 0 256 256" width="24px" xmlns="http://www.w3.org/2000/svg">
                <path d="M183.89,153.34a57.6,57.6,0,0,1-46.56,46.55A8.75,8.75,0,0,1,136,200a8,8,0,0,1-1.32-15.89c16.57-2.79,30.63-16.85,33.44-33.45a8,8,0,0,1,15.78,2.68ZM216,144a88,88,0,0,1-176,0c0-27.92,11-56.47,32.66-84.85a8,8,0,0,1,11.93-.89l24.12,23.41,22-60.41a8,8,0,0,1,12.63-3.41C165.21,36,216,84.55,216,144Zm-16,0c0-46.09-35.79-85.92-58.21-106.33L119.52,98.74a8,8,0,0,1-13.09,3L80.06,76.16C64.09,99.21,56,122,56,144a72,72,0,0,0,144,0Z"></path>
              </svg>
            </div>
            <h2 className="font-bold text-gray-900 dark:text-white">Firewall</h2>
          </div>
        </div>
      </div>
    </main>
  );
};

export default NewHero;