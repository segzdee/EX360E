// components/dashboard/staff/ShiftFinder.tsx
'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { formatCurrency, formatDate } from '@/lib/utils'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export function ShiftFinder() {
  const [shifts, setShifts] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const supabase = createClientComponentClient()

  useEffect(() => {
    fetchAvailableShifts()
  }, [])

  const fetchAvailableShifts = async () => {
    setIsLoading(true)
    try {
      const { data } = await supabase
        .from('shifts')
        .select(`
          *,
          companies (company_name, location)
        `)
        .eq('status', 'open')
        .order('start_time', { ascending: true })
      
      setShifts(data || [])
    } catch (error) {
      console.error('Error fetching shifts:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const applyForShift = async (shiftId: string) => {
    try {
      const { error } = await supabase
        .from('shift_applications')
        .insert({
          shift_id: shiftId,
          status: 'pending'
        })

      if (error) throw error
      
      // Refresh shifts
      fetchAvailableShifts()
    } catch (error) {
      console.error('Error applying for shift:', error)
    }
  }

  if (isLoading) {
    return <div>Loading available shifts...</div>
  }

  return (
    <Card className="p-6">
      <h2 className="text-xl font-bold mb-4">Available Shifts</h2>
      <div className="space-y-4">
        {shifts.map((shift: any) => (
          <div key={shift.id} className="border-b pb-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium">{shift.title}</h3>
                <p className="text-sm text-gray-500">
                  {shift.companies.company_name}
                </p>
                <p className="text-sm text-gray-500">
                  {formatDate(shift.start_time)} - {formatDate(shift.end_time)}
                </p>
                <div className="flex gap-2 mt-2">
                  {shift.required_skills.map((skill: string) => (
                    <Badge key={skill} variant="secondary">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium">{formatCurrency(shift.hourly_rate)}/hr</p>
                <Button
                  onClick={() => applyForShift(shift.id)}
                  className="mt-2"
                  size="sm"
                >
                  Apply Now
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}

// components/dashboard/staff/ShiftSchedule.tsx
export function ShiftSchedule() {
  const [assignments, setAssignments] = useState([])
  const supabase = createClientComponentClient()

  useEffect(() => {
    fetchAssignments()
  }, [])

  const fetchAssignments = async () => {
    const { data } = await supabase
      .from('shift_assignments')
      .select(`
        *,
        shift:shifts (
          *,
          companies (company_name, location)
        )
      `)
      .order('created_at', { ascending: false })

    setAssignments(data || [])
  }

  return (
    <Card className="p-6">
      <h2 className="text-xl font-bold mb-4">My Schedule</h2>
      <div className="divide-y">
        {assignments.map((assignment: any) => (
          <div key={assignment.id} className="py-4">
            <div className="flex justify-between">
              <div>
                <h3 className="font-medium">{assignment.shift.title}</h3>
                <p className="text-sm text-gray-500">
                  {assignment.shift.companies.company_name}
                </p>
                <p className="text-sm text-gray-500">
                  {formatDate(assignment.shift.start_time)} - 
                  {formatDate(assignment.shift.end_time)}
                </p>
              </div>
              <div className="text-right">
                <Badge variant={
                  assignment.status === 'completed' ? 'success' :
                  assignment.status === 'in_progress' ? 'warning' :
                  'default'
                }>
                  {assignment.status}
                </Badge>
                <p className="text-sm text-gray-500 mt-1">
                  {formatCurrency(assignment.shift.hourly_rate)}/hr
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}

// components/dashboard/staff/EarningsTracker.tsx
export function EarningsTracker() {
  const [earnings, setEarnings] = useState({
    total: 0,
    pending: 0,
    weekly: [],
    monthly: []
  })

  useEffect(() => {
    fetchEarnings()
  }, [])

  const fetchEarnings = async () => {
    const supabase = createClientComponentClient()
    
    const { data: completedShifts } = await supabase
      .from('shift_assignments')
      .select(`
        *,
        shift:shifts (
          hourly_rate,
          start_time,
          end_time
        )
      `)
      .eq('status', 'completed')

    if (completedShifts) {
      const totalEarnings = completedShifts.reduce((acc, curr) => {
        const hours = (new Date(curr.shift.end_time).getTime() - 
          new Date(curr.shift.start_time).getTime()) / (1000 * 60 * 60)
        return acc + (hours * curr.shift.hourly_rate)
      }, 0)

      setEarnings(prev => ({
        ...prev,
        total: totalEarnings
      }))
    }
  }

  return (
    <Card className="p-6">
      <h2 className="text-xl font-bold mb-4">Earnings Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4">
          <h3 className="text-sm text-gray-500">Total Earnings</h3>
          <p className="text-2xl font-bold">{formatCurrency(earnings.total)}</p>
        </Card>
        <Card className="p-4">
          <h3 className="text-sm text-gray-500">Pending Payments</h3>
          <p className="text-2xl font-bold">{formatCurrency(earnings.pending)}</p>
        </Card>
        <Card className="p-4">
          <h3 className="text-sm text-gray-500">This Month</h3>
          <p className="text-2xl font-bold">
            {formatCurrency(earnings.monthly[earnings.monthly.length - 1]?.amount || 0)}
          </p>
        </Card>
      </div>
    </Card>
  )
}
