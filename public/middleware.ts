import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(request: NextRequest) {
  // Check if we're on the admin subdomain
  const hostname = request.headers.get('host') || ''
  const isAdminSubdomain = hostname.startsWith('admin.')
  
  if (!isAdminSubdomain) {
    return NextResponse.redirect(new URL('https://admin.extrastaff360.com'))
  }

  // Verify super admin authentication
  const token = await getToken({ req: request })
  
  if (!token || token.userRole !== 'SUPER_ADMIN') {
    return NextResponse.redirect(new URL('/auth/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}

