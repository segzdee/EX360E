// app/api/agency/staff/route.ts
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET() {
  const supabase = createRouteHandlerClient({ cookies })
  
  const { data: { session } } = await supabase.auth.getSession()
  
  if (!session) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  try {
    const { data: recruiter } = await supabase
      .from('recruiters')
      .select('id')
      .eq('profile_id', session.user.id)
      .single()

    const { data: staff, error } = await supabase
      .from('freelancers')
      .select(`
        id,
        profile_id,
        profiles (
          full_name,
          email,
          phone
        ),
        skills,
        certifications,
        average_rating,
        total_shifts_completed,
        is_available,
        hourly_rate_range,
        background_check_status
      `)
      .eq('recruiter_id', recruiter.id)
      .order('created_at', { ascending: false })

    if (error) throw error

    return NextResponse.json(staff)
  } catch (error) {
    return new NextResponse('Error fetching staff', { status: 500 })
  }
}

export async function POST(request: Request) {
  const supabase = createRouteHandlerClient({ cookies })
  const data = await request.json()

  const { data: { session } } = await supabase.auth.getSession()
  
  if (!session) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  try {
    const { data: recruiter } = await supabase
      .from('recruiters')
      .select('id')
      .eq('profile_id', session.user.id)
      .single()

    const { data: newStaff, error } = await supabase
      .from('freelancers')
      .insert({
        ...data,
        recruiter_id: recruiter.id
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(newStaff)
  } catch (error) {
    return new NextResponse('Error adding staff', { status: 500 })
  }
}

// app/api/agency/shifts/route.ts
export async function GET() {
  const supabase = createRouteHandlerClient({ cookies })
  
  const { data: { session } } = await supabase.auth.getSession()
  
  if (!session) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  try {
    const { data: recruiter } = await supabase
      .from('recruiters')
      .select('id')
      .eq('profile_id', session.user.id)
      .single()

    const { data: shifts, error } = await supabase
      .from('shifts')
      .select(`
        id,
        title,
        description,
        start_time,
        end_time,
        hourly_rate,
        status,
        location,
        required_skills,
        companies (
          id,
          company_name
        ),
        shift_assignments (
          id,
          freelancer_id,
          freelancers (
            id,
            profiles (
              full_name
            )
          )
        )
      `)
      .eq('recruiter_id', recruiter.id)
      .order('start_time', { ascending: true })

    if (error) throw error

    return NextResponse.json(shifts)
  } catch (error) {
    return new NextResponse('Error fetching shifts', { status: 500 })
  }
}

// app/api/agency/analytics/route.ts
export async function GET() {
  const supabase = createRouteHandlerClient({ cookies })
  
  const { data: { session } } = await supabase.auth.getSession()
  
  if (!session) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  try {
    const { data: recruiter } = await supabase
      .from('recruiters')
      .select('id')
      .eq('profile_id', session.user.id)
      .single()

    // Get total staff count
    const { count: staffCount } = await supabase
      .from('freelancers')
      .select('id', { count: 'exact' })
      .eq('recruiter_id', recruiter.id)

    // Get shifts data
    const { data: shifts } = await supabase
      .from('shifts')
      .select(`
        id,
        status,
        hourly_rate,
        start_time,
        end_time
      `)
      .eq('recruiter_id', recruiter.id)

    // Calculate metrics
    const activeShifts = shifts?.filter(s => s.status === 'active').length || 0
    const completedShifts = shifts?.filter(s => s.status === 'completed').length || 0
    
    const revenue = shifts?.reduce((acc, shift) => {
      if (shift.status === 'completed') {
        const hours = (new Date(shift.end_time).getTime() - new Date(shift.start_time).getTime()) / (1000 * 60 * 60)
        return acc + (hours * shift.hourly_rate)
      }
      return acc
    }, 0) || 0

    // Get monthly data
    const monthlyData = shifts?.reduce((acc: any, shift) => {
      const month = new Date(shift.start_time).toLocaleString('default', { month: 'short' })
      if (!acc[month]) {
        acc[month] = {
          shifts: 0,
          revenue: 0
        }
      }
      acc[month].shifts++
      if (shift.status === 'completed') {
        const hours = (new Date(shift.end_time).getTime() - new Date(shift.start_time).getTime()) / (1000 * 60 * 60)
        acc[month].revenue += hours * shift.hourly_rate
      }
      return acc
    }, {})

    return NextResponse.json({
      staffCount,
      activeShifts,
      completedShifts,
      totalRevenue: revenue,
      monthlyData: Object.entries(monthlyData || {}).map(([month, data]: [string, any]) => ({
        month,
        ...data
      }))
    })
  } catch (error) {
    return new NextResponse('Error fetching analytics', { status: 500 })
  }
}

// app/api/agency/assignments/route.ts
export async function POST(request: Request) {
  const supabase = createRouteHandlerClient({ cookies })
  const { shiftId, freelancerId } = await request.json()

  const { data: { session } } = await supabase.auth.getSession()
  
  if (!session) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  try {
    const { data: assignment, error } = await supabase
      .from('shift_assignments')
      .insert({
        shift_id: shiftId,
        freelancer_id: freelancerId,
        status: 'assigned'
      })
      .select()
      .single()

    if (error) throw error

    // Update shift status
    await supabase
      .from('shifts')
      .update({ status: 'assigned' })
      .eq('id', shiftId)

    return NextResponse.json(assignment)
  } catch (error) {
    return new NextResponse('Error assigning shift', { status: 500 })
  }
}