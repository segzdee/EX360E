'use client'

import { useState } from 'react'
import Link from 'next/link'
import { SEO } from '@/components/SEO'
import { ShiftTicker } from '@/components/ShiftTicker'

export default function LandingPage() {
  const [activeTab, setActiveTab] = useState('staff')

  const handleTabClick = (tab: string) => {
    setActiveTab(tab)
  }

  return (
    <>
      <SEO 
        title="Enter the Future of Flexible Staffing"
        description="ExtraStaff360: Connecting Talent with Opportunities for Staff, Companies, and Agencies"
        canonical="https://extrastaff360.com"
      />
      <div className="min-h-screen w-screen flex flex-col justify-between bg-gradient-to-b from-gray-50 to-gray-100 text-gray-800 font-sans overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-green-50 to-transparent opacity-50"></div>
        
        <div className="w-full z-10">
          <ShiftTicker />
        </div>
        
        <div className="relative z-10 w-full flex-grow flex flex-col items-center justify-center px-4 py-12">
          <div className="mb-8 text-4xl font-bold text-green-600">
            ExtraStaff360
          </div>
          
          <div className="text-center mb-8">
            <h1 className="text-4xl lg:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-green-400">
              Enter the Future of Flexible Staffing
            </h1>
            <p className="text-sm lg:text-lg text-gray-600 mt-2">
              Connecting Talent with Opportunities for Staff, Companies, and Agencies
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 w-96 max-w-full">
            <h2 className="text-xl font-semibold mb-4 text-center text-gray-800">Login to Your Account</h2>
            
            <div className="flex justify-between space-x-2 mb-6">
              {['staff', 'company', 'agency'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => handleTabClick(tab)}
                  className={`w-full py-2 rounded-lg transition-colors duration-200 ${
                    activeTab === tab
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>

            <form className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  id="email"
                  className="w-full border border-gray-200 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="you@example.com"
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input
                  type="password"
                  id="password"
                  className="w-full border border-gray-200 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Enter your password"
                />
              </div>
              <div className="flex justify-between items-center">
                <Link href="/forgot-password" className="text-sm text-green-600 hover:text-green-700 hover:underline">
                  Forgot Password?
                </Link>
              </div>
              
              <button
                type="submit"
                className="w-full bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors duration-200"
              >
                Sign In
              </button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 text-gray-500 bg-white">Or continue with</span>
                </div>
              </div>

              <button
                type="button"
                className="w-full flex items-center justify-center gap-2 bg-white border border-gray-200 text-gray-600 py-2 px-4 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200 focus:ring-offset-2 transition-colors duration-200"
              >
                <span>Sign in with Google</span>
              </button>

              <p className="text-sm text-gray-600 text-center">
                Don't have an account?{' '}
                <Link href="/signup" className="text-green-600 hover:text-green-700 hover:underline">
                  Sign up
                </Link>
              </p>
            </form>
          </div>
        </div>

        <div className="w-full px-4 py-4 bg-white shadow-md z-10">
          <div className="text-center text-gray-600 text-xs space-y-2">
            <div>
              © 2025 EXTRASTAFF360™️ | EXTRA SHIFTS | EXTRA STAFF PLATFORM
            </div>
            <div className="space-x-3">
              <Link href="/terms" className="hover:text-gray-800 transition-colors duration-200">Terms of Service</Link>
              <span>|</span>
              <Link href="/privacy" className="hover:text-gray-800 transition-colors duration-200">Privacy</Link>
              <span>|</span>
              <Link href="/cookies" className="hover:text-gray-800 transition-colors duration-200">Cookies Policy</Link>
              <span>|</span>
              <Link href="/contact" className="hover:text-gray-800 transition-colors duration-200">Contact us</Link>
              <span>|</span>
              <Link href="/blog" className="hover:text-gray-800 transition-colors duration-200">Blog</Link>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

