// src/middleware/auth.ts
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { Database } from '@/types/supabase'

// Define public routes that don't require authentication
const publicRoutes = [
  '/auth/login',
  '/auth/register',
  '/auth/forgot-password',
  '/auth/reset-password',
]

export async function authMiddleware(req: NextRequest) {
  try {
    const res = NextResponse.next()
    const supabase = createMiddlewareClient<Database>({ req, res })
    
    // Refresh session if exists
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()
    
    if (sessionError) {
      console.error('Session error:', sessionError)
      return redirectToLogin(req)
    }

    // Allow access to public routes
    if (publicRoutes.some(route => req.nextUrl.pathname.startsWith(route))) {
      return res
    }

    // Check session existence
    if (!session) {
      return redirectToLogin(req)
    }

    // Add user info to headers for downstream use
    res.headers.set('x-user-id', session.user.id)
    res.headers.set('x-user-role', session.user.user_metadata.role)

    return res
  } catch (error) {
    console.error('Auth middleware error:', error)
    return redirectToLogin(req)
  }
}

function redirectToLogin(req: NextRequest) {
  const redirectUrl = req.nextUrl.pathname
  const loginUrl = new URL('/auth/login', req.url)
  loginUrl.searchParams.set('redirectUrl', redirectUrl)
  return NextResponse.redirect(loginUrl)
}