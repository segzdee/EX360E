import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import type { Database } from '@/lib/supabase/database.types'

export async function GET(
  request: Request,
  { params }: { params: { userType: string } }
) {
  try {
    const supabase = createRouteHandlerClient<Database>({ cookies })
    const { userType } = params

    const { data: { session }, error: authError } = await supabase.auth.getSession()
    if (authError || !session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const metrics = await getDashboardMetrics(supabase, userType, session.user.id)
    return NextResponse.json(metrics)
  } catch (error) {
    console.error('Dashboard API Error:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
} 