// app/auth/verify/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from '@/components/ui/use-toast'
import { Loader2 } from 'lucide-react'

export default function VerifyEmail() {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isVerifying, setIsVerifying] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClientComponentClient()

  // Handle token verification
  useEffect(() => {
    const token = searchParams?.get('token')
    if (token) {
      verifyToken(token)
    }
  }, [searchParams])

  const verifyToken = async (token: string) => {
    setIsVerifying(true)
    try {
      const { error } = await supabase.auth.verifyOtp({
        token_hash: token,
        type: 'email',
      })

      if (error) throw error

      toast({
        title: 'Email verified successfully',
        description: 'You can now log in to your account.',
      })
      
      // Redirect to login after short delay
      setTimeout(() => router.push('/auth/login'), 2000)
    } catch (error) {
      console.error('Verification error:', error)
      toast({
        title: 'Verification failed',
        description: 'The verification link is invalid or has expired.',
        variant: 'destructive',
      })
    } finally {
      setIsVerifying(false)
    }
  }

  const resendVerification = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email,
      })

      if (error) throw error

      toast({
        title: 'Verification email sent',
        description: 'Please check your email for the verification link.',
      })
      
      setEmail('')
    } catch (error) {
      console.error('Resend error:', error)
      toast({
        title: 'Failed to send verification email',
        description: 'Please try again or contact support if the problem persists.',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (isVerifying) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-8 max-w-md w-full space-y-4">
          <div className="text-center space-y-4">
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-blue-600" />
            <h2 className="text-2xl font-bold">Verifying your email...</h2>
            <p className="text-gray-600">Please wait while we verify your email address.</p>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Card className="p-8 max-w-md w-full space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold">Verify Your Email</h2>
          <p className="text-gray-600 mt-2">
            Please check your email for a verification link. If you haven't received it,
            you can request a new one below.
          </p>
        </div>

        <form onSubmit={resendVerification} className="space-y-4">
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
              'Resend Verification Email'
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