'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"

type MyShift = {
  id: string
  company: string
  location: string
  date: string
  startTime: string
  endTime: string
  status: 'upcoming' | 'ongoing' | 'completed'
}

export function MyShiftsList() {
  const [shifts, setShifts] = useState<MyShift[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    fetchMyShifts()
  }, [])

  const fetchMyShifts = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/my-shifts')
      if (!response.ok) {
        throw new Error('Failed to fetch my shifts')
      }
      const data = await response.json()
      setShifts(data)
    } catch (error) {
      console.error('Error fetching my shifts:', error)
      toast({
        title: "Error",
        description: "Failed to load your shifts. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleClockIn = async (shiftId: string) => {
    try {
      const response = await fetch('/api/clock-in', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ shiftId }),
      })

      if (!response.ok) {
        throw new Error('Failed to clock in')
      }

      toast({
        title: "Success",
        description: "You have successfully clocked in.",
      })

      // Refresh the list of shifts
      fetchMyShifts()
    } catch (error) {
      console.error('Error clocking in:', error)
      toast({
        title: "Error",
        description: "Failed to clock in. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleClockOut = async (shiftId: string) => {
    try {
      const response = await fetch('/api/clock-out', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ shiftId }),
      })

      if (!response.ok) {
        throw new Error('Failed to clock out')
      }

      toast({
        title: "Success",
        description: "You have successfully clocked out.",
      })

      // Refresh the list of shifts
      fetchMyShifts()
    } catch (error) {
      console.error('Error clocking out:', error)
      toast({
        title: "Error",
        description: "Failed to clock out. Please try again.",
        variant: "destructive",
      })
    }
  }

  if (isLoading) {
    return <div>Loading your shifts...</div>
  }

  return (
    <div className="space-y-4">
      {shifts.map((shift) => (
        <Card key={shift.id}>
          <CardHeader>
            <CardTitle>{shift.company}</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Location: {shift.location}</p>
            <p>Date: {new Date(shift.date).toLocaleDateString()}</p>
            <p>Time: {shift.startTime} - {shift.endTime}</p>
            <p>Status: {shift.status}</p>
            {shift.status === 'upcoming' && (
              <Button onClick={() => handleClockIn(shift.id)} className="mt-2">
                Clock In
              </Button>
            )}
            {shift.status === 'ongoing' && (
              <Button onClick={() => handleClockOut(shift.id)} className="mt-2">
                Clock Out
              </Button>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

