// app/api/staff/available-shifts/route.ts
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { validateRole } from '@/middleware/roleProtection'

export async function GET() {
  const validation = await validateRole('freelancer')
  if ('error' in validation) {
    return new NextResponse(validation.error, { status: validation.status })
  }

  const supabase = createRouteHandlerClient({ cookies })

  try {
    // Get freelancer's skills and preferences
    const { data: freelancer } = await supabase
      .from('freelancers')
      .select('skills, preferred_locations, hourly_rate_range')
      .eq('profile_id', validation.session.user.id)
      .single()

    // Find matching shifts
    const { data: shifts } = await supabase
      .from('shifts')
      .select(`
        *,
        companies (
          company_name,
          location
        )
      `)
      .eq('status', 'open')
      .containedBy('required_skills', freelancer.skills)
      .gte('hourly_rate', freelancer.hourly_rate_range.min)
      .lte('hourly_rate', freelancer.hourly_rate_range.max)
      .order('created_at', { ascending: false })

    return NextResponse.json(shifts)
  } catch (error) {
    return new NextResponse('Error fetching shifts', { status: 500 })
  }
}

// app/api/staff/applications/route.ts
export async function POST(request: Request) {
  const validation = await validateRole('freelancer')
  if ('error' in validation) {
    return new NextResponse(validation.error, { status: validation.status })
  }

  const supabase = createRouteHandlerClient({ cookies })
  const { shiftId } = await request.json()

  try {
    const { data: freelancer } = await supabase
      .from('freelancers')
      .select('id')
      .eq('profile_id', validation.session.user.id)
      .single()

    const { data, error } = await supabase
      .from('shift_applications')
      .insert({
        shift_id: shiftId,
        freelancer_id: freelancer.id,
        status: 'pending'
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(data)
  } catch (error) {
    return new NextResponse('Error applying for shift', { status: 500 })
  }
}

// app/api/staff/shifts/route.ts
export async function GET() {
  const validation = await validateRole('freelancer')
  if ('error' in validation) {
    return new NextResponse(validation.error, { status: validation.status })
  }

  const supabase = createRouteHandlerClient({ cookies })

  try {
    const { data: freelancer } = await supabase
      .from('freelancers')
      .select('id')
      .eq('profile_id', validation.session.user.id)
      .single()

    const { data: assignments } = await supabase
      .from('shift_assignments')
      .select(`
        *,
        shift:shifts (
          *,
          companies (
            company_name,
            location
          )
        )
      `)
      .eq('freelancer_id', freelancer.id)
      .order('created_at', { ascending: false })

    return NextResponse.json(assignments)
  } catch (error) {
    return new NextResponse('Error fetching shifts', { status: 500 })
  }
}

// app/api/staff/availability/route.ts
export async function POST(request: Request) {
  const validation = await validateRole('freelancer')
  if ('error' in validation) {
    return new NextResponse(validation.error, { status: validation.status })
  }

  const supabase = createRouteHandlerClient({ cookies })
  const { availability } = await request.json()

  try {
    const { data, error } = await supabase
      .from('freelancer_availability')
      .upsert({
        freelancer_id: validation.session.user.id,
        ...availability
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(data)
  } catch (error) {
    return new NextResponse('Error updating availability', { status: 500 })
  }
}