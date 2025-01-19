'use client'

import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Database } from '@/types/supabase'

type JobStats = {
  date: string
  count: number
}

type Props = {
  userType: Database['public']['Tables']['profiles']['Row']['user_type']
  userId: string
}

export default function JobStats({ userType, userId }: Props) {
  const [stats, setStats] = useState<JobStats[]>([])
  const supabase = createClientComponentClient<Database>()

  useEffect(() => {
    const fetchStats = async () => {
      let query = supabase
        .from('jobs')
        .select('created_at')
        .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())

      if (userType === 'company') {
        query = query.eq('company_id', userId)
      }

      const { data, error } = await query

      if (error) {
        console.error('Error fetching job stats:', error)
        return
      }

      const jobCounts = data.reduce((acc, job) => {
        const date = new Date(job.created_at).toLocaleDateString()
        acc[date] = (acc[date] || 0) + 1
        return acc
      }, {} as Record<string, number>)

      const statsData = Object.entries(jobCounts).map(([date, count]) => ({ date, count }))
      setStats(statsData)
    }

    fetchStats()
  }, [supabase, userType, userId])

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">
        {userType === 'company' ? 'Your Job Postings' : 'Job Postings'} (Last 30 Days)
      </h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={stats}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="count" fill="#3b82f6" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

