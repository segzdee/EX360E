import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import type { Database } from '@/lib/database.types'

export async function updateSession(request: NextRequest) {
  try {
    const res = NextResponse.next()
    const supabase = createMiddlewareClient<Database>({ req: request, res })
    await supabase.auth.getSession()
    return res
  } catch (e) {
    console.error('Error in updateSession:', e)
    return NextResponse.next()
  }
}
