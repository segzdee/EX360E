'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"

type ExtraShift = {
  id: string
  date: string
  startTime: string
  endTime: string
  location: string
  payRate: number
  status: 'posted' | 'ongoing' | 'completed'
}

interface ExtraShiftsListProps {
  userType: 'client' | 'agency' | 'staff'
}

export function ExtraShiftsList({ userType }: ExtraShiftsListProps) {
  const [shifts, setShifts] = useState<ExtraShift[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    fetchShifts()
  }, [])

  const fetchShifts = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/extra-shifts')
      if (!response.ok) {
        throw new Error('Failed to fetch extra shifts')
      }
      const data = await response.json()
      setShifts(data)
    } catch (error) {
      console.error('Error fetching extra shifts:', error)
      toast({
        title: "Error",
        description: "Failed to load extra shifts. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleEdit = (shiftId: string) => {
    // Implement edit functionality
    console.log('Edit shift:', shiftId)
  }

  const handleCancel = async (shiftId: string) => {
    try {
      const response = await fetch(`/api/extra-shifts/${shiftId}`, {
        method: 'DELETE',
      })
      if (!response.ok) {
        throw new Error('Failed to cancel extra shift')
      }
      toast({
        title: "Success",
        description: "Extra shift cancelled successfully.",
      })
      fetchShifts() // Refresh the list
    } catch (error) {
      console.error('Error cancelling extra shift:', error)
      toast({
        title: "Error",
        description: "Failed to cancel extra shift. Please try again.",
        variant: "destructive",
      })
    }
  }

  if (isLoading) {
    return <div>Loading extra shifts...</div>
  }

  return (
    <div className="space-y-4">
      {shifts.map((shift) => (
        <Card key={shift.id}>
          <CardHeader>
            <CardTitle>{new Date(shift.date).toLocaleDateString()} - {shift.location}</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Time: {shift.startTime} - {shift.endTime}</p>
            <p>Pay Rate: ${shift.payRate}/hour</p>
            <p>Status: {shift.status}</p>
            {userType === 'client' && shift.status === 'posted' && (
              <div className="mt-2 space-x-2">
                <Button onClick={() => handleEdit(shift.id)}>Edit</Button>
                <Button variant="destructive" onClick={() => handleCancel(shift.id)}>Cancel</Button>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

