// app/dashboard/layout.tsx
import { Sidebar } from '@/components/dashboard/Sidebar'
import { TopBar } from '@/components/dashboard/TopBar'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-100">
      <TopBar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  )
}

// components/dashboard/TopBar.tsx
'use client'

import { useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import Link from 'next/link'

export function TopBar() {
  const { user, signOut } = useAuth()
  const [isProfileOpen, setIsProfileOpen] = useState(false)

  return (
    <header className="bg-white shadow">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex-shrink-0">
            <Link href="/dashboard" className="text-xl font-bold">
              Extrastaff360
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center"
              >
                <span className="text-sm">{user?.email}</span>
              </button>
              
              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg">
                  <Link
                    href="/profile"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Profile Settings
                  </Link>
                  <button
                    onClick={() => signOut()}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

// components/dashboard/Sidebar.tsx
'use client'

import { useAuth } from '@/context/AuthContext'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function Sidebar() {
  const { profile } = useAuth()
  const pathname = usePathname()

  const companyLinks = [
    { href: '/dashboard/company', label: 'Overview' },
    { href: '/dashboard/company/shifts', label: 'Shifts' },
    { href: '/dashboard/company/staff', label: 'Staff' },
    { href: '/dashboard/company/finance', label: 'Finance' },
  ]

  const freelancerLinks = [
    { href: '/dashboard/freelancer', label: 'Overview' },
    { href: '/dashboard/freelancer/shifts', label: 'Find Shifts' },
    { href: '/dashboard/freelancer/availability', label: 'Availability' },
    { href: '/dashboard/freelancer/earnings', label: 'Earnings' },
  ]

  const recruiterLinks = [
    { href: '/dashboard/recruiter', label: 'Overview' },
    { href: '/dashboard/recruiter/staff', label: 'Staff' },
    { href: '/dashboard/recruiter/clients', label: 'Clients' },
    { href: '/dashboard/recruiter/shifts', label: 'Shifts' },
    { href: '/dashboard/recruiter/finance', label: 'Finance' },
  ]

  const links = {
    company: companyLinks,
    freelancer: freelancerLinks,
    recruiter: recruiterLinks,
  }[profile?.role || 'freelancer']

  return (
    <aside className="w-64 bg-white shadow-sm min-h-screen">
      <nav className="p-4 space-y-1">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`block px-4 py-2 rounded-md text-sm font-medium ${
              pathname === link.href
                ? 'bg-blue-50 text-blue-700'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </aside>
  )
}