'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"

type PerformanceData = {
  totalShiftsCompleted: number
  averageRating: number
  punctualityScore: number
  reliabilityScore: number
}

export function ExtraStaffPerformance() {
  const [performanceData, setPerformanceData] = useState<PerformanceData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    fetchPerformanceData()
  }, [])

  const fetchPerformanceData = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/extra-staff-performance')
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
    return <div>Loading performance data...</div>
  }

  if (!performanceData) {
    return <div>No performance data available.</div>
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader>
          <CardTitle>Total Shifts Completed</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">{performanceData.totalShiftsCompleted}</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Average Rating</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">{performanceData.averageRating.toFixed(1)}/5</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Punctuality Score</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">{performanceData.punctualityScore.toFixed(2)}%</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Reliability Score</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">{performanceData.reliabilityScore.toFixed(2)}%</p>
        </CardContent>
      </Card>
    </div>
  )
}

