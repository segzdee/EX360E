import React from 'react';
import { styled } from '@mui/material/styles';
import {
  Dashboard,
  Assignment,
  People,
  Payment,
  Assessment
} from '@mui/icons-material';

// Dashboard Container Styling
const DashboardContainer = styled('div')(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: '250px 1fr',
  minHeight: '100vh',
  backgroundColor: theme.palette.background.default,
}));

// Sidebar Styling
const Sidebar = styled('div')(({ theme }) => ({
  padding: theme.spacing(2),
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
}));

// Main Content Styling
const MainContent = styled('div')(({ theme }) => ({
  padding: theme.spacing(3),
}));

// Dashboard Components
export const ClientDashboardUI = () => (
  <DashboardContainer>
    <Sidebar>
      <nav>
        <MenuItem icon={<Dashboard />} text="Overview" />
        <MenuItem icon={<Assignment />} text="Post Shifts" />
        <MenuItem icon={<People />} text="Staff Applications" />
        <MenuItem icon={<Payment />} text="Payments" />
        <MenuItem icon={<Assessment />} text="Reports" />
      </nav>
    </Sidebar>
    <MainContent>
      <MetricsGrid>
        <MetricCard
          title="Active Shifts"
          value={5}
          trend="+2 from last week"
        />
        <MetricCard
          title="Pending Applications"
          value={12}
          trend="+5 new applications"
        />
        <MetricCard
          title="Total Spent"
          value="$2,450"
          trend="+15% this month"
        />
      </MetricsGrid>
      <ShiftManagement />
      <ApplicationsTable />
    </MainContent>
  </DashboardContainer>
);

export const StaffDashboardUI = () => (
  <DashboardContainer>
    <Sidebar>
      <nav>
        <MenuItem icon={<Dashboard />} text="Overview" />
        <MenuItem icon={<Assignment />} text="Available Shifts" />
        <MenuItem icon={<Payment />} text="Earnings" />
        <MenuItem icon={<Assessment />} text="Performance" />
      </nav>
    </Sidebar>
    <MainContent>
      <MetricsGrid>
        <MetricCard
          title="Available Shifts"
          value={8}
          trend="Matching your profile"
        />
        <MetricCard
          title="Completed Shifts"
          value={15}
          trend="+3 this week"
        />
        <MetricCard
          title="Total Earned"
          value="$1,850"
          trend="+$450 this week"
        />
      </MetricsGrid>
      <AvailableShifts />
      <EarningsChart />
    </MainContent>
  </DashboardContainer>
);

export const AgencyDashboardUI = () => (
  <DashboardContainer>
    <Sidebar>
      <nav>
        <MenuItem icon={<Dashboard />} text="Overview" />
        <MenuItem icon={<People />} text="Staff Management" />
        <MenuItem icon={<Assignment />} text="Shift Management" />
        <MenuItem icon={<Payment />} text="Finance" />
        <MenuItem icon={<Assessment />} text="Analytics" />
      </nav>
    </Sidebar>
    <MainContent>
      <MetricsGrid>
        <MetricCard
          title="Active Staff"
          value={25}
          trend="+3 new this month"
        />
        <MetricCard
          title="Filled Shifts"
          value={45}
          trend="90% fill rate"
        />
        <MetricCard
          title="Revenue"
          value="$12,450"
          trend="+20% this month"
        />
      </MetricsGrid>
      <StaffManagement />
      <RevenueAnalytics />
    </MainContent>
  </DashboardContainer>
);

// Styled Components
const MetricsGrid = styled('div')({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
  gap: '1rem',
  marginBottom: '2rem',
});

const MetricCard = styled('div')(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.shadows[1],
}));

const MenuItem = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(1.5),
  marginBottom: theme.spacing(1),
  borderRadius: theme.shape.borderRadius,
  cursor: 'pointer',
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
}));

// Form Components
export const FormField = styled('div')(({ theme }) => ({
  marginBottom: theme.spacing(2),
}));

export const FormLabel = styled('label')(({ theme }) => ({
  display: 'block',
  marginBottom: theme.spacing(1),
  color: theme.palette.text.primary,
}));

export const FormInput = styled('input')(({ theme }) => ({
  width: '100%',
  padding: theme.spacing(1),
  borderRadius: theme.shape.borderRadius,
  border: `1px solid ${theme.palette.divider}`,
  '&:focus': {
    outline: 'none',
    borderColor: theme.palette.primary.main,
  },
}));

export const FormSelect = styled('select')(({ theme }) => ({
  width: '100%',
  padding: theme.spacing(1),
  borderRadius: theme.shape.borderRadius,
  border: `1px solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.background.paper,
}));

export const FormButton = styled('button')(({ theme }) => ({
  padding: theme.spacing(1, 3),
  borderRadius: theme.shape.borderRadius,
  border: 'none',
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  cursor: 'pointer',
  '&:hover': {
    backgroundColor: theme.palette.primary.dark,
  },
}));

// Theme Configuration
export const dashboardTheme = {
  palette: {
    primary: {
      main: '#1976d2',
      light: '#42a5f5',
      dark: '#1565c0',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#dc004e',
      light: '#ff4081',
      dark: '#9a0036',
      contrastText: '#ffffff',
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
  },
  shape: {
    borderRadius: 4,
  },
  shadows: [
    'none',
    '0px 2px 1px -1px rgba(0,0,0,0.2),0px 1px 1px 0px rgba(0,0,0,0.14),0px 1px 3px 0px rgba(0,0,0,0.12)',
    // Add more shadow definitions as needed
  ],
});

export {
  DashboardContainer,
  Sidebar,
  MainContent,
  MetricCard,
  MenuItem,
};