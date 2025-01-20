import React, { useEffect, useState } from 'react';
import { 
  Home,
  Users,
  Briefcase,
  Calendar,
  TrendingUp,
  Settings,
  LogOut,
  Menu,
  Bell,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from '@/components/ui/alert';

// Session timeout in minutes
const SESSION_TIMEOUT = 30;
const WARNING_BEFORE_TIMEOUT = 5;

// Define navigation items for each role
const navigationConfig = {
  company: [
    { label: 'Dashboard', icon: Home, href: '/company' },
    { label: 'Staff', icon: Users, href: '/company/staff' },
    { label: 'Jobs', icon: Briefcase, href: '/company/jobs' },
    { label: 'Schedule', icon: Calendar, href: '/company/schedule' },
    { label: 'Analytics', icon: TrendingUp, href: '/company/analytics' },
  ],
  agency: [
    { label: 'Dashboard', icon: Home, href: '/agency' },
    { label: 'Staff', icon: Users, href: '/agency/staff' },
    { label: 'Jobs', icon: Briefcase, href: '/agency/jobs' },
    { label: 'Placements', icon: Calendar, href: '/agency/placements' },
    { label: 'Analytics', icon: TrendingUp, href: '/agency/analytics' },
  ],
  staff: [
    { label: 'Dashboard', icon: Home, href: '/staff' },
    { label: 'Jobs', icon: Briefcase, href: '/staff/jobs' },
    { label: 'Schedule', icon: Calendar, href: '/staff/schedule' },
    { label: 'Profile', icon: Users, href: '/staff/profile' },
  ],
};

interface DashboardLayoutProps {
  children: React.ReactNode;
  userRole?: 'company' | 'agency' | 'staff';
  userName?: string;
  onSignOut?: () => void;
}

export default function DashboardLayout({ 
  children, 
  userRole = 'staff',
  userName = 'User',
  onSignOut 
}: DashboardLayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showTimeoutWarning, setShowTimeoutWarning] = useState(false);
  const [lastActivity, setLastActivity] = useState(new Date());

  // Handle session timeout
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    let warningId: NodeJS.Timeout;

    const resetTimers = () => {
      setLastActivity(new Date());
      clearTimeout(timeoutId);
      clearTimeout(warningId);

      warningId = setTimeout(() => {
        setShowTimeoutWarning(true);
      }, (SESSION_TIMEOUT - WARNING_BEFORE_TIMEOUT) * 60 * 1000);

      timeoutId = setTimeout(() => {
        handleSignOut();
      }, SESSION_TIMEOUT * 60 * 1000);
    };

    const handleActivity = () => resetTimers();

    // Set up activity listeners
    const events = ['mousedown', 'keydown', 'scroll', 'mousemove'];
    events.forEach(event => {
      document.addEventListener(event, handleActivity);
    });

    resetTimers();

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, handleActivity);
      });
      clearTimeout(timeoutId);
      clearTimeout(warningId);
    };
  }, []);

  const handleSignOut = () => {
    if (onSignOut) {
      onSignOut();
    } else {
      // Default sign out behavior
      window.location.href = '/auth/login';
    }
  };

  const navigation = navigationConfig[userRole] || [];

  const NavLink = ({ item }: { item: typeof navigation[0] }) => {
    const Icon = item.icon;
    return (
      <Button
        variant="ghost"
        className="w-full justify-start"
        onClick={() => window.location.href = item.href}
      >
        <Icon className="mr-2 h-4 w-4" />
        {item.label}
      </Button>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="px-4 h-16 flex items-center justify-between">
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              size="icon"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X /> : <Menu />}
            </Button>
            <h1 className="text-xl font-bold">ExtraStaff360</h1>
          </div>

          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Users className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>{userName}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => window.location.href = `/${userRole}/settings`}>
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleSignOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className={`
          fixed md:static inset-y-0 left-0 z-50
          w-64 bg-white border-r transform transition-transform duration-200
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}>
          <div className="h-full flex flex-col p-4">
            <nav className="space-y-1 flex-1">
              {navigation.map((item) => (
                <NavLink key={item.href} item={item} />
              ))}
            </nav>
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={() => window.location.href = `/${userRole}/settings`}
            >
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-4">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>

      {/* Session Timeout Warning */}
      <Dialog open={showTimeoutWarning} onOpenChange={setShowTimeoutWarning}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Session Timeout Warning</DialogTitle>
            <DialogDescription>
              Your session will expire in {WARNING_BEFORE_TIMEOUT} minutes due to inactivity.
              Would you like to stay logged in?
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end space-x-4 mt-4">
            <Button variant="outline" onClick={handleSignOut}>
              Logout
            </Button>
            <Button onClick={() => {
              setShowTimeoutWarning(false);
              setLastActivity(new Date());
            }}>
              Stay Logged In
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </div>
  );
}