// components/layouts/DashboardLayout.tsx
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AuthHeader } from '@/components/AuthHeader';
import { Sidebar } from '@/components/Sidebar';
import { useAuth } from '@/hooks/useAuth';
import { Loader2 } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';

// Define allowed permissions for each role
export const rolePermissions = {
  company: ['view_staff', 'create_job', 'manage_bookings', 'view_analytics'],
  agency: ['manage_staff', 'view_jobs', 'manage_placements', 'view_analytics'],
  staff: ['view_jobs', 'manage_profile', 'view_schedule', 'update_availability'],
  admin: ['manage_users', 'manage_roles', 'view_all', 'manage_system']
} as const;

// Type for role permissions
export type RolePermission = typeof rolePermissions[keyof typeof rolePermissions][number];

// Session timeout in minutes
const SESSION_TIMEOUT = 30;
const WARNING_BEFORE_TIMEOUT = 5;

interface DashboardLayoutProps {
  children: React.ReactNode;
  requiredPermissions?: RolePermission[];
}

export function DashboardLayout({ 
  children,
  requiredPermissions = [] 
}: DashboardLayoutProps) {
  const { user, isLoading, signOut } = useAuth();
  const router = useRouter();
  const [showTimeoutWarning, setShowTimeoutWarning] = React.useState(false);
  const [timeoutTimer, setTimeoutTimer] = React.useState<NodeJS.Timeout | null>(null);
  const [warningTimer, setWarningTimer] = React.useState<NodeJS.Timeout | null>(null);
  const [lastActivity, setLastActivity] = React.useState<Date>(new Date());

  // Check user permissions
  const userRole = user?.user_metadata?.role?.toLowerCase() || '';
  const userPermissions = rolePermissions[userRole as keyof typeof rolePermissions] || [];
  const hasRequiredPermissions = requiredPermissions.every(
    permission => userPermissions.includes(permission)
  );

  // Handle session timeout
  useEffect(() => {
    const resetTimers = () => {
      setLastActivity(new Date());
      
      // Clear existing timers
      if (timeoutTimer) clearTimeout(timeoutTimer);
      if (warningTimer) clearTimeout(warningTimer);

      // Set new warning timer
      const newWarningTimer = setTimeout(() => {
        setShowTimeoutWarning(true);
      }, (SESSION_TIMEOUT - WARNING_BEFORE_TIMEOUT) * 60 * 1000);

      // Set new timeout timer
      const newTimeoutTimer = setTimeout(() => {
        signOut();
        toast({
          title: "Session expired",
          description: "You have been logged out due to inactivity.",
          variant: "destructive"
        });
      }, SESSION_TIMEOUT * 60 * 1000);

      setWarningTimer(newWarningTimer);
      setTimeoutTimer(newTimeoutTimer);
    };

    // Reset timers on mount and user activity
    resetTimers();

    // Activity listeners
    const activityEvents = ['mousedown', 'keydown', 'scroll', 'mousemove'];
    const handleActivity = () => resetTimers();
    
    activityEvents.forEach(event => {
      document.addEventListener(event, handleActivity);
    });

    return () => {
      if (timeoutTimer) clearTimeout(timeoutTimer);
      if (warningTimer) clearTimeout(warningTimer);
      
      activityEvents.forEach(event => {
        document.removeEventListener(event, handleActivity);
      });
    };
  }, [signOut]);

  // Loading state
  if (isLoading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  // Auth check
  if (!user) {
    router.push('/auth/login');
    return null;
  }

  // Permission check
  if (!hasRequiredPermissions) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
          <p className="text-gray-600 mb-4">
            You don't have permission to access this page.
          </p>
          <Button onClick={() => router.back()}>Go Back</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <Sidebar role={userRole} permissions={userPermissions} />

      <div className="flex-1 flex flex-col">
        {/* Header */}
        <AuthHeader />

        {/* Main Content */}
        <main className="flex-1 p-6 bg-gray-50">{children}</main>
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
            <Button variant="outline" onClick={() => signOut()}>
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
    </div>
  );
}