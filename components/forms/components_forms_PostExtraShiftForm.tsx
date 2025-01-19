'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"

const schema = z.object({
  date: z.string().min(1, "Date is required"),
  startTime: z.string().min(1, "Start time is required"),
  endTime: z.string().min(1, "End time is required"),
  location: z.string().min(1, "Location is required"),
  payRate: z.number().min(0, "Pay rate must be a positive number"),
})

type PostExtraShiftFormData = z.infer<typeof schema>

interface PostExtraShiftFormProps {
  onSuccess: () => void
}

export function PostExtraShiftForm({ onSuccess }: PostExtraShiftFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()
  const { register, handleSubmit, formState: { errors } } = useForm<PostExtraShiftFormData>({
    resolver: zodResolver(schema)
  })

  const onSubmit = async (data: PostExtraShiftFormData) => {
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/extra-shifts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error('Failed to post extra shift')
      }

      toast({
        title: "Success",
        description: "Extra shift posted successfully!",
      })
      onSuccess()
    } catch (error) {
      console.error('Error posting extra shift:', error)
      toast({
        title: "Error",
        description: "There was an error posting the extra shift. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label htmlFor="date" className="block text-sm font-medium text-gray-700">Date</label>
        <Input type="date" id="date" {...register('date')} />
        {errors.date && <p className="mt-1 text-sm text-red-500">{errors.date.message}</p>}
      </div>

      <div>
        <label htmlFor="startTime" className="block text-sm font-medium text-gray-700">Start Time</label>
        <Input type="time" id="startTime" {...register('startTime')} />
        {errors.startTime && <p className="mt-1 text-sm text-red-500">{errors.startTime.message}</p>}
      </div>

      <div>
        <label htmlFor="endTime" className="block text-sm font-medium text-gray-700">End Time</label>
        <Input type="time" id="endTime" {...register('endTime')} />
        {errors.endTime && <p className="mt-1 text-sm text-red-500">{errors.endTime.message}</p>}
      </div>

      <div>
        <label htmlFor="location" className="block text-sm font-medium text-gray-700">Location</label>
        <Input type="text" id="location" {...register('location')} />
        {errors.location && <p className="mt-1 text-sm text-red-500">{errors.location.message}</p>}
      </div>

      <div>
        <label htmlFor="payRate" className="block text-sm font-medium text-gray-700">Pay Rate (per hour)</label>
        <Input type="number" id="payRate" {...register('payRate', { valueAsNumber: true })} />
        {errors.payRate && <p className="mt-1 text-sm text-red-500">{errors.payRate.message}</p>}
      </div>

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Posting...' : 'Post Extra Shift'}
      </Button>
    </form>
  )
}

