'use client'

import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Database } from '@/types/supabase'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

type AgencyStats = {
  totalJobs: number
  totalApplications: number
  placedStaff: number
}

interface AgencyDashboardProps {
  agencyId: string
}

export default function AgencyDashboard({ agencyId }: AgencyDashboardProps) {
  const [stats, setStats] = useState<AgencyStats>({
    totalJobs: 0,
    totalApplications: 0,
    placedStaff: 0,
  })
  const supabase = createClientComponentClient<Database>()

  useEffect(() => {
    const fetchAgencyStats = async () => {
      // Fetch total jobs
      const { count: totalJobs } = await supabase
        .from('jobs')
        .select('*', { count: 'exact', head: true })
        .eq('agency_id', agencyId)

      // Fetch total applications
      const { count: totalApplications } = await supabase
        .from('applications')
        .select('*', { count: 'exact', head: true })
        .eq('agency_id', agencyId)

      // Fetch placed staff (applications with 'accepted' status)
      const { count: placedStaff } = await supabase
        .from('applications')
        .select('*', { count: 'exact', head: true })
        .eq('agency_id', agencyId)
        .eq('status', 'accepted')

      setStats({
        totalJobs: totalJobs || 0,
        totalApplications: totalApplications || 0,
        placedStaff: placedStaff || 0,
      })
    }

    fetchAgencyStats()
  }, [supabase, agencyId])

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4">Agency Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-100 p-4 rounded-lg">
          <h3 className="font-medium">Total Jobs</h3>
          <p className="text-2xl font-bold">{stats.totalJobs}</p>
        </div>
        <div className="bg-green-100 p-4 rounded-lg">
          <h3 className="font-medium">Total Applications</h3>
          <p className="text-2xl font-bold">{stats.totalApplications}</p>
        </div>
        <div className="bg-purple-100 p-4 rounded-lg">
          <h3 className="font-medium">Placed Staff</h3>
          <p className="text-2xl font-bold">{stats.placedStaff}</p>
        </div>
      </div>
      <div className="flex justify-between">
        <Button asChild>
          <Link href="/jobs/create">Post a New Job</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/agency/staff">Manage Staff</Link>
        </Button>
      </div>
    </div>
  )
}

