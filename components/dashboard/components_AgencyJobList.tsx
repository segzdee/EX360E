'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"

type Job = {
  id: string
  title: string
  company: string
  location: string
  startDate: string
  endDate: string
  status: 'open' | 'filled' | 'completed'
}

export function AgencyJobList() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    fetchJobs()
  }, [])

  const fetchJobs = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/agency-jobs')
      if (!response.ok) {
        throw new Error('Failed to fetch agency jobs')
      }
      const data = await response.json()
      setJobs(data)
    } catch (error) {
      console.error('Error fetching agency jobs:', error)
      toast({
        title: "Error",
        description: "Failed to load agency jobs. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleAssignStaff = (jobId: string) => {
    // Implement assign staff functionality
    console.log('Assign staff to job:', jobId)
  }

  if (isLoading) {
    return <div>Loading agency jobs...</div>
  }

  return (
    <div className="space-y-4">
      {jobs.map((job) => (
        <Card key={job.id}>
          <CardHeader>
            <CardTitle>{job.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Company: {job.company}</p>
            <p>Location: {job.location}</p>
            <p>Start Date: {new Date(job.startDate).toLocaleDateString()}</p>
            <p>End Date: {new Date(job.endDate).toLocaleDateString()}</p>
            <p>Status: {job.status}</p>
            {job.status === 'open' && (
              <Button onClick={() => handleAssignStaff(job.id)} className="mt-2">
                Assign Staff
              </Button>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

