'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { useAuth } from '@/lib/hooks/useAuth'
import { useToast } from '@/components/ui/use-toast'

const schema = z.object({
  coverLetter: z.string().min(50, "Cover letter must be at least 50 characters long"),
})

type JobApplicationForm = z.infer<typeof schema>

interface JobApplicationFormProps {
  jobId: string
}

export default function JobApplicationForm({ jobId }: JobApplicationFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { user } = useAuth()
  const { toast } = useToast()
  const { register, handleSubmit, formState: { errors } } = useForm<JobApplicationForm>({
    resolver: zodResolver(schema)
  })

  const onSubmit = async (data: JobApplicationForm) => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to apply for a job",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch('/api/applications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          job_id: jobId,
          applicant_id: user.id,
          cover_letter: data.coverLetter,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to submit application')
      }

      toast({
        title: "Success",
        description: "Your application has been submitted successfully!",
      })
    } catch (error) {
      console.error('Error submitting application:', error)
      toast({
        title: "Error",
        description: "There was an error submitting your application. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label htmlFor="coverLetter" className="block text-sm font-medium text-gray-700">
          Cover Letter
        </label>
        <Textarea
          id="coverLetter"
          {...register('coverLetter')}
          className={errors.coverLetter ? 'border-red-500' : ''}
          rows={6}
        />
        {errors.coverLetter && (
          <p className="mt-1 text-sm text-red-500">{errors.coverLetter.message}</p>
        )}
      </div>
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Submitting...' : 'Submit Application'}
      </Button>
    </form>
  )
}

