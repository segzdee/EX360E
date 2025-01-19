// components/Sidebar.tsx
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  Home,
  Users,
  Briefcase,
  Calendar,
  TrendingUp,
  Settings,
  Clock,
  FileText,
  Building2,
  CreditCard,
  MessageSquare,
} from 'lucide-react';
import type { RolePermission } from '@/components/layouts/DashboardLayout';

interface NavItemProps {
  href: string;
  icon: React.ElementType;
  label: string;
  isActive: boolean;
}

const NavItem = ({ href, icon: Icon, label, isActive }: NavItemProps) => (
  <Link
    href={href}
    className={cn(
      "flex items-center gap-3 rounded-lg px-3 py-2 transition-colors",
      isActive 
        ? "bg-primary text-primary-foreground" 
        : "hover:bg-primary/10 text-muted-foreground"
    )}
  >
    <Icon className="h-4 w-4" />
    <span>{label}</span>
  </Link>
);

// Role-specific navigation configurations
const navigationConfig = {
  company: [
    { 
      label: 'Overview',
      icon: Home,
      href: '/dashboard/company',
      permission: 'view_analytics'
    },
    {
      label: 'Staff Directory',
      icon: Users,
      href: '/dashboard/company/staff',
      permission: 'view_staff'
    },
    {
      label: 'Job Posts',
      icon: Briefcase,
      href: '/dashboard/company/jobs',
      permission: 'create_job'
    },
    {
      label: 'Bookings',
      icon: Calendar,
      href: '/dashboard/company/bookings',
      permission: 'manage_bookings'
    },
    {
      label: 'Analytics',
      icon: TrendingUp,
      href: '/dashboard/company/analytics',
      permission: 'view_analytics'
    },
  ],
  agency: [
    {
      label: 'Overview',
      icon: Home,
      href: '/dashboard/agency',
      permission: 'view_analytics'
    },
    {
      label: 'Staff Management',
      icon: Users,
      href: '/dashboard/agency/staff',
      permission: 'manage_staff'
    },
    {
      label: 'Available Jobs',
      icon: Briefcase,
      href: '/dashboard/agency/jobs',
      permission: 'view_jobs'
    },
    {
      label: 'Placements',
      icon: Calendar,
      href: '/dashboard/agency/placements',
      permission: 'manage_placements'
    },
    {
      label: 'Performance',
      icon: TrendingUp,
      href: '/dashboard/agency/performance',
      permission: 'view_analytics'
    },
  ],
  staff: [
    {
      label: 'Overview',
      icon: Home,
      href: '/dashboard/staff',
      permission: 'view_schedule'
    },
    {
      label: 'Available Jobs',
      icon: Briefcase,
      href: '/dashboard/staff/jobs',
      permission: 'view_jobs'
    },
    {
      label: 'Schedule',
      icon: Calendar,
      href: '/dashboard/staff/schedule',
      permission: 'view_schedule'
    },
    {
      label: 'Availability',
      icon: Clock,
      href: '/dashboard/staff/availability',
      permission: 'update_availability'
    },
    {
      label: 'Profile',
      icon: FileText,
      href: '/dashboard/staff/profile',
      permission: 'manage_profile'
    },
  ],
  admin: [
    {
      label: 'Overview',
      icon: Home,
      href: '/dashboard/admin',
      permission: 'view_all'
    },
    {
      label: 'Users',
      icon: Users,
      href: '/dashboard/admin/users',
      permission: 'manage_users'
    },
    {
      label: 'Companies',
      icon: Building2,
      href: '/dashboard/admin/companies',
      permission: 'manage_users'
    },
    {
      label: 'Billing',
      icon: CreditCard,
      href: '/dashboard/admin/billing',
      permission: 'manage_system'
    },
    {
      label: 'Support',
      icon: MessageSquare,
      href: '/dashboard/admin/support',
      permission: 'manage_system'
    },
  ],
};

interface SidebarProps {
  role: string;
  permissions: RolePermission[];
}

export function Sidebar({ role, permissions }: SidebarProps) {
  const pathname = usePathname();
  const navigation = navigationConfig[role as keyof typeof navigationConfig] || [];

  // Filter navigation items based on permissions
  const authorizedNavigation = navigation.filter(
    item => permissions.includes(item.permission as RolePermission)
  );

  return (
    <div className="w-64 bg-white border-r flex flex-col">
      <div className="flex-1 py-4">
        <nav className="space-y-1 px-2">
          {authorizedNavigation.map((item) => (
            <NavItem
              key={item.href}
              href={item.href}
              icon={item.icon}
              label={item.label}
              isActive={pathname === item.href}
            />
          ))}
        </nav>
      </div>

      {/* Bottom section with settings */}
      <div className="p-4 border-t">
        <NavItem
          href={`/dashboard/${role}/settings`}
          icon={Settings}
          label="Settings"
          isActive={pathname === `/dashboard/${role}/settings`}
        />
      </div>
    </div>
  );
}