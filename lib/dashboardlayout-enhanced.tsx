import React, { useEffect, useState } from 'react';
import { 
  Home, Users, Briefcase, Calendar, TrendingUp,
  Settings, LogOut, Menu, Bell, X, Search,
  ChevronDown, LayoutDashboard, UserCircle, HelpCircle,
  Mail, AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';

interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
}

interface LayoutConfig {
  showSearch?: boolean;
  showNotifications?: boolean;
  showHelp?: boolean;
  showBreadcrumbs?: boolean;
  compactSidebar?: boolean;
  stickyHeader?: boolean;
  theme?: 'light' | 'dark';
  customColors?: ThemeColors;
}

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  timestamp: Date;
}

interface DashboardLayoutProps {
  children: React.ReactNode;
  userRole?: 'company' | 'agency' | 'staff';
  userName?: string;
  userEmail?: string;
  userAvatar?: string;
  onSignOut?: () => void;
  config?: LayoutConfig;
  notifications?: Notification[];
  breadcrumbs?: { label: string; href: string }[];
  onSearch?: (query: string) => void;
}

const defaultConfig: LayoutConfig = {
  showSearch: true,
  showNotifications: true,
  showHelp: true,
  showBreadcrumbs: true,
  compactSidebar: false,
  stickyHeader: true,
  theme: 'light',
};

export default function DashboardLayout({
  children,
  userRole = 'staff',
  userName = 'User',
  userEmail,
  userAvatar,
  onSignOut,
  config = defaultConfig,
  notifications = [],
  breadcrumbs = [],
  onSearch,
}: DashboardLayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [unreadNotifications, setUnreadNotifications] = useState<Notification[]>(notifications);
  const [showNotificationsDialog, setShowNotificationsDialog] = useState(false);

  // Merge provided config with defaults
  const layoutConfig = { ...defaultConfig, ...config };

  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchQuery);
    }
  };

  // Handle notification click
  const handleNotificationClick = (notification: Notification) => {
    setUnreadNotifications(prev => 
      prev.filter(n => n.id !== notification.id)
    );
  };

  return (
    <div className={`min-h-screen ${layoutConfig.theme === 'dark' ? 'dark' : ''}`}>
      {/* Header */}
      <header className={`bg-white border-b ${layoutConfig.stickyHeader ? 'sticky top-0 z-50' : ''}`}>
        <div className="px-4 h-16 flex items-center justify-between">
          {/* Left section */}
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              size="icon"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X /> : <Menu />}
            </Button>
            
            <h1 className="text-xl font-bold">ExtraStaff360</h1>

            {/* Search */}
            {layoutConfig.showSearch && (
              <form onSubmit={handleSearch} className="hidden md:block">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                  <Input
                    type="search"
                    placeholder="Search..."
                    className="pl-8 w-64"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </form>
            )}
          </div>

          {/* Right section */}
          <div className="flex items-center space-x-4">
            {layoutConfig.showHelp && (
              <Button variant="ghost" size="icon">
                <HelpCircle className="h-5 w-5" />
              </Button>
            )}

            {layoutConfig.showNotifications && (
              <div className="relative">
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => setShowNotificationsDialog(true)}
                >
                  <Bell className="h-5 w-5" />
                  {unreadNotifications.length > 0 && (
                    <Badge 
                      variant="destructive" 
                      className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0"
                    >
                      {unreadNotifications.length}
                    </Badge>
                  )}
                </Button>
              </div>
            )}

            {/* User menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center space-x-2">
                  {userAvatar ? (
                    <img 
                      src={userAvatar} 
                      alt={userName}
                      className="h-8 w-8 rounded-full"
                    />
                  ) : (
                    <UserCircle className="h-8 w-8" />
                  )}
                  <div className="hidden md:block text-left">
                    <div className="font-medium">{userName}</div>
                    {userEmail && (
                      <div className="text-xs text-gray-500">{userEmail}</div>
                    )}
                  </div>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <UserCircle className="mr-2 h-4 w-4" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Mail className="mr-2 h-4 w-4" />
                  Messages
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={onSignOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Breadcrumbs */}
        {layoutConfig.showBreadcrumbs && breadcrumbs.length > 0 && (
          <div className="px-4 py-2 bg-gray-50 border-b">
            <nav className="flex space-x-2 text-sm">
              {breadcrumbs.map((crumb, index) => (
                <React.Fragment key={crumb.href}>
                  {index > 0 && <span className="text-gray-400">/</span>}
                  <Button
                    variant="link"
                    className="p-0 h-auto font-normal"
                    onClick={() => window.location.href = crumb.href}
                  >
                    {crumb.label}
                  </Button>
                </React.Fragment>
              ))}
            </nav>
          </div>
        )}
      </header>

      {/* Main layout */}
      <div className="flex">
        {/* Sidebar */}
        <aside className={`
          fixed md:static inset-y-0 left-0 z-40
          ${layoutConfig.compactSidebar ? 'w-20' : 'w-64'} 
          bg-white border-r transform transition-all duration-200
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}>
          <div className="h-full flex flex-col p-4">
            <nav className="flex-1 space-y-1">
              {/* Navigation items here */}
            </nav>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 p-4">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>

      {/* Notifications Dialog */}
      <Dialog open={showNotificationsDialog} onOpenChange={setShowNotificationsDialog}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Notifications</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 max-h-[60vh] overflow-auto">
            {notifications.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No notifications
              </div>
            ) : (
              notifications.map((notification) => (
                <Alert 
                  key={notification.id}
                  variant={notification.type === 'error' ? 'destructive' : 'default'}
                  className="cursor-pointer hover:bg-gray-50"
                  onClick={() => handleNotificationClick(notification)}
                >
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>{notification.title}</AlertTitle>
                  <AlertDescription>
                    {notification.message}
                    <div className="text-xs text-gray-500 mt-1">
                      {notification.timestamp.toLocaleString()}
                    </div>
                  </AlertDescription>
                </Alert>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Mobile menu overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </div>
  );
}