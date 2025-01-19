'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { EyeIcon, EyeOffIcon } from 'lucide-react'
import { useToast } from "@/components/ui/use-toast"

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [userType, setUserType] = useState<'companies' | 'agencies' | 'staff' | null>(null)
  const [agreeToTerms, setAgreeToTerms] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const validateEmail = (email: string) => {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    return re.test(email)
  }

  const validatePassword = (password: string) => {
    return password.length >= 8
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    if (!email || !password || !userType || !agreeToTerms) {
      toast({
        title: "Error",
        description: "Please fill in all fields and agree to the terms.",
        variant: "destructive",
      })
      setIsLoading(false)
      return
    }

    if (!validateEmail(email)) {
      toast({
        title: "Error",
        description: "Please enter a valid email address.",
        variant: "destructive",
      })
      setIsLoading(false)
      return
    }

    if (!validatePassword(password)) {
      toast({
        title: "Error",
        description: "Password must be at least 8 characters long.",
        variant: "destructive",
      })
      setIsLoading(false)
      return
    }

    try {
      // Here you would typically call an API to authenticate the user
      // For now, we'll simulate a successful login after a short delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      console.log('Login submitted:', { email, password, userType })
      toast({
        title: "Success",
        description: "You have successfully logged in.",
      })
      router.push('/dashboard')
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while logging in. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-md w-full">
      <div className="space-y-6">
        <div className="space-y-2">
          <h2 className="text-3xl font-semibold tracking-tight">EXTRASTAFF360 PLATFORM</h2>
          <p className="text-muted-foreground">
            Connecting Companies, Agencies, and Staff on One Platform
          </p>
        </div>

        {/* User Group Buttons */}
        <div className="grid grid-cols-3 gap-4">
          {(['companies', 'agencies', 'staff'] as const).map((type) => (
            <Button
              key={type}
              type="button"
              variant={userType === type ? "default" : "outline"}
              className="w-full capitalize"
              onClick={() => setUserType(type)}
            >
              {type}
            </Button>
          ))}
        </div>
      </div>

      <div className="mt-8 space-y-4">
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Email address
          </label>
          <Input
            id="email"
            placeholder="Enter your email"
            type="email"
            autoCapitalize="none"
            autoComplete="email"
            autoCorrect="off"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        
        <div className="space-y-2">
          <label htmlFor="password" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Password
          </label>
          <div className="relative">
            <Input
              id="password"
              placeholder="Enter your password"
              type={showPassword ? "text" : "password"}
              autoCapitalize="none"
              autoComplete="current-password"
              autoCorrect="off"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Button
              type="button"
              variant="ghost"
              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOffIcon className="h-4 w-4 text-muted-foreground" />
              ) : (
                <EyeIcon className="h-4 w-4 text-muted-foreground" />
              )}
              <span className="sr-only">
                {showPassword ? "Hide password" : "Show password"}
              </span>
            </Button>
          </div>
          <Link
            href="/forgot-password"
            className="text-sm text-primary hover:underline"
          >
            Forgot password?
          </Link>
        </div>

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Logging in..." : "Login"}
        </Button>

        <div className="space-y-4">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                or
              </span>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="terms" 
                checked={agreeToTerms}
                onCheckedChange={(checked) => setAgreeToTerms(checked as boolean)}
              />
              <label
                htmlFor="terms"
                className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                I agree to the{" "}
                <Link href="/terms" className="text-primary hover:underline">
                  Terms & Privacy
                </Link>
              </label>
            </div>

            <Button variant="outline" className="w-full" onClick={() => alert('Google Sign Up not implemented')}>
              <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Sign up with Google
            </Button>
          </div>

          <p className="text-sm text-muted-foreground text-center mb-8">
            Don't have an account?{" "}
            <Link href="/signup" className="text-primary hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </form>
  )
}

