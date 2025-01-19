'use client'

import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Database } from '@/types/supabase'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

type AnalyticsData = {
  date: string
  applications: number
  hires: number
}

interface CompanyAnalyticsProps {
  companyId: string
}

export function CompanyAnalytics({ companyId }: CompanyAnalyticsProps) {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData[]>([])
  const supabase = createClientComponentClient<Database>()

  useEffect(() => {
    const fetchAnalytics = async () => {
      const thirtyDaysAgo = new Date()
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

      const { data: applications, error: applicationsError } = await supabase
        .from('applications')
        .select('created_at')
        .eq('company_id', companyId)
        .gte('created_at', thirtyDaysAgo.toISOString())

      const { data: hires, error: hiresError } = await supabase
        .from('applications')
        .select('created_at')
        .eq('company_id', companyId)
        .eq('status', 'accepted')
        .gte('created_at', thirtyDaysAgo.toISOString())

      if (applicationsError || hiresError) {
        console.error('Error fetching analytics data:', applicationsError || hiresError)
        return
      }

      const data: Record<string, AnalyticsData> = {}

      for (let i = 0; i < 30; i++) {
        const date = new Date()
        date.setDate(date.getDate() - i)
        const dateString = date.toISOString().split('T')[0]
        data[dateString] = { date: dateString, applications: 0, hires: 0 }
      }

      applications?.forEach(app => {
        const date = new Date(app.created_at).toISOString().split('T')[0]
        if (data[date]) {
          data[date].applications++
        }
      })

      hires?.forEach(hire => {
        const date = new Date(hire.created_at).toISOString().split('T')[0]
        if (data[date]) {
          data[date].hires++
        }
      })

      setAnalyticsData(Object.values(data).reverse())
    }

    fetchAnalytics()
  }, [companyId, supabase])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Company Analytics</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={analyticsData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="applications" stroke="#8884d8" name="Applications" />
            <Line type="monotone" dataKey="hires" stroke="#82ca9d" name="Hires" />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

