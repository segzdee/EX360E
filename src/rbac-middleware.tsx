// src/middleware/rbac.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

type UserRole = 'ADMIN' | 'COMPANY' | 'AGENCY' | 'STAFF';

interface RoutePermission {
  roles: UserRole[];
  subpaths?: boolean; // Whether to allow access to subpaths
}

// Define route permissions for different user roles
const routePermissions: Record<string, RoutePermission> = {
  '/admin': {
    roles: ['ADMIN'],
    subpaths: true,
  },
  '/company': {
    roles: ['ADMIN', 'COMPANY'],
    subpaths: true,
  },
  '/agency': {
    roles: ['ADMIN', 'AGENCY'],
    subpaths: true,
  },
  '/staff': {
    roles: ['ADMIN', 'STAFF'],
    subpaths: true,
  },
  '/profile': {
    roles: ['ADMIN', 'COMPANY', 'AGENCY', 'STAFF'],
    subpaths: true,
  },
}

export async function rbacMiddleware(req: NextRequest) {
  try {
    const userRole = req.headers.get('x-user-role') as UserRole
    const path = req.nextUrl.pathname

    if (!userRole) {
      console.error('No user role found in request')
      return unauthorized(req)
    }

    // Check if user has permission to access the route
    if (!hasPermission(path, userRole)) {
      console.warn(`User with role ${userRole} attempted to access unauthorized path: ${path}`)
      return unauthorized(req)
    }

    return NextResponse.next()
  } catch (error) {
    console.error('RBAC middleware error:', error)
    return unauthorized(req)
  }
}

function hasPermission(path: string, userRole: UserRole): boolean {
  // Check exact path match first
  if (routePermissions[path]?.roles.includes(userRole)) {
    return true
  }

  // Check parent paths with subpath permissions
  for (const [route, permission] of Object.entries(routePermissions)) {
    if (permission.subpaths && path.startsWith(route)) {
      if (permission.roles.includes(userRole)) {
        return true
      }
    }
  }

  return false
}

function unauthorized(req: NextRequest) {
  // Store the attempted URL for potential redirection after authentication
  const redirectUrl = new URL('/unauthorized', req.url)
  redirectUrl.searchParams.set('from', req.nextUrl.pathname)
  return NextResponse.redirect(redirectUrl)
}