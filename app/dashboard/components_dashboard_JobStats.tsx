'use client'

import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

export default function JobStats() {
  const [stats, setStats] = useState([])
  const supabase = createClientComponentClient()

  useEffect(() => {
    const fetchStats = async () => {
      const { data, error } = await supabase
        .from('jobs')
        .select('created_at')
        .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())

      if (error) {
        console.error('Error fetching job stats:', error)
        return
      }

      const jobCounts = data.reduce((acc, job) => {
        const date = new Date(job.created_at).toLocaleDateString()
        acc[date] = (acc[date] || 0) + 1
        return acc
      }, {})

      const statsData = Object.entries(jobCounts).map(([date, count]) => ({ date, count }))
      setStats(statsData)
    }

    fetchStats()
  }, [supabase])

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Job Postings (Last 30 Days)</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={stats}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="count" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

