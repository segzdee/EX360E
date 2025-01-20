'use client'

import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Database } from '@/types/supabase'
import Link from 'next/link'

type Job = Database['public']['Tables']['jobs']['Row']
type Application = Database['public']['Tables']['applications']['Row']

type ActivityItem = (Job | Application) & { type: 'job' | 'application' }

type Props = {
  userType: Database['public']['Tables']['profiles']['Row']['user_type']
  userId: string
}

export default function RecentActivity({ userType, userId }: Props) {
  const [activities, setActivities] = useState<ActivityItem[]>([])
  const supabase = createClientComponentClient<Database>()

  useEffect(() => {
    const fetchActivities = async () => {
      let jobsQuery = supabase
        .from('jobs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5)

      let applicationsQuery = supabase
        .from('applications')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5)

      if (userType === 'company') {
        jobsQuery = jobsQuery.eq('company_id', userId)
        applicationsQuery = applicationsQuery.eq('company_id', userId)
      } else if (userType === 'staff') {
        applicationsQuery = applicationsQuery.eq('applicant_id', userId)
      }

      const [{ data: jobs, error: jobsError }, { data: applications, error: applicationsError }] = await Promise.all([
        jobsQuery,
        applicationsQuery
      ])

      if (jobsError) console.error('Error fetching jobs:', jobsError)
      if (applicationsError) console.error('Error fetching applications:', applicationsError)

      const combinedActivities = [
        ...(jobs?.map(job => ({ ...job, type: 'job' as const })) || []),
        ...(applications?.map(app => ({ ...app, type: 'application' as const })) || [])
      ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

      setActivities(combinedActivities.slice(0, 5))
    }

    fetchActivities()
  }, [supabase, userType, userId])

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
      <ul className="space-y-4">
        {activities.map((activity) => (
          <li key={`${activity.type}-${activity.id}`} className="border-b pb-2">
            {activity.type === 'job' ? (
              <Link href={`/jobs/${activity.id}`} className="hover:underline">
                {userType === 'company' ? 'You posted a new job:' : 'New job posted:'} {(activity as Job).title}
              </Link>
            ) : (
              <Link href={`/applications/${activity.id}`} className="hover:underline">
                {userType === 'company' ? 'New application received' : 'You applied for a job'}
              </Link>
            )}
            <p className="text-sm text-gray-500">
              {new Date(activity.created_at).toLocaleDateString()}
            </p>
          </li>
        ))}
      </ul>
    </div>
  )
}

