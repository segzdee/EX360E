'use client'

import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Database } from '@/types/supabase'
import Link from 'next/link'

type Application = Database['public']['Tables']['applications']['Row'] & {
  jobs: { title: string; company_id: string }
  profiles: { full_name: string | null }
}

interface StaffApplicationsProps {
  staffId: string
}

export default function StaffApplications({ staffId }: StaffApplicationsProps) {
  const [applications, setApplications] = useState<Application[]>([])
  const supabase = createClientComponentClient<Database>()

  useEffect(() => {
    const fetchApplications = async () => {
      const { data, error } = await supabase
        .from('applications')
        .select(`
          *,
          jobs (title, company_id),
          profiles (full_name)
        `)
        .eq('applicant_id', staffId)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching applications:', error)
      } else {
        setApplications(data)
      }
    }

    fetchApplications()
  }, [supabase, staffId])

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4">Your Applications</h2>
      <ul className="space-y-4">
        {applications.map((application) => (
          <li key={application.id} className="border-b pb-4">
            <h3 className="font-medium">{application.jobs.title}</h3>
            <p className="text-sm text-gray-500">Company: {application.profiles.full_name}</p>
            <p className="text-sm text-gray-500">Status: {application.status}</p>
            <p className="text-sm text-gray-700 mt-2">{application.cover_letter}</p>
            <div className="mt-2">
              <Link href={`/jobs/${application.jobs.company_id}`} className="text-blue-600 hover:underline">
                View Job Details
              </Link>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

