import Image from 'next/image'
import Link from 'next/link'
import { LoginForm } from '@/components/login-form'
import { cn } from '@/lib/utils'

export default function LandingPage() {
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left Column - Login Form */}
      <div className="p-8 lg:p-12 xl:p-16 flex flex-col justify-between min-h-screen">
        <div>
          <Link href="/" className="inline-block mb-12">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/extrastaff360%20logo-JdskdU8TbsGsxhakLnUZGqCVdrVZgb.svg"
              alt="EXTRASTAFF360 Logo"
              width={180}
              height={90}
              priority
            />
          </Link>
          
          <LoginForm />
        </div>
        
        <footer className="text-[8px] text-muted-foreground mt-auto pt-8 px-4">
          <div className="flex flex-wrap justify-start gap-x-2 gap-y-1">
            <span>© 2025 EXTRASTAFF360 ™️ | HOSPITALITY PLATFORM ©️</span>
            <span>
              <Link href="/terms" className="hover:underline">Terms of Service</Link> | 
              <Link href="/privacy" className="hover:underline">Privacy</Link> | 
              <Link href="/cookies" className="hover:underline">Cookies Policy</Link> | 
              <Link href="/contact" className="hover:underline">Contact Us</Link>
            </span>
            <span>
              <Link href="/support" className="hover:underline">Support</Link> | 
              <Link href="/help" className="hover:underline">Help Center</Link> | 
              <Link href="/accessibility" className="hover:underline">Accessibility</Link> | 
              <Link href="/newsletter" className="hover:underline">Subscribe to Our Newsletter</Link>
            </span>
          </div>
        </footer>
      </div>

      {/* Right Column - Hero Content */}
      <div className="hidden lg:flex flex-col justify-between p-12 xl:p-16 bg-[#0047B3] text-white">
        <div className="space-y-6">
          <h1 className="text-4xl xl:text-5xl font-bold tracking-tight">
            Powering Hospitality, One Extra Staff at a Time
          </h1>
          <p className="text-blue-100 text-xl">
            Your Ideal Shift or Staff is Just a Click Away
          </p>
          
          <div className="mt-8">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/TimeTracker%20-%20Sign%20Up:Sign%20In%20Page%20by%20Rafiqur%20Rahman%20for%20Filllo%20Design%20Agency%20on%20Dribbble%202025-01-18%2002-21-32.jpg-IZgx0eYJSLOqFyfRkjULB4BgW2wXfH.jpeg"
              alt="Dashboard Preview"
              width={800}
              height={600}
              className="rounded-lg shadow-2xl"
              priority
            />
          </div>
        </div>

        {/* Wall Street Style Ticker */}
        <div className="w-full bg-blue-900/40 backdrop-blur-sm rounded-lg overflow-hidden">
          <div className="flex items-center h-16">
            <div className="animate-marquee whitespace-nowrap flex items-center gap-8 px-4">
              {[
                { label: 'Active Jobs', value: '+2,145', change: '+12.5%' },
                { label: 'Staff Placed', value: '15,890', change: '+8.3%' },
                { label: 'Companies', value: '450', change: '+15.2%' },
                { label: 'Agencies', value: '280', change: '+10.1%' },
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <span className="font-medium">{item.label}</span>
                  <span className="font-bold">{item.value}</span>
                  <span className={cn(
                    "text-sm",
                    item.change.startsWith('+') ? 'text-green-400' : 'text-red-400'
                  )}>{item.change}</span>
                  <span className="text-blue-300 mx-4">|</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

