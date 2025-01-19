'use client'

import { UserNav } from './user-nav'
import { ModeToggle } from '@/components/ui/mode-toggle'

interface HeaderProps {
  userRole: string | null
}

export function Header({ userRole }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-semibold">EXTRASTAFF360</h1>
        </div>
        <div className="flex items-center gap-4">
          <ModeToggle />
          <UserNav userRole={userRole} />
        </div>
      </div>
    </header>
  )
} 