// middleware.ts
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Auth check
  if (!session && req.nextUrl.pathname.startsWith('/dashboard')) {
    const redirectUrl = req.nextUrl.clone()
    redirectUrl.pathname = '/auth/login'
    redirectUrl.searchParams.set(`redirectedFrom`, req.nextUrl.pathname)
    return NextResponse.redirect(redirectUrl)
  }

  // Role-based access
  if (session) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single()

    // Redirect to appropriate dashboard
    if (profile?.role && req.nextUrl.pathname === '/dashboard') {
      const redirectUrl = req.nextUrl.clone()
      redirectUrl.pathname = `/dashboard/${profile.role}`
      return NextResponse.redirect(redirectUrl)
    }

    // Check role-specific access
    if (req.nextUrl.pathname.startsWith('/dashboard/company') && profile?.role !== 'company') {
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }
    if (req.nextUrl.pathname.startsWith('/dashboard/recruiter') && profile?.role !== 'recruiter') {
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }
    if (req.nextUrl.pathname.startsWith('/dashboard/freelancer') && profile?.role !== 'freelancer') {
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }
  }

  return res
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/shifts/:path*',
    '/profile/:path*',
    '/api/:path*',
  ],
}