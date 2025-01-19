import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const supabase = createRouteHandlerClient({ cookies })
  const { searchParams } = new URL(request.url)
  const jobId = searchParams.get('jobId')
  const applicantId = searchParams.get('applicantId')

  let query = supabase.from('applications').select('*')

  if (jobId) {
    query = query.eq('job_id', jobId)
  }

  if (applicantId) {
    query = query.eq('applicant_id', applicantId)
  }

  const { data: applications, error } = await query

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(applications)
}

export async function POST(request: Request) {
  const supabase = createRouteHandlerClient({ cookies })
  const { job_id, applicant_id, cover_letter } = await request.json()

  const { data, error } = await supabase
    .from('applications')
    .insert({ job_id, applicant_id, cover_letter, status: 'pending' })
    .select()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}

