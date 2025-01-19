import Link from 'next/link'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { Button } from '@/components/ui/button'
import { ArrowRight, Briefcase, Users, Building } from 'lucide-react'

export default async function Home() {
  const supabase = createServerComponentClient({ cookies })
  const { data: { session } } = await supabase.auth.getSession()

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-12 bg-gradient-to-b from-gray-50 to-white text-center px-4">
      <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
        Welcome to <span className="text-blue-600">EXTRASTAFF360</span>
      </h1>
      <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg md:mt-5 md:text-xl lg:mx-0 max-w-md mx-auto">
        Connecting Companies, Agencies, and Staff on One Powerful Platform
      </p>
      
      <div className="mt-8 space-y-4 sm:space-y-0 sm:flex sm:justify-center sm:space-x-4">
        {session ? (
          <Button asChild size="lg">
            <Link href="/dashboard">
              Go to Dashboard <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        ) : (
          <>
            <Button asChild size="lg">
              <Link href="/login">Log In</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/register">Sign Up</Link>
            </Button>
          </>
        )}
      </div>

      <div className="mt-16 grid gap-8 md:grid-cols-3 lg:gap-x-12">
        <div className="flex flex-col items-center">
          <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
            <Briefcase className="h-6 w-6" />
          </div>
          <h3 className="mt-4 text-lg font-medium">For Companies</h3>
          <p className="mt-2 text-base text-gray-500">
            Find the right staff for your hospitality needs quickly and efficiently.
          </p>
        </div>
        <div className="flex flex-col items-center">
          <div className="flex items-center justify-center h-12 w-12 rounded-md bg-green-500 text-white">
            <Users className="h-6 w-6" />
          </div>
          <h3 className="mt-4 text-lg font-medium">For Staff</h3>
          <p className="mt-2 text-base text-gray-500">
            Discover exciting job opportunities in the hospitality industry.
          </p>
        </div>
        <div className="flex flex-col items-center">
          <div className="flex items-center justify-center h-12 w-12 rounded-md bg-purple-500 text-white">
            <Building className="h-6 w-6" />
          </div>
          <h3 className="mt-4 text-lg font-medium">For Agencies</h3>
          <p className="mt-2 text-base text-gray-500">
            Streamline your staffing process and grow your business.
          </p>
        </div>
      </div>
    </div>
  )
}

