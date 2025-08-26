export interface Report {
  id: string;
  title: string;
  type: 'Web App' | 'Mobile App';
  dateGenerated: string;
  vulnerabilities: number;
  status: 'Completed' | 'Pending' | 'Failed';
}

export interface NavigationItem {
  id: string;
  label: string;
  icon: React.ReactNode;
}

export type ActiveView = 'dashboard' | 'web-app-vapt' | 'mobile-app-vapt' | 'reports';
