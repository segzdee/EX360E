'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { createClientComponentClient, User } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
import { LoadingSpinner } from '@/components/ui/loading-spinner'

type AuthContextType = {
  user: User | null
  loading: boolean
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  // Check for required environment variables
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    console.error('Missing NEXT_PUBLIC_SUPABASE_URL')
    return <div>Error: Missing Supabase URL configuration</div>
  }

  if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    console.error('Missing NEXT_PUBLIC_SUPABASE_ANON_KEY')
    return <div>Error: Missing Supabase Anon Key configuration</div>
  }

  const supabase = createClientComponentClient()

  useEffect(() => {
    try {
      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange((event, session) => {
        setUser(session?.user ?? null)
        setLoading(false)
        if (event === 'SIGNED_IN') {
          router.refresh()
        }
        if (event === 'SIGNED_OUT') {
          router.refresh()
          router.push('/login')
        }
      })

      return () => {
        subscription.unsubscribe()
      }
    } catch (err) {
      console.error('Auth error:', err)
      setError(err instanceof Error ? err.message : 'Authentication error')
      setLoading(false)
    }
  }, [router, supabase])

  if (error) {
    return <div>Error: {error}</div>
  }

  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
} 