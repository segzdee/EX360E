// app/auth/register/company/page.tsx
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

export default function CompanyRegistration() {
  const [formData, setFormData] = useState({
    companyName: '',
    email: '',
    password: '',
    categoryId: '',
    location: '',
    description: ''
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
            role: 'company',
          }
        }
      })

      if (authError) throw authError

      // Create company profile
      const { error: profileError } = await supabase
        .from('companies')
        .insert({
          profile_id: authData.user!.id,
          company_name: formData.companyName,
          category_id: formData.categoryId,
          location: formData.location,
          description: formData.description
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
          Register your Company
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Join our platform to find the best staff for your needs
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <Card className="py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Company Name
              </label>
              <div className="mt-1">
                <Input
                  value={formData.companyName}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                  required
                  className="appearance-none block w-full"
                  placeholder="Enter your company name"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Company Category
              </label>
              <div className="mt-1">
                <CategorySelect
                  type="company"
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
                Location
              </label>
              <div className="mt-1">
                <Input
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  required
                  className="appearance-none block w-full"
                  placeholder="Enter company location"
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
                  placeholder="Describe your company"
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
                {isLoading ? 'Registering...' : 'Register Company'}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  )
}