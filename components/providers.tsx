'use client'

import { ThemeProvider } from 'next-themes'
import { AuthProvider } from '@/lib/auth/auth-provider'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <AuthProvider>{children}</AuthProvider>
    </ThemeProvider>
  )
} 