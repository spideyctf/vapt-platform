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

## Installation

### Quick Start (Recommended)
Use the provided scripts to start both frontend and backend servers:

**Windows:**
```bash
start-servers.bat
```

**Unix/Linux/macOS:**
```bash
chmod +x start-servers.sh
./start-servers.sh
```

### Manual Installation

1. **Install Frontend Dependencies**:
   ```bash
   npm install
   ```

2. **Install Backend Dependencies**:
   ```bash
   cd server
   npm install
   cd ..
   ```

3. **Start Backend Server**:
   ```bash
   cd server
   npm start
   ```

4. **Start Frontend Server** (in a new terminal):
   ```bash
   npm start
   ```

5. **Build for Production**:
   ```bash
   npm run build
   ```

## Usage

### Backend API Endpoints

The backend server provides the following API endpoints:

- **POST `/api/start-scan`**: Start a new scan with a target URL
- **GET `/api/scan-status/:scanId`**: Check scan status and retrieve reports
- **GET `/api/dashboard-summary`**: Get dashboard analytics data
- **GET `/api/health`**: Health check endpoint

### Frontend Features

#### Navigation
- **Dashboard**: Overview with real-time statistics and recent activity
- **Web App VAPT**: Web application vulnerability scanning interface
- **Mobile App VAPT**: Mobile application security testing interface
- **Reports**: View and download VAPT reports

#### Reports View
The Reports view includes:
- Clean, minimalistic table with real-time scan data
- Columns: Report Title, Type, Date Generated, Vulnerabilities, Status, Actions
- Download functionality for each report
- "Generate New Report" button that initiates real scans via Burp Suite API
- Automatic polling to monitor scan progress

#### Dashboard Integration
- Real-time dashboard data from backend API
- Live statistics for scans, vulnerabilities, and applications
- Recent activity feed with scan status updates

#### Search
Use the search bar in the header to search across reports and vulnerabilities.

## Technologies Used

### Frontend
- **React 18**: Modern React with hooks
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first CSS framework
- **Custom SVG Icons**: Self-contained icon system
- **React Hooks**: State management (useState, useEffect)

### Backend
- **Node.js**: JavaScript runtime
- **Express.js**: Web application framework
- **Axios**: HTTP client for API requests
- **CORS**: Cross-origin resource sharing
- **dotenv**: Environment variable management

## Customization

### Colors
The application uses a custom dark color palette defined in `tailwind.config.js`:
- `dark-bg`: Main background (#0f0f23)
- `dark-card`: Card backgrounds (#1a1a2e)
- `dark-border`: Borders (#2d2d44)
- `accent`: Primary accent color (#ff6b35)

### Adding New Views
1. Create a new component in `src/components/`
2. Add the view type to `src/types/index.ts`
3. Update the navigation in `src/components/Sidebar.tsx`
4. Add the view to the switch statement in `src/App.tsx`

## Development

### Adding New Icons
Add new SVG icons to `src/components/Icons.tsx` following the existing pattern.

### Styling
Use Tailwind CSS classes and custom CSS components defined in `src/index.css`.

### State Management
The application uses React hooks for state management. For larger applications, consider adding Redux or Context API.

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

This project is created for MIT CBC VAPT platform demonstration purposes.
