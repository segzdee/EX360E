// EXTRASTAFF360 Enterprise Dashboard System
// Version: 2.0.0
// Implementation: Production

import React, { useEffect, useState } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ThemeProvider } from '@mui/material/styles';
import {
  Dashboard,
  DashboardItem,
  MetricsPanel,
  ActivityFeed,
  Analytics
} from './components/dashboard';
import {
  ClientDashboard,
  StaffDashboard,
  AgencyDashboard
} from './components/role-dashboards';

const DashboardSystem = () => {
  const [userRole, setUserRole] = useState(null);
  const [metrics, setMetrics] = useState({});
  const [loading, setLoading] = useState(true);

  // Dashboard Configuration by Role
  const DASHBOARD_CONFIG = {
    CLIENT: {
      components: [
        {
          id: 'active-shifts',
          title: 'Active Shifts',
          priority: 1,
          refreshInterval: 30000, // 30 seconds
          permissions: ['view_shifts', 'manage_shifts']
        },
        {
          id: 'staff-performance',
          title: 'Staff Performance Metrics',
          priority: 2,
          refreshInterval: 300000, // 5 minutes
          permissions: ['view_metrics']
        },
        {
          id: 'financial-summary',
          title: 'Financial Overview',
          priority: 3,
          refreshInterval: 600000, // 10 minutes
          permissions: ['view_finance']
        }
      ]
    },
    STAFF: {
      components: [
        {
          id: 'available-shifts',
          title: 'Available Shifts',
          priority: 1,
          refreshInterval: 30000,
          permissions: ['view_shifts']
        },
        {
          id: 'earnings-tracker',
          title: 'Earnings & Performance',
          priority: 2,
          refreshInterval: 300000,
          permissions: ['view_earnings']
        },
        {
          id: 'schedule-calendar',
          title: 'Upcoming Schedule',
          priority: 3,
          refreshInterval: 300000,
          permissions: ['view_schedule']
        }
      ]
    },
    AGENCY: {
      components: [
        {
          id: 'staff-management',
          title: 'Staff Management',
          priority: 1,
          refreshInterval: 60000,
          permissions: ['manage_staff']
        },
        {
          id: 'client-requests',
          title: 'Client Requests',
          priority: 2,
          refreshInterval: 30000,
          permissions: ['view_requests']
        },
        {
          id: 'revenue-analytics',
          title: 'Revenue Analytics',
          priority: 3,
          refreshInterval: 600000,
          permissions: ['view_finance']
        }
      ]
    }
  };

  // Role-specific Dashboard Renderers
  const renderDashboard = (role) => {
    switch (role) {
      case 'CLIENT':
        return <ClientDashboard config={DASHBOARD_CONFIG.CLIENT} />;
      case 'STAFF':
        return <StaffDashboard config={DASHBOARD_CONFIG.STAFF} />;
      case 'AGENCY':
        return <AgencyDashboard config={DASHBOARD_CONFIG.AGENCY} />;
      default:
        return <div>Authentication Required</div>;
    }
  };

  // Metrics Processing System
  const processMetrics = async () => {
    try {
      const response = await fetch('/api/metrics');
      const data = await response.json();
      setMetrics(data);
      setLoading(false);
    } catch (error) {
      console.error('Metrics processing failed:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    processMetrics();
    const metricsInterval = setInterval(processMetrics, 300000); // 5 minutes
    return () => clearInterval(metricsInterval);
  }, []);

  return (
    <div className="dashboard-container">
      <MetricsPanel metrics={metrics} loading={loading} />
      {renderDashboard(userRole)}
      <ActivityFeed />
      <Analytics />
    </div>
  );
};

export default DashboardSystem;
