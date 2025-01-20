"use client"

import { createContext, useContext } from 'react'
import { useSession, signIn, signOut } from "next-auth/react"
import { useRouter } from 'next/router'

interface AuthContextType {
  status: "authenticated" | "loading" | "unauthenticated"
  userType: string | null
  login: (email: string, password: string, userType: string) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession()
  const router = useRouter()

  const login = async (email: string, password: string, userType: string) => {
    const result = await signIn("credentials", {
      email,
      password,
      userType,
      redirect: false,
    })

    if (result?.error) {
      throw new Error(result.error)
    }

    router.push(`/${userType}-dashboard`)
  }

  const logout = async () => {
    await signOut({ redirect: false })
    router.push('/')
  }

  return (
    <AuthContext.Provider 
      value={{
        status,
        userType: session?.user?.userType ?? null,
        login,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

