import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'

export type UserRole = 'agency' | 'company' | 'staff'

export interface AuthUser {
  id: string
  email: string
  role: UserRole
  status: string
}

export class AuthService {
  private supabase

  constructor() {
    this.supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
  }

  async signUp(email: string, password: string, role: UserRole) {
    const { data: auth, error: signUpError } = await this.supabase.auth.signUp({
      email,
      password,
    })

    if (signUpError) throw signUpError

    // Create user profile based on role
    const { error: insertError } = await this.supabase.from('users').insert({
      id: auth.user?.id,
      email,
      role,
    })

    if (insertError) throw insertError

    return auth
  }

  async signIn(email: string, password: string) {
    const { data, error } = await this.supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) throw error

    return data
  }

  async signOut() {
    const { error } = await this.supabase.auth.signOut()
    if (error) throw error
  }

  async getCurrentUser(): Promise<AuthUser | null> {
    const { data: { session }, error } = await this.supabase.auth.getSession()
    
    if (error || !session?.user) return null

    const { data: userData } = await this.supabase
      .from('users')
      .select('*')
      .eq('id', session.user.id)
      .single()

    return userData
  }

  async updatePassword(newPassword: string) {
    const { error } = await this.supabase.auth.updateUser({
      password: newPassword,
    })

    if (error) throw error
  }

  async resetPassword(email: string) {
    const { error } = await this.supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })

    if (error) throw error
  }

  // Role-based authorization
  async checkPermission(userId: string, requiredRole: UserRole): Promise<boolean> {
    const { data: user } = await this.supabase
      .from('users')
      .select('role')
      .eq('id', userId)
      .single()

    return user?.role === requiredRole
  }

  // Middleware to protect routes
  async requireAuth(requiredRole?: UserRole) {
    const user = await this.getCurrentUser()
    
    if (!user) {
      throw new Error('Authentication required')
    }

    if (requiredRole && user.role !== requiredRole) {
      throw new Error('Unauthorized access')
    }

    return user
  }
} 