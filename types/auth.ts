export type UserRole = 'agency' | 'venue' | 'staff'

export interface User {
  id: string
  email: string
  role: UserRole
  created_at: string
  updated_at: string
}

export interface Session {
  user: User
  access_token: string
  refresh_token: string
} 