// middleware.ts
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();
  const supabase = createMiddlewareClient({ req: request, res: response });
  
  // Refresh session if exists
  const { data: { session }, error } = await supabase.auth.getSession();

  // Handle protected routes
  const isAuthPage = request.nextUrl.pathname.startsWith('/auth');
  const isDashboardPage = request.nextUrl.pathname.startsWith('/dashboard');

  if (isDashboardPage && !session) {
    // Redirect to login if trying to access dashboard without auth
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  if (isAuthPage && session) {
    // Redirect to appropriate dashboard if already authenticated
    const role = session.user?.user_metadata?.role?.toLowerCase() || '';
    const dashboardPath = `/dashboard${role ? `/${role}` : ''}`;
    return NextResponse.redirect(new URL(dashboardPath, request.url));
  }

  return response;
}

export const config = {
  matcher: ['/dashboard/:path*', '/auth/:path*'],
};