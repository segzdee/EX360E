// app/api/company/shifts/route.ts
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { validateRole } from '@/middleware/roleProtection'

export async function POST(request: Request) {
  const validation = await validateRole('company')
  if ('error' in validation) {
    return new NextResponse(validation.error, { status: validation.status })
  }

  const supabase = createRouteHandlerClient({ cookies })
  const shiftData = await request.json()

  try {
    const { data: company } = await supabase
      .from('companies')
      .select('id')
      .eq('profile_id', validation.session.user.id)
      .single()

    const { data, error } = await supabase
      .from('shifts')
      .insert({
        ...shiftData,
        company_id: company.id,
        status: 'open'
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(data)
  } catch (error) {
    return new NextResponse('Error creating shift', { status: 500 })
  }
}

// app/api/company/applications/route.ts
export async function GET() {
  const validation = await validateRole('company')
  if ('error' in validation) {
    return new NextResponse(validation.error, { status: validation.status })
  }

  const supabase = createRouteHandlerClient({ cookies })

  try {
    const { data: company } = await supabase
      .from('companies')
      .select('id')
      .eq('profile_id', validation.session.user.id)
      .single()

    const { data: applications } = await supabase
      .from('shift_applications')
      .select(`
        *,
        shift:shifts (*),
        freelancer:freelancers (
          *,
          profile:profiles (
            full_name,
            email
          )
        )
      `)
      .eq('shifts.company_id', company.id)
      .order('created_at', { ascending: false })

    return NextResponse.json(applications)
  } catch (error) {
    return new NextResponse('Error fetching applications', { status: 500 })
  }
}

// app/api/company/shifts/[id]/approve/route.ts
export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const validation = await validateRole('company')
  if ('error' in validation) {
    return new NextResponse(validation.error, { status: validation.status })
  }

  const supabase = createRouteHandlerClient({ cookies })
  const { applicationId } = await request.json()

  try {
    // Start a transaction
    const { data: application } = await supabase
      .from('shift_applications')
      .select('freelancer_id')
      .eq('id', applicationId)
      .single()

    // Create shift assignment
    const { error: assignmentError } = await supabase
      .from('shift_assignments')
      .insert({
        shift_id: params.id,
        freelancer_id: application.freelancer_id,
        status: 'assigned'
      })

    if (assignmentError) throw assignmentError

    // Update shift status
    const { error: shiftError } = await supabase
      .from('shifts')
      .update({ status: 'assigned' })
      .eq('id', params.id)

    if (shiftError) throw shiftError

    // Update application status
    const { error: applicationError } = await supabase
      .from('shift_applications')
      .update({ status: 'approved' })
      .eq('id', applicationId)

    if (applicationError) throw applicationError

    return new NextResponse('Success', { status: 200 })
  } catch (error) {
    return new NextResponse('Error approving application', { status: 500 })
  }
}

// app/api/company/performance/route.ts
export async function GET() {
  const validation = await validateRole('company')
  if ('error' in validation) {
    return new NextResponse(validation.error, { status: validation.status })
  }

  const supabase = createRouteHandlerClient({ cookies })

  try {
    const { data: company } = await supabase
      .from('companies')
      .select('id')
      .eq('profile_id', validation.session.user.id)
      .single()

    // Fetch all completed shifts
    const { data: shifts } = await supabase
      .from('shifts')
      .select(`
        *,
        shift_assignments (
          freelancer:freelancers (
            profile:profiles (
              full_name
            )
          ),
          rating,
          work_report
        )
      `)
      .eq('company_id', company.id)
      .eq('status', 'completed')

    // Calculate performance metrics
    const metrics = shifts?.reduce((acc: any, shift) => {
      const assignment = shift.shift_assignments[0]
      if (assignment) {
        acc.total_shifts++
        acc.total_ratings += assignment.rating || 0
        acc.total_cost += shift.hourly_rate * 
          ((new Date(shift.end_time).getTime() - new Date(shift.start_time).getTime()) / 3600000)
      }
      return acc
    }, {
      total_shifts: 0,
      total_ratings: 0,
      total_cost: 0
    })

    return NextResponse.json({
      ...metrics,
      average_rating: metrics.total_ratings / metrics.total_shifts || 0,
      average_cost_per_shift: metrics.total_cost / metrics.total_shifts || 0
    })
  } catch (error) {
    return new NextResponse('Error fetching performance metrics', { status: 500 })
  }
}