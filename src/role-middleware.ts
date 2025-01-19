// middleware/roleProtection.ts
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function validateRole(role: 'company' | 'freelancer' | 'recruiter') {
  const supabase = createRouteHandlerClient({ cookies })
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    return { error: 'Unauthorized', status: 401 }
  }

  // Check user's role
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', session.user.id)
    .single()

  if (!profile || profile.role !== role) {
    return { error: 'Forbidden - Invalid role', status: 403 }
  }

  return { session, profile }
}

// Example usage in API route:
/*
export async function GET() {
  const validation = await validateRole('company')
  if ('error' in validation) {
    return new NextResponse(validation.error, { status: validation.status })
  }
  // Continue with route logic...
}
*/