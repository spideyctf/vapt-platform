import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="border-t border-primary/20 dark:border-primary/30 py-6 px-4 sm:px-6 md:px-10">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-center">
        <p className="text-sm text-gray-600 dark:text-gray-400">© 2025 VAPT Platform. All rights reserved.</p>
        <div className="flex gap-4">
          <a className="text-gray-500 dark:text-gray-400 hover:text-primary transition-colors" href="https://www.linkedin.com/company/cbc-mitadt/" target="_blank" rel="noopener noreferrer">
            <svg fill="currentColor" height="24px" viewBox="0 0 256 256" width="24px" xmlns="http://www.w3.org/2000/svg">
              <path d="M216,24H40A16,16,0,0,0,24,40V216a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V40A16,16,0,0,0,216,24Zm0,192H40V40H216V216ZM96,112v64a8,8,0,0,1-16,0V112a8,8,0,0,1,16,0Zm88,28v36a8,8,0,0,1-16,0V140a20,20,0,0,0-40,0v36a8,8,0,0,1-16,0V112a8,8,0,0,1,15.79-1.78A36,36,0,0,1,184,140ZM100,84A12,12,0,1,1,88,72,12,12,0,0,1,100,84Z"></path>
            </svg>
          </a>
          <a className="text-gray-500 dark:text-gray-400 hover:text-primary transition-colors" href="https://www.instagram.com/cbc_mitadt/" target="_blank" rel="noopener noreferrer">
            <svg fill="currentColor" height="24px" viewBox="0 0 256 256" width="24px" xmlns="http://www.w3.org/2000/svg">
              <path d="M128,80a48,48,0,1,0,48,48A48.05,48.05,0,0,0,128,80Zm0,80a32,32,0,1,1,32-32A32,32,0,0,1,128,160ZM176,24H80A56.06,56.06,0,0,0,24,80v96a56.06,56.06,0,0,0,56,56h96a56.06,56.06,0,0,0,56-56V80A56.06,56.06,0,0,0,176,24Zm40,152a40,40,0,0,1-40,40H80a40,40,0,0,1-40-40V80A40,40,0,0,1,80,40h96a40,40,0,0,1,40,40ZM192,76a12,12,0,1,1-12-12A12,12,0,0,1,192,76Z"></path>
            </svg>
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;