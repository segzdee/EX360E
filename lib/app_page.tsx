import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { LoginForm } from '@/components/login-form'
import { StatsDisplay } from '@/components/stats-display'
import { Logo } from '@/components/logo'
import Link from 'next/link'

export default async function Home() {
  const supabase = createServerComponentClient({ cookies })
  const { data: { session } } = await supabase.auth.getSession()

  return (
    <div className="flex min-h-screen">
      {/* Left Section */}
      <div className="flex flex-col justify-center items-center w-full lg:w-1/2 bg-background p-8">
        <Logo className="mb-8 w-12 h-12" />
        <h1 className="text-2xl font-bold mb-4">EXTRASTAFF360 PLATFORM</h1>
        <p className="text-muted-foreground mb-6 text-center">
          Connecting Companies, Agencies, and Staff on One Platform
        </p>
        <LoginForm />
        <footer className="text-[8px] text-muted-foreground mt-8 text-center">
          <p>© 2025 EXTRASTAFF360 ™️ | HOSPITALITY PLATFORM ©️</p>
          <div className="flex justify-center space-x-2 mt-1">
            <Link href="/terms" className="hover:underline">Terms of Service</Link>
            <Link href="/privacy" className="hover:underline">Privacy</Link>
            <Link href="/cookies" className="hover:underline">Cookies Policy</Link>
            <Link href="/contact" className="hover:underline">Contact Us</Link>
          </div>
        </footer>
      </div>

      {/* Right Section */}
      <div className="hidden lg:flex flex-col justify-center items-center w-1/2 bg-primary text-primary-foreground p-8">
        <h2 className="text-3xl font-bold mb-6 text-center">
          Powering Hospitality, One Extra Staff at a Time
        </h2>
        <p className="text-lg mb-8 text-center">
          Your Ideal Shift or Staff is Just a Click Away
        </p>
        <StatsDisplay />
      </div>
    </div>
  )
}

