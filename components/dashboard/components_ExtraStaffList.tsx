'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"

type ExtraStaff = {
  id: string
  name: string
  email: string
  phone: string
  skills: string[]
  availability: string
}

export function ExtraStaffList() {
  const [staff, setStaff] = useState<ExtraStaff[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    fetchStaff()
  }, [])

  const fetchStaff = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/extra-staff')
      if (!response.ok) {
        throw new Error('Failed to fetch extra staff')
      }
      const data = await response.json()
      setStaff(data)
    } catch (error) {
      console.error('Error fetching extra staff:', error)
      toast({
        title: "Error",
        description: "Failed to load extra staff. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleEditStaff = (staffId: string) => {
    // Implement edit functionality
    console.log('Edit staff:', staffId)
  }

  if (isLoading) {
    return <div>Loading extra staff...</div>
  }

  return (
    <div className="space-y-4">
      {staff.map((member) => (
        <Card key={member.id}>
          <CardHeader>
            <CardTitle>{member.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Email: {member.email}</p>
            <p>Phone: {member.phone}</p>
            <p>Skills: {member.skills.join(', ')}</p>
            <p>Availability: {member.availability}</p>
            <Button onClick={() => handleEditStaff(member.id)} className="mt-2">
              Edit Staff
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

