# VAPT Platform | MIT CBC

A Vulnerability Assessment and Penetration Testing (VAPT) platform with a React frontend and Node.js/Express backend.

## Features

- **Navigation**: Dashboard, Web App VAPT, Mobile App VAPT, and Reports views
- **Reports Management**: Clean table with real-time scan data and download functionality
- **Search Functionality**: Global search bar in the header
- **TypeScript**: Full type safety throughout the application
- **Backend Integration**: Node.js/Express server with OWASP ZAP API integration
- **Real-time Scanning**: Start scans and monitor progress with automatic polling
- **Dashboard Analytics**: Real-time dashboard data from backend API

## Project Structure

```
vapt-platform/
├── server/                    # Backend Node.js/Express server
│   ├── server.js             # Main server file with API endpoints
│   ├── config.js             # Configuration and environment variables
│   ├── package.json          # Backend dependencies
│   └── README.md             # Backend documentation
├── public/
│   ├── index.html
│   └── manifest.json
├── src/
│   ├── components/
│   │   ├── Icons.tsx          # Self-contained SVG icons
│   │   ├── Sidebar.tsx        # Navigation sidebar
│   │   ├── Header.tsx         # Header with search
│   │   ├── DashboardView.tsx  # Main dashboard
│   │   ├── WebAppVAPTView.tsx # Web app VAPT interface
│   │   ├── MobileAppVAPTView.tsx # Mobile app VAPT interface
│   │   └── ReportsView.tsx    # Reports table and management
│   ├── types/
│   │   └── index.ts           # TypeScript type definitions
│   ├── App.tsx                # Main application component
│   ├── index.tsx              # Application entry point
│   └── index.css              # Tailwind CSS and custom styles
├── package.json               # Frontend dependencies
├── tsconfig.json
├── tailwind.config.js
├── postcss.config.js
├── start-servers.bat          # Windows script to start both servers
└── start-servers.sh           # Unix/Linux script to start both servers
```

## License

This project is created for MIT CBC VAPT platform demonstration purposes.
