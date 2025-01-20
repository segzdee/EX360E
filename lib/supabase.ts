export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          full_name: string | null
          avatar_url: string | null
          user_type: 'company' | 'agency' | 'staff'
          bio: string | null
          location: string | null
        }
        Insert: {
          id: string
          created_at?: string
          updated_at?: string
          full_name?: string | null
          avatar_url?: string | null
          user_type: 'company' | 'agency' | 'staff'
          bio?: string | null
          location?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          full_name?: string | null
          avatar_url?: string | null
          user_type?: 'company' | 'agency' | 'staff'
          bio?: string | null
          location?: string | null
        }
      }
      jobs: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          title: string
          description: string
          company_id: string
          location: string
          salary_range: string | null
          job_type: 'full_time' | 'part_time' | 'contract' | 'temporary'
          status: 'open' | 'closed' | 'filled'
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          title: string
          description: string
          company_id: string
          location: string
          salary_range?: string | null
          job_type: 'full_time' | 'part_time' | 'contract' | 'temporary'
          status?: 'open' | 'closed' | 'filled'
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          title?: string
          description?: string
          company_id?: string
          location?: string
          salary_range?: string | null
          job_type?: 'full_time' | 'part_time' | 'contract' | 'temporary'
          status?: 'open' | 'closed' | 'filled'
        }
      }
      applications: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          job_id: string
          applicant_id: string
          status: 'pending' | 'reviewed' | 'accepted' | 'rejected'
          cover_letter: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          job_id: string
          applicant_id: string
          status?: 'pending' | 'reviewed' | 'accepted' | 'rejected'
          cover_letter?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          job_id?: string
          applicant_id?: string
          status?: 'pending' | 'reviewed' | 'accepted' | 'rejected'
          cover_letter?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

