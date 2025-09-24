import React from 'react';
import { Link } from 'react-router-dom';

const AnimatedTitle: React.FC = () => {
  return (
    <div className="relative">
      <style dangerouslySetInnerHTML={{
        __html: `
          .animated-button {
            margin: 0;
            height: auto;
            background: transparent;
            padding: 0;
            border: none;
            cursor: pointer;
            --border-right: 6px;
            --text-stroke-color: rgba(156, 163, 175, 0.6);
            --animation-color: #135bec;
            --fs-size: 2.5em;
            letter-spacing: 3px;
            text-decoration: none;
            font-size: var(--fs-size);
            font-family: "Space Grotesk", sans-serif;
            position: relative;
            text-transform: uppercase;
            color: transparent;
            -webkit-text-stroke: 1px var(--text-stroke-color);
          }
          .hover-text {
            position: absolute;
            box-sizing: border-box;
            color: var(--animation-color);
            width: 0%;
            inset: 0;
            border-right: var(--border-right) solid var(--animation-color);
            overflow: hidden;
            transition: 0.5s;
            -webkit-text-stroke: 1px var(--animation-color);
          }
          .animated-button:hover .hover-text {
            width: 100%;
            filter: drop-shadow(0 0 23px var(--animation-color));
          }
          @media (prefers-color-scheme: dark) {
            .animated-button {
              --text-stroke-color: rgba(255, 255, 255, 0.6);
            }
          }
        `
      }} />
      <button className="animated-button">
        <span className="actual-text">&nbsp;MIT CBC VAPT &nbsp;</span>
        <span aria-hidden="true" className="hover-text">&nbsp;MIT CBC VAPT&nbsp;</span>
      </button>
    </div>
  );
};

const NewHero: React.FC = () => {

  return (
    <main className="flex-1 px-4 sm:px-6 md:px-10 lg:px-20 xl:px-40 py-10 lg:py-20">
      {/* Hero Section */}
      <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-center">
        <div className="flex-1 space-y-6 animate-fade-in-up">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white leading-tight">
            Secure your digital presence with MIT's VAPT Platform
          </h1>
          <p className="text-base md:text-lg text-gray-600 dark:text-gray-400">
            Comprehensive vulnerability assessment and penetration testing, simplified.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link 
              to="/web"
              className="px-5 py-3 rounded-lg bg-primary text-white font-bold text-sm shadow-[0_4px_0_0_#0a44a5] hover:shadow-[0_2px_0_0_#0a44a5] hover:-translate-y-0.5 transition-all duration-200"
            >
              Start VAPT Scan
            </Link>
            <button className="px-5 py-3 rounded-lg bg-primary/10 dark:bg-primary/20 text-primary font-bold text-sm hover:bg-primary/20 dark:hover:bg-primary/30 transition-colors">
              Learn More
            </button>
          </div>
        </div>
        <div className="flex-1 w-full animate-fade-in-down flex justify-center">
          <AnimatedTitle />
        </div>
      </div>
      
      {/* Security Pillars */}
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

      {/* How It Works */}
      <div className="mt-16 lg:mt-24">
        <h3 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-8">How It Works</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-primary/10 dark:bg-primary/20 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <h4 className="font-bold text-gray-900 dark:text-white">1. Initiate</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">Start your security assessment with a simple click</p>
          </div>
          <div className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-primary/10 dark:bg-primary/20 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h4 className="font-bold text-gray-900 dark:text-white">2. Analyze</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">Comprehensive scanning identifies vulnerabilities</p>
          </div>
          <div className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-primary/10 dark:bg-primary/20 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h4 className="font-bold text-gray-900 dark:text-white">3. Fix</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">Get actionable remediation guidance</p>
          </div>
          <div className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-primary/10 dark:bg-primary/20 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h4 className="font-bold text-gray-900 dark:text-white">4. Stay Protected</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">Continuous monitoring keeps you secure</p>
          </div>
        </div>
      </div>

      {/* Key Features */}
      <div className="mt-16 lg:mt-24">
        <h3 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-8">Key Features</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex gap-4 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="text-primary bg-primary/10 dark:bg-primary/20 p-3 rounded-full flex-shrink-0">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </div>
            <div>
              <h4 className="font-bold text-gray-900 dark:text-white mb-2">Continuous Scanning & Monitoring</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">24/7 automated security assessments to catch vulnerabilities as they emerge</p>
            </div>
          </div>
          <div className="flex gap-4 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="text-primary bg-primary/10 dark:bg-primary/20 p-3 rounded-full flex-shrink-0">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div>
              <h4 className="font-bold text-gray-900 dark:text-white mb-2">Risk-Based Vulnerability Scoring</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">Intelligent prioritization helps you focus on the most critical security issues</p>
            </div>
          </div>
          <div className="flex gap-4 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="text-primary bg-primary/10 dark:bg-primary/20 p-3 rounded-full flex-shrink-0">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
            </div>
            <div>
              <h4 className="font-bold text-gray-900 dark:text-white mb-2">Developer-Friendly Remediation Guides</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">Clear, actionable fix recommendations that integrate seamlessly into your workflow</p>
            </div>
          </div>
          <div className="flex gap-4 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="text-primary bg-primary/10 dark:bg-primary/20 p-3 rounded-full flex-shrink-0">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div>
              <h4 className="font-bold text-gray-900 dark:text-white mb-2">Real-Time Dashboards & Reports</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">Comprehensive insights and detailed reporting for stakeholders at every level</p>
            </div>
          </div>
        </div>
      </div>

      {/* Why Choose Us */}
      <div className="mt-16 lg:mt-24">
        <h3 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-8">Why Choose Us</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="text-center p-6 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="mx-auto w-16 h-16 bg-primary/10 dark:bg-primary/20 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h4 className="font-bold text-gray-900 dark:text-white mb-2">Speed</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">Rapid deployment and fast scanning capabilities</p>
          </div>
          <div className="text-center p-6 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="mx-auto w-16 h-16 bg-primary/10 dark:bg-primary/20 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
            </div>
            <h4 className="font-bold text-gray-900 dark:text-white mb-2">Accuracy</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">Precise vulnerability detection with minimal false positives</p>
          </div>
          <div className="text-center p-6 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="mx-auto w-16 h-16 bg-primary/10 dark:bg-primary/20 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h4 className="font-bold text-gray-900 dark:text-white mb-2">Compliance</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">Meet industry standards and regulatory requirements</p>
          </div>
          <div className="text-center p-6 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="mx-auto w-16 h-16 bg-primary/10 dark:bg-primary/20 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h4 className="font-bold text-gray-900 dark:text-white mb-2">Collaboration</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">Seamless team integration and shared security insights</p>
          </div>
        </div>
      </div>

      {/* Final CTA Section */}
      <div className="mt-16 lg:mt-24 text-center bg-primary/5 dark:bg-primary/10 rounded-2xl p-8 lg:p-12">
        <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Ready to protect your digital assets?
        </h3>
        <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
          Join thousands of organizations that trust MIT's VAPT Platform for their security needs.
        </p>
        <Link 
          to="/web"
          className="inline-block px-8 py-4 rounded-lg bg-primary text-white font-bold text-lg shadow-[0_4px_0_0_#0a44a5] hover:shadow-[0_2px_0_0_#0a44a5] hover:-translate-y-0.5 transition-all duration-200"
        >
          Get Started Today
        </Link>
      </div>
    </main>
  );
};

export default NewHero;