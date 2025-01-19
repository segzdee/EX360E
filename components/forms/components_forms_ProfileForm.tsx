'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/components/ui/use-toast'

const schema = z.object({
  full_name: z.string().min(1, "Full name is required"),
  bio: z.string().max(500, "Bio must be 500 characters or less"),
  location: z.string().min(1, "Location is required"),
})

type ProfileFormData = z.infer<typeof schema>

interface ProfileFormProps {
  initialData: ProfileFormData & { id: string }
}

export default function ProfileForm({ initialData }: ProfileFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()
  const { register, handleSubmit, formState: { errors } } = useForm<ProfileFormData>({
    resolver: zodResolver(schema),
    defaultValues: initialData,
  })

  const onSubmit = async (data: ProfileFormData) => {
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/profiles', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: initialData.id,
          ...data,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to update profile')
      }

      toast({
        title: "Success",
        description: "Your profile has been updated successfully!",
      })
    } catch (error) {
      console.error('Error updating profile:', error)
      toast({
        title: "Error",
        description: "There was an error updating your profile. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label htmlFor="full_name" className="block text-sm font-medium text-gray-700">
          Full Name
        </label>
        <Input
          id="full_name"
          {...register('full_name')}
          className={errors.full_name ? 'border-red-500' : ''}
        />
        {errors.full_name && (
          <p className="mt-1 text-sm text-red-500">{errors.full_name.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
          Bio
        </label>
        <Textarea
          id="bio"
          {...register('bio')}
          className={errors.bio ? 'border-red-500' : ''}
          rows={4}
        />
        {errors.bio && (
          <p className="mt-1 text-sm text-red-500">{errors.bio.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="location" className="block text-sm font-medium text-gray-700">
          Location
        </label>
        <Input
          id="location"
          {...register('location')}
          className={errors.location ? 'border-red-500' : ''}
        />
        {errors.location && (
          <p className="mt-1 text-sm text-red-500">{errors.location.message}</p>
        )}
      </div>

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Updating...' : 'Update Profile'}
      </Button>
    </form>
  )
}

