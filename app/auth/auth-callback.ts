// app/auth/callback/route.ts
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');

  if (code) {
    const supabase = createRouteHandlerClient({ cookies });
    
    // Exchange code for session
    await supabase.auth.exchangeCodeForSession(code);

    // Get user data to determine redirect
    const { data: { user } } = await supabase.auth.getUser();
    const role = user?.user_metadata?.role;

    // Determine redirect based on role
    let redirectPath = '/dashboard';
    if (role) {
      redirectPath = `${redirectPath}/${role.toLowerCase()}`;
    }

    return NextResponse.redirect(new URL(redirectPath, requestUrl.origin));
  }

  // Handle error case
  return NextResponse.redirect(
    new URL('/auth/login?error=auth_callback_failed', requestUrl.origin)
  );
}