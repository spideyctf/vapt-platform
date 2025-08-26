# VAPT Dashboard | MIT CBC

A modern, dark-themed Vulnerability Assessment and Penetration Testing (VAPT) dashboard built with React, TypeScript, and Tailwind CSS.

## Features

- **Dark Theme**: Minimalistic dark design optimized for security professionals
- **Responsive Layout**: Fixed-width sidebar with main content area
- **Navigation**: Dashboard, Web App VAPT, Mobile App VAPT, and Reports views
- **Self-contained Icons**: Custom SVG icons without external dependencies
- **Reports Management**: Clean table with dummy data and download functionality
- **Search Functionality**: Global search bar in the header
- **TypeScript**: Full type safety throughout the application

## Project Structure

```
vapt-platform/
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
├── package.json
├── tsconfig.json
├── tailwind.config.js
└── postcss.config.js
```

## Installation

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Start Development Server**:
   ```bash
   npm start
   ```

3. **Build for Production**:
   ```bash
   npm run build
   ```

## Usage

### Navigation
- **Dashboard**: Overview with statistics and recent activity
- **Web App VAPT**: Web application vulnerability scanning interface
- **Mobile App VAPT**: Mobile application security testing interface
- **Reports**: View and download VAPT reports

### Reports View
The Reports view includes:
- Clean, minimalistic table with hard-coded dummy data
- Columns: Report Title, Type, Date Generated, Vulnerabilities, Status, Actions
- Download functionality for each report
- "Generate New Report" button

### Search
Use the search bar in the header to search across reports and vulnerabilities.

## Technologies Used

- **React 18**: Modern React with hooks
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first CSS framework
- **Custom SVG Icons**: Self-contained icon system
- **React Hooks**: State management (useState)

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
