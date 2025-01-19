'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"

type AvailableShift = {
  id: string
  company: string
  location: string
  date: string
  startTime: string
  endTime: string
  payRate: number
}

export function AvailableShiftsList() {
  const [shifts, setShifts] = useState<AvailableShift[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    fetchAvailableShifts()
  }, [])

  const fetchAvailableShifts = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/available-shifts')
      if (!response.ok) {
        throw new Error('Failed to fetch available shifts')
      }
      const data = await response.json()
      setShifts(data)
    } catch (error) {
      console.error('Error fetching available shifts:', error)
      toast({
        title: "Error",
        description: "Failed to load available shifts. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleApplyForShift = async (shiftId: string) => {
    try {
      const response = await fetch('/api/apply-for-shift', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ shiftId }),
      })

      if (!response.ok) {
        throw new Error('Failed to apply for shift')
      }

      toast({
        title: "Success",
        description: "You have successfully applied for the shift.",
      })

      // Refresh the list of available shifts
      fetchAvailableShifts()
    } catch (error) {
      console.error('Error applying for shift:', error)
      toast({
        title: "Error",
        description: "Failed to apply for the shift. Please try again.",
        variant: "destructive",
      })
    }
  }

  if (isLoading) {
    return <div>Loading available shifts...</div>
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
            <p>Pay Rate: ${shift.payRate}/hour</p>
            <Button onClick={() => handleApplyForShift(shift.id)} className="mt-2">
              Apply for Shift
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

