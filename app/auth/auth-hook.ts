// hooks/useAuth.ts
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useCallback, useEffect, useState } from 'react';
import { toast } from '@/components/ui/use-toast';

export function useAuth() {
  const router = useRouter();
  const supabase = createClientComponentClient();
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);

  // Initialize auth state
  useEffect(() => {
    const initAuth = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        setUser(user);
      } catch (error) {
        console.error('Auth initialization error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    initAuth();

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase.auth]);

  // Sign in with email/password
  const signIn = useCallback(async (email: string, password: string) => {
    try {
      const { error, data } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      // Redirect based on user role
      const role = data.user?.user_metadata?.role;
      router.push(getUserDashboardPath(role));
      
      return { success: true };
    } catch (error) {
      toast({
        title: "Login failed",
        description: error.message,
        variant: "destructive"
      });
      return { success: false, error };
    }
  }, [router, supabase.auth]);

  // Sign in with Google
  const signInWithGoogle = useCallback(async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });

      if (error) throw error;
    } catch (error) {
      toast({
        title: "Google login failed",
        description: error.message,
        variant: "destructive"
      });
    }
  }, [supabase.auth]);

  // Sign out
  const signOut = useCallback(async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      router.push('/auth/login');
      toast({
        title: "Signed out successfully",
        description: "You have been logged out of your account."
      });
    } catch (error) {
      toast({
        title: "Sign out failed",
        description: error.message,
        variant: "destructive"
      });
    }
  }, [router, supabase.auth]);

  // Helper function to get dashboard path based on user role
  const getUserDashboardPath = (role: string) => {
    switch (role?.toLowerCase()) {
      case 'company':
        return '/dashboard/company';
      case 'agency':
        return '/dashboard/agency';
      case 'staff':
        return '/dashboard/staff';
      default:
        return '/dashboard';
    }
  };

  return {
    user,
    isLoading,
    signIn,
    signInWithGoogle,
    signOut,
    getUserDashboardPath
  };
}

// Types for auth state
export interface AuthUser {
  id: string;
  email?: string;
  user_metadata?: {
    role?: string;
    full_name?: string;
  };
}