'use client'

import { useState } from 'react'
import { Tabs, TabsList, TabsTrigger } from './ui/tabs'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { Eye, EyeOff } from 'lucide-react'

export function AuthForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [userType, setUserType] = useState('staff')

  return (
    <div className="w-full">
      <Tabs value={userType} onValueChange={setUserType} className="mb-6">
        <TabsList className="grid grid-cols-3 w-full">
          <TabsTrigger value="companies">Companies</TabsTrigger>
          <TabsTrigger value="agencies">Agencies</TabsTrigger>
          <TabsTrigger value="staff">Staff</TabsTrigger>
        </TabsList>
      </Tabs>

      <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
        <div>
          <Input
            type="email"
            placeholder="Enter your email"
            className="w-full"
          />
        </div>
        <div className="relative">
          <Input
            type={showPassword ? 'text' : 'password'}
            placeholder="Enter your password"
            className="w-full"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        <Button type="submit" className="w-full">
          Login
        </Button>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-background px-2 text-muted-foreground">OR</span>
          </div>
        </div>

        <Button variant="outline" className="w-full" type="button">
          <img 
            src="/google.svg" 
            alt="Google" 
            className="w-5 h-5 mr-2"
            width={20}
            height={20}
          />
          Sign up with Google
        </Button>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="terms"
            className="rounded border-gray-300"
          />
          <label htmlFor="terms" className="text-sm text-muted-foreground">
            I agree to the Terms & Privacy
          </label>
        </div>

        <div className="text-center text-sm text-muted-foreground">
          Don't have an account?
          <Button variant="link" className="pl-1">Sign up</Button>
        </div>
      </form>
    </div>
  )
}