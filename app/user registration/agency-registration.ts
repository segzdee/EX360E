// app/auth/register/agency/page.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { CategorySelect } from '@/components/categories/CategorySelect'
import { toast } from '@/components/ui/use-toast'

export default function AgencyRegistration() {
  const [formData, setFormData] = useState({
    agencyName: '',
    email: '',
    password: '',
    categoryId: '',
    website: '',
    phone: '',
    description: '',
    serviceAreas: '',
    registrationNumber: '', // Business/Agency registration number
    taxId: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const supabase = createClientComponentClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            role: 'recruiter',
          }
        }
      })

      if (authError) throw authError

      // Create agency profile
      const { error: profileError } = await supabase
        .from('recruiters')
        .insert({
          profile_id: authData.user!.id,
          company_name: formData.agencyName,
          category_id: formData.categoryId,
          website: formData.website,
          phone: formData.phone,
          description: formData.description,
          service_areas: formData.serviceAreas.split(',').map(area => area.trim()),
          registration_number: formData.registrationNumber,
          tax_id: formData.taxId,
          verification_status: 'pending',
          service_fee_percentage: 6 // Default agency fee
        })

      if (profileError) throw profileError

      toast({
        title: "Registration successful",
        description: "Please check your email to verify your account.",
      })

      router.push('/auth/verify')
    } catch (error) {
      console.error('Registration error:', error)
      toast({
        title: "Registration failed",
        description: "An error occurred during registration. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Register your Agency
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Join our platform to connect companies with skilled staff
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <Card className="py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Agency Name
              </label>
              <div className="mt-1">
                <Input
                  value={formData.agencyName}
                  onChange={(e) => setFormData({ ...formData, agencyName: e.target.value })}
                  required
                  className="appearance-none block w-full"
                  placeholder="Enter your agency name"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Agency Category
              </label>
              <div className="mt-1">
                <CategorySelect
                  type="agency"
                  value={formData.categoryId}
                  onChange={(value) => setFormData({ ...formData, categoryId: value })}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <div className="mt-1">
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="appearance-none block w-full"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1">
                <Input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  className="appearance-none block w-full"
                  placeholder="Enter your password"
                  minLength={8}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Website
              </label>
              <div className="mt-1">
                <Input
                  type="url"
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  className="appearance-none block w-full"
                  placeholder="https://www.example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Phone Number
              </label>
              <div className="mt-1">
                <Input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  required
                  className="appearance-none block w-full"
                  placeholder="Enter phone number"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Service Areas
              </label>
              <div className="mt-1">
                <Input
                  value={formData.serviceAreas}
                  onChange={(e) => setFormData({ ...formData, serviceAreas: e.target.value })}
                  required
                  className="appearance-none block w-full"
                  placeholder="Enter service areas (comma-separated)"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Registration Number
              </label>
              <div className="mt-1">
                <Input
                  value={formData.registrationNumber}
                  onChange={(e) => setFormData({ ...formData, registrationNumber: e.target.value })}
                  required
                  className="appearance-none block w-full"
                  placeholder="Enter business registration number"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Tax ID
              </label>
              <div className="mt-1">
                <Input
                  value={formData.taxId}
                  onChange={(e) => setFormData({ ...formData, taxId: e.target.value })}
                  required
                  className="appearance-none block w-full"
                  placeholder="Enter tax ID"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <div className="mt-1">
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="appearance-none block w-full"
                  placeholder="Describe your agency and services"
                  rows={4}
                />
              </div>
            </div>

            <div>
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-2 px-4"
              >
                {isLoading ? 'Registering...' : 'Register Agency'}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  )
}