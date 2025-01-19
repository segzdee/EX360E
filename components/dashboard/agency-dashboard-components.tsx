'use client'

import { useRouter } from 'next/navigation'
import React, { useState, useEffect } from 'react'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { formatCurrency } from '@/lib/utils'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { CalendarDays, Users, DollarSign, Clock } from 'lucide-react'
import { generateDemoData } from '@/lib/demo-data'
import { AgencyMetrics } from '@/types/dashboard'

export default function AgencyDashboard() {
  const [metrics, setMetrics] = useState<AgencyMetrics>(generateDemoData())
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetch('/api/agency/analytics')
        if (!response.ok) throw new Error('Failed to fetch dashboard data')
        const data = await response.json()
        setMetrics(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setIsLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  if (error) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
        <p className="text-red-500">Error: {error}</p>
      </div>
    )
  }

  return (
    <div className="flex gap-4 h-[calc(100vh-4rem)]">
      {/* Side Panel */}
      <div className="w-64 bg-card p-4 rounded-lg shadow-lg">
        <div className="space-y-6">
          <div className="space-y-2">
            <h2 className="text-xl font-bold">Agency Overview</h2>
            <p className="text-sm text-muted-foreground">Real-time metrics</p>
          </div>
          
          <nav className="space-y-2">
            <a href="#staff" className="flex items-center gap-2 p-2 rounded-lg hover:bg-accent">
              <Users size={20} />
              <span>Staff ({metrics.totalStaff})</span>
            </a>
            <a href="#shifts" className="flex items-center gap-2 p-2 rounded-lg hover:bg-accent">
              <Clock size={20} />
              <span>Active Shifts ({metrics.activeShifts})</span>
            </a>
            <a href="#revenue" className="flex items-center gap-2 p-2 rounded-lg hover:bg-accent">
              <DollarSign size={20} />
              <span>Revenue ({formatCurrency(metrics.revenue)})</span>
            </a>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 space-y-4 overflow-y-auto">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card className="p-6">
            <h3 className="text-sm font-medium text-gray-500">Staff Members</h3>
            <div className="mt-2 flex items-center justify-between">
              <p className="text-3xl font-bold">{metrics.totalStaff}</p>
              <Badge variant="secondary" className="animate-pulse">
                {metrics.staffUtilization}% Active
              </Badge>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-sm font-medium text-gray-500">Monthly Revenue</h3>
            <div className="mt-2">
              <p className="text-3xl font-bold">{formatCurrency(metrics.revenue)}</p>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-sm font-medium text-gray-500">Active Shifts</h3>
            <div className="mt-2 flex items-center justify-between">
              <p className="text-3xl font-bold">{metrics.activeShifts}</p>
              <Badge variant="outline">{metrics.completedShifts} Completed</Badge>
            </div>
          </Card>
        </div>

        {/* Revenue Chart */}
        <Card className="p-6">
          <h3 className="text-sm font-medium text-gray-500 mb-4">Revenue Trend</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={metrics.revenueHistory}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => formatCurrency(value as number)} />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#2563eb" 
                  strokeWidth={2}
                  dot={{ strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Staff List */}
        <Card className="p-6">
          <h3 className="text-sm font-medium text-gray-500 mb-4">Staff Members</h3>
          <div className="space-y-4">
            {metrics.staffMembers.map((staff) => (
              <div key={staff.id} className="flex items-center justify-between p-4 bg-accent/10 rounded-lg">
                <div>
                  <h4 className="font-medium">{staff.name}</h4>
                  <div className="flex gap-2 mt-1">
                    {staff.skills.map((skill) => (
                      <Badge key={skill} variant="outline" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="text-right">
                  <Badge variant={staff.status === 'Available' ? 'secondary' : 'default'}>
                    {staff.status}
                  </Badge>
                  <p className="text-sm text-muted-foreground mt-1">
                    {staff.shiftsCompleted} shifts completed
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Recent Activity */}
        <Card className="p-6">
          <h3 className="text-sm font-medium text-gray-500 mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {metrics.recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-center gap-4">
                <div className="flex-1">
                  <p className="text-sm">{activity.message}</p>
                  <p className="text-xs text-muted-foreground">
                    {activity.timestamp.toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}

// Add TypeScript interfaces for better type safety
interface Metrics {
  totalStaff: number
  revenue: number
  activeShifts: number
  completedShifts: number
  staffUtilization: number
  revenueHistory: Array<{
    month: string
    value: number
  }>
  staffMembers: Array<{
    id: string
    name: string
    skills: string[]
    status: string
    shiftsCompleted: number
  }>
  recentActivity: Array<{
    id: string
    message: string
    timestamp: Date
  }>
} 