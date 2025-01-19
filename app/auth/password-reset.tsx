// app/auth/forgot-password/page.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from '@/components/ui/use-toast'
import { Loader2 } from 'lucide-react'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const supabase = createClientComponentClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      })

      if (error) throw error

      toast({
        title: 'Reset link sent',
        description: 'Please check your email for the password reset link.',
      })
      
      setEmail('')
    } catch (error) {
      console.error('Reset error:', error)
      toast({
        title: 'Failed to send reset link',
        description: 'Please try again or contact support if the problem persists.',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Card className="p-8 max-w-md w-full space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold">Reset Password</h2>
          <p className="text-gray-600 mt-2">
            Enter your email address and we'll send you a link to reset your password.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Sending...
              </>
            ) : (
              'Send Reset Link'
            )}
          </Button>
        </form>

        <div className="text-center">
          <Button
            variant="link"
            onClick={() => router.push('/auth/login')}
            className="text-sm"
          >
            Back to Login
          </Button>
        </div>
      </Card>
    </div>
  )
}

// app/auth/reset-password/page.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from '@/components/ui/use-toast'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { newPasswordSchema } from '@/lib/validations/auth'

export default function ResetPassword() {
  const [passwords, setPasswords] = useState({ password: '', confirmPassword: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const supabase = createClientComponentClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Validate passwords
      const validated = newPasswordSchema.parse(passwords)

      const { error } = await supabase.auth.updateUser({
        password: validated.password
      })

      if (error) throw error

      toast({
        title: 'Password updated successfully',
        description: 'You can now log in with your new password.',
      })

      // Redirect to login after short delay
      setTimeout(() => router.push('/auth/login'), 2000)
    } catch (error) {
      console.error('Update error:', error)
      toast({
        title: 'Failed to update password',
        description: error.message || 'Please try again or contact support.',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Card className="p-8 max-w-md w-full space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold">Set New Password</h2>
          <p className="text-gray-600 mt-2">
            Please enter and confirm your new password.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              New Password
            </label>
            <div className="relative">
              <Input
                type={showPassword ? 'text' : 'password'}
                value={passwords.password}
                onChange={(e) => setPasswords({ ...passwords, password: e.target.value })}
                placeholder="Enter new password"
                required
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-gray-500" />
                ) : (
                  <Eye className="h-4 w-4 text-gray-500" />
                )}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confirm Password
            </label>
            <Input
              type="password"
              value={passwords.confirmPassword}
              onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
              placeholder="Confirm new password"
              required
            />
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Updating...
              </>
            ) : (
              'Update Password'
            )}
          </Button>
        </form>
      </Card>
    </div>
  )
}