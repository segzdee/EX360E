'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"

const schema = z.object({
  full_name: z.string().min(1, "Full name is required"),
  user_type: z.enum(['client', 'agency', 'staff'], {
    required_error: "User type is required",
  }),
  company_name: z.string().optional(),
  phone: z.string().min(1, "Phone number is required"),
})

type ProfileFormData = z.infer<typeof schema>

export default function CreateProfile() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()
  const { toast } = useToast()
  const supabase = createClientComponentClient()

  const { register, handleSubmit, watch, formState: { errors } } = useForm<ProfileFormData>({
    resolver: zodResolver(schema)
  })

  const userType = watch('user_type')

  const onSubmit = async (data: ProfileFormData) => {
    setIsSubmitting(true)

    try {
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) throw new Error('No user found')

      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          ...data,
        })

      if (error) throw error

      toast({
        title: "Success",
        description: "Your profile has been created successfully!",
      })

      router.push('/dashboard')
    } catch (error) {
      console.error('Error creating profile:', error)
      toast({
        title: "Error",
        description: "There was an error creating your profile. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-md mx-auto mt-8">
      <h1 className="text-2xl font-bold mb-4">Create Your Profile</h1>
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
          <label htmlFor="user_type" className="block text-sm font-medium text-gray-700">
            User Type
          </label>
          <Select onValueChange={(value) => register('user_type').onChange({ target: { value } })}>
            <SelectTrigger className={errors.user_type ? 'border-red-500' : ''}>
              <SelectValue placeholder="Select user type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="client">Client</SelectItem>
              <SelectItem value="agency">Agency</SelectItem>
              <SelectItem value="staff">Extra Staff</SelectItem>
            </SelectContent>
          </Select>
          {errors.user_type && (
            <p className="mt-1 text-sm text-red-500">{errors.user_type.message}</p>
          )}
        </div>

        {(userType === 'client' || userType === 'agency') && (
          <div>
            <label htmlFor="company_name" className="block text-sm font-medium text-gray-700">
              Company Name
            </label>
            <Input
              id="company_name"
              {...register('company_name')}
            />
          </div>
        )}

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
            Phone Number
          </label>
          <Input
            id="phone"
            {...register('phone')}
            className={errors.phone ? 'border-red-500' : ''}
          />
          {errors.phone && (
            <p className="mt-1 text-sm text-red-500">{errors.phone.message}</p>
          )}
        </div>

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Creating Profile...' : 'Create Profile'}
        </Button>
      </form>
    </div>
  )
}

