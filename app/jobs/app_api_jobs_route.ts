import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const supabase = createRouteHandlerClient({ cookies })
  const { searchParams } = new URL(request.url)
  const query = searchParams.get('query')

  let jobsQuery = supabase.from('jobs').select('*')

  if (query) {
    jobsQuery = jobsQuery.or(`title.ilike.%${query}%,description.ilike.%${query}%`)
  }

  const { data: jobs, error } = await jobsQuery

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(jobs)
}

export async function POST(request: Request) {
  const supabase = createRouteHandlerClient({ cookies })
  const { title, description, location, salary_range, job_type, company_id } = await request.json()

  const { data, error } = await supabase
    .from('jobs')
    .insert({ title, description, location, salary_range, job_type, company_id })
    .select()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}

