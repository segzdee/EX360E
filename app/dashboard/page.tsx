'use client'

import React from 'react'
import { DashboardLayout } from '@/components/dashboard-layout'
import { CompanyDashboard } from '@/components/company-dashboard'
import { AgencyDashboard } from '@/components/agency-dashboard'
import { StaffDashboard } from '@/components/staff-dashboard'
import { Briefcase, Users, FileText, Settings, Home, Calendar, DollarSign, BookOpen } from 'lucide-react'

const userTypeNavItems = {
  company: [
    { href: '/dashboard', label: 'Overview', icon: <Home className="h-4 w-4" /> },
    { href: '/dashboard/shifts', label: 'Shifts', icon: <Briefcase className="h-4 w-4" /> },
    { href: '/dashboard/staff', label: 'Staff', icon: <Users className="h-4 w-4" /> },
    { href: '/dashboard/reports', label: 'Reports', icon: <FileText className="h-4 w-4" /> },
    { href: '/dashboard/settings', label: 'Settings', icon: <Settings className="h-4 w-4" /> },
  ],
  agency: [
    { href: '/dashboard', label: 'Overview', icon: <Home className="h-4 w-4" /> },
    { href: '/dashboard/staff', label: 'Staff', icon: <Users className="h-4 w-4" /> },
    { href: '/dashboard/shifts', label: 'Shifts', icon: <Briefcase className="h-4 w-4" /> },
    { href: '/dashboard/clients', label: 'Clients', icon: <Users className="h-4 w-4" /> },
    { href: '/dashboard/reports', label: 'Reports', icon: <FileText className="h-4 w-4" /> },
    { href: '/dashboard/settings', label: 'Settings', icon: <Settings className="h-4 w-4" /> },
  ],
  staff: [
    { href: '/dashboard', label: 'Overview', icon: <Home className="h-4 w-4" /> },
    { href: '/dashboard/shifts', label: 'My Shifts', icon: <Briefcase className="h-4 w-4" /> },
    { href: '/dashboard/availability', label: 'Availability', icon: <Calendar className="h-4 w-4" /> },
    { href: '/dashboard/payments', label: 'Payments', icon: <DollarSign className="h-4 w-4" /> },
    { href: '/dashboard/training', label: 'Training', icon: <BookOpen className="h-4 w-4" /> },
    { href: '/dashboard/settings', label: 'Settings', icon: <Settings className="h-4 w-4" /> },
  ],
}

export default function Dashboard() {
  // In a real application, you would fetch the user type and specific type from an API or context
  const [userType, setUserType] = React.useState<'company' | 'agency' | 'staff'>('company')
  const [specificType, setSpecificType] = React.useState<string>('Full-Service Hotel')

  const renderDashboard = () => {
    switch (userType) {
      case 'company':
        return <CompanyDashboard companyType={specificType} />
      case 'agency':
        return <AgencyDashboard agencyType={specificType} />
      case 'staff':
        return <StaffDashboard staffType={specificType} />
      default:
        return <div>Invalid user type</div>
    }
  }

  return (
    <DashboardLayout navItems={userTypeNavItems[userType]} userType={userType}>
      {renderDashboard()}
    </DashboardLayout>
  )
}

