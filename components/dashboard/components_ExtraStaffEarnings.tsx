'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

type EarningsData = {
  totalEarnings: number
  pendingPayments: number
  completedPayments: number
  monthlyEarnings: {
    month: string
    earnings: number
  }[]
}

export function ExtraStaffEarnings() {
  const [earningsData, setEarningsData] = useState<EarningsData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    fetchEarningsData()
  }, [])

  const fetchEarningsData = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/extra-staff-earnings')
      if (!response.ok) {
        throw new Error('Failed to fetch earnings data')
      }
      const data = await response.json()
      setEarningsData(data)
    } catch (error) {
      console.error('Error fetching earnings data:', error)
      toast({
        title: "Error",
        description: "Failed to load earnings data. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return <div>Loading earnings data...</div>
  }

  if (!earningsData) {
    return <div>No earnings data available.</div>
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Total Earnings</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">${earningsData.totalEarnings.toFixed(2)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Pending Payments</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">${earningsData.pendingPayments.toFixed(2)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Completed Payments</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">${earningsData.completedPayments.toFixed(2)}</p>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Monthly Earnings</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={earningsData.monthlyEarnings}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="earnings" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}

