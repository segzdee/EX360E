'use client'

import { cn } from '@/lib/utils'
import { NavigationSection } from '@/lib/types/navigation'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Users,
  Calendar,
  FileText,
  MessageSquare,
  Settings,
  HelpCircle,
} from 'lucide-react'

interface SideNavProps {
  userRole: string | null
}

export function SideNav({ userRole }: SideNavProps) {
  const pathname = usePathname()

  const navigation: NavigationSection[] = [
    {
      title: 'Main',
      items: [
        {
          title: 'Dashboard',
          href: '/dashboard',
          icon: LayoutDashboard,
        },
        {
          title: 'Shifts',
          href: '/shifts',
          icon: Calendar,
        },
        {
          title: 'Messages',
          href: '/messages',
          icon: MessageSquare,
        },
      ],
    },
    {
      title: 'Management',
      items: [
        {
          title: 'Staff',
          href: '/staff',
          icon: Users,
          role: 'recruiter',
        },
        {
          title: 'Documents',
          href: '/documents',
          icon: FileText,
        },
      ],
    },
    {
      title: 'Settings',
      items: [
        {
          title: 'Account',
          href: '/settings',
          icon: Settings,
        },
        {
          title: 'Help',
          href: '/help',
          icon: HelpCircle,
        },
      ],
    },
  ]

  return (
    <nav className="w-64 min-h-screen bg-card border-r px-3 py-4">
      {navigation.map((section) => (
        <div key={section.title} className="mb-6">
          <h3 className="text-sm font-medium text-muted-foreground mb-2 px-4">
            {section.title}
          </h3>
          <ul className="space-y-1">
            {section.items.map((item) => {
              if (item.role && item.role !== userRole) return null

              const isActive = pathname === item.href
              const Icon = item.icon

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-4 py-2 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                    )}
                  >
                    {Icon && <Icon className="h-4 w-4" />}
                    {item.title}
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>
      ))}
    </nav>
  )
} 