'use client'

import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Database } from '@/types/supabase'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'

type Application = Database['public']['Tables']['applications']['Row'] & {
  profiles: { full_name: string | null }
  jobs: { title: string }
}

interface JobApplicationsProps {
  companyId: string
}

export default function JobApplications({ companyId }: JobApplicationsProps) {
  const [applications, setApplications] = useState<Application[]>([])
  const { toast } = useToast()
  const supabase = createClientComponentClient<Database>()

  useEffect(() => {
    fetchApplications()
  }, [])

  const fetchApplications = async () => {
    const { data, error } = await supabase
      .from('applications')
      .select(`
        *,
        profiles (full_name),
        jobs (title)
      `)
      .eq('company_id', companyId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching applications:', error)
      toast({
        title: "Error",
        description: "Failed to fetch applications. Please try again.",
        variant: "destructive",
      })
    } else {
      setApplications(data)
    }
  }

  const updateApplicationStatus = async (id: string, status: 'reviewed' | 'accepted' | 'rejected') => {
    const { error } = await supabase
      .from('applications')
      .update({ status })
      .eq('id', id)

    if (error) {
      toast({
        title: "Error",
        description: "Failed to update application status. Please try again.",
        variant: "destructive",
      })
    } else {
      toast({
        title: "Success",
        description: "Application status updated successfully.",
      })
      fetchApplications()
    }
  }

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4">Job Applications</h2>
      <ul className="space-y-4">
        {applications.map((application) => (
          <li key={application.id} className="border-b pb-4">
            <h3 className="font-medium">{application.jobs.title}</h3>
            <p className="text-sm text-gray-500">Applicant: {application.profiles.full_name}</p>
            <p className="text-sm text-gray-500">Status: {application.status}</p>
            <p className="text-sm text-gray-700 mt-2">{application.cover_letter}</p>
            <div className="mt-2 space-x-2">
              <Button 
                size="sm" 
                variant="outline" 
                onClick={() => updateApplicationStatus(application.id, 'reviewed')}
              >
                Mark as Reviewed
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                onClick={() => updateApplicationStatus(application.id, 'accepted')}
              >
                Accept
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                onClick={() => updateApplicationStatus(application.id, 'rejected')}
              >
                Reject
              </Button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

