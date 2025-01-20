'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'
import { usePerformanceMetrics } from '@/hooks/usePerformanceMetrics'
import { AIInsights } from '@/components/dashboard/AIInsights'
import { ShiftTicker } from '@/components/ShiftTicker'
import { Users, Building2, Briefcase, AlertCircle, DollarSign, Shield, Activity, Settings, Bell, Search, ChevronDown, BarChart2 } from 'lucide-react'

export default function SuperAdminDashboard() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const metrics = usePerformanceMetrics()

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login')
    }
  }, [status, router])

  if (status === 'loading') {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-indigo-900 text-white">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold">EXTRASTAFF360</h1>
              <span className="px-3 py-1 text-xs bg-indigo-700 rounded-full">Super Admin</span>
            </div>
            <div className="flex items-center space-x-6">
              <Bell className="w-6 h-6" />
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 rounded-full bg-indigo-700" />
                <ChevronDown className="w-4 h-4" />
              </div>
            </div>
          </div>
        </div>
      </header>

      <ShiftTicker />

      <div className="flex">
        <aside className="w-64 bg-white h-screen shadow-lg">
          <nav className="mt-8">
            <div className="px-4 py-2 text-xs font-semibold text-gray-600">MONITORING</div>
            <a className="flex items-center px-6 py-3 text-gray-700 bg-indigo-50 border-r-4 border-indigo-600">
              <Activity className="w-5 h-5 mr-3" />
              Platform Overview
            </a>
            {/* Add more sidebar items here */}
          </nav>
        </aside>

        <main className="flex-1 p-8">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800">AI-Enhanced Platform Overview</h2>
            <p className="text-gray-600">Real-time monitoring with predictive analytics</p>
          </div>

          <div className="mb-8">
            <AIInsights 
              metrics={metrics}
              predictions={metrics.predictions}
              anomalies={metrics.anomalies}
            />
          </div>

          {/* Additional dashboard content */}
        </main>
      </div>
    </div>
  )
}

