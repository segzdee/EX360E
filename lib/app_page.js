import Image from 'next/image'
import Link from 'next/link'
import { LoginForm } from '@/components/login-form'
import { cn } from '@/lib/utils'
import { BarChart, LineChart, DollarSign, Users, Calendar, TrendingUp } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left Column - Login Form */}
      <div className="p-8 lg:p-12 xl:p-16 flex flex-col justify-between min-h-screen">
        <div>
          <Link href="/" className="inline-block mb-12">
            <Image
              src="/images/logo.png"
              alt="EXTRASTAFF360 Logo"
              width={180}
              height={90}
              priority
              className="h-12 w-auto"
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
          
          {/* Dashboard Preview */}
          <div className="mt-8 bg-white/10 backdrop-blur-sm rounded-xl p-6 space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: Users, label: "Active Staff", value: "1,234", change: "+12%" },
                { icon: Calendar, label: "Shifts", value: "856", change: "+8%" },
                { icon: DollarSign, label: "Revenue", value: "$45.2K", change: "+15%" },
                { icon: TrendingUp, label: "Growth", value: "23%", change: "+5%" }
              ].map((stat, i) => (
                <div key={i} className="bg-white/10 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <stat.icon className="h-5 w-5 text-blue-200" />
                    <span className="text-xs text-green-400">{stat.change}</span>
                  </div>
                  <div className="mt-2">
                    <h3 className="text-2xl font-bold">{stat.value}</h3>
                    <p className="text-sm text-blue-200">{stat.label}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Charts */}
            <div className="grid grid-cols-2 gap-4">
              {/* Bar Chart */}
              <div className="bg-white/10 rounded-lg p-4">
                <h3 className="text-sm font-medium mb-4">Weekly Performance</h3>
                <div className="h-32 flex items-end justify-between gap-2">
                  {[40, 70, 45, 90, 65, 45, 80].map((height, i) => (
                    <div key={i} className="w-full">
                      <div 
                        className="bg-blue-400/50 rounded-t hover:bg-blue-400/70 transition-all"
                        style={{ height: `${height}%` }}
                      />
                    </div>
                  ))}
                </div>
                <div className="flex justify-between mt-2 text-xs text-blue-200">
                  <span>Mon</span>
                  <span>Tue</span>
                  <span>Wed</span>
                  <span>Thu</span>
                  <span>Fri</span>
                  <span>Sat</span>
                  <span>Sun</span>
                </div>
              </div>

              {/* Line Chart */}
              <div className="bg-white/10 rounded-lg p-4">
                <h3 className="text-sm font-medium mb-4">Monthly Trend</h3>
                <div className="h-32 relative">
                  <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <path
                      d="M0,50 Q25,20 50,50 T100,50"
                      fill="none"
                      stroke="rgba(96, 165, 250, 0.5)"
                      strokeWidth="2"
                    />
                  </svg>
                  {/* Data points */}
                  {[50, 80, 50, 50].map((top, i) => (
                    <div
                      key={i}
                      className="absolute w-2 h-2 bg-blue-400 rounded-full"
                      style={{
                        left: `${i * 33.33}%`,
                        top: `${top}%`,
                        transform: 'translate(-50%, -50%)'
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Wall Street Style Ticker */}
        <div className="w-full bg-[#0047B3]/40 backdrop-blur-sm rounded-lg overflow-hidden border border-blue-400/20">
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

