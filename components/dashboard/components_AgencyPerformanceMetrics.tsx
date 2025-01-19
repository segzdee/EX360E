'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

type PerformanceData = {
  staffUtilizationRate: number
  clientSatisfactionScore: number
  averageTimeToFill: number
  repeatBusinessRate: number
  monthlyPerformance: {
    month: string
    filledJobs: number
    revenue: number
  }[]
}

export function AgencyPerformanceMetrics() {
  const [performanceData, setPerformanceData] = useState<PerformanceData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    fetchPerformanceData()
  }, [])

  const fetchPerformanceData = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/agency-performance-metrics')
      if (!response.ok) {
        throw new Error('Failed to fetch performance data')
      }
      const data = await response.json()
      setPerformanceData(data)
    } catch (error) {
      console.error('Error fetching performance data:', error)
      toast({
        title: "Error",
        description: "Failed to load performance data. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return <div>Loading performance metrics...</div>
  }

  if (!performanceData) {
    return <div>No performance data available.</div>
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle>Staff Utilization Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{performanceData.staffUtilizationRate.toFixed(2)}%</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Client Satisfaction Score</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{performanceData.clientSatisfactionScore.toFixed(1)}/5</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Average Time to Fill</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{performanceData.averageTimeToFill.toFixed(1)} days</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Repeat Business Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{performanceData.repeatBusinessRate.toFixed(2)}%</p>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Monthly Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={performanceData.monthlyPerformance}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
              <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
              <Tooltip />
              <Bar yAxisId="left" dataKey="filledJobs" fill="#8884d8" name="Filled Jobs" />
              <Bar yAxisId="right" dataKey="revenue" fill="#82ca9d" name="Revenue" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}

