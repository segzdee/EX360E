import { createClient } from '@supabase/supabase-js'

export interface Agency {
  id: string
  name: string
  description?: string
  logo_url?: string
  website?: string
  contact_email: string
  contact_phone?: string
  address?: string
  subscription_status: 'trial' | 'active' | 'suspended' | 'cancelled'
  subscription_end_date?: Date
  settings: Record<string, any>
}

export interface StaffMember {
  id: string
  name: string
  email: string
  phone?: string
  skills: string[]
  rating: number
  status: 'Available' | 'On Shift' | 'Off Duty' | 'On Break'
  hourly_rate: number
}

export class AgencyService {
  private supabase

  constructor() {
    this.supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
  }

  // Agency Profile Management
  async createAgency(userId: string, agencyData: Partial<Agency>) {
    const { data, error } = await this.supabase
      .from('agencies')
      .insert({
        user_id: userId,
        ...agencyData,
      })
      .select()
      .single()

    if (error) throw error
    return data
  }

  async updateAgency(agencyId: string, updates: Partial<Agency>) {
    const { data, error } = await this.supabase
      .from('agencies')
      .update(updates)
      .eq('id', agencyId)
      .select()
      .single()

    if (error) throw error
    return data
  }

  async getAgency(agencyId: string): Promise<Agency> {
    const { data, error } = await this.supabase
      .from('agencies')
      .select('*')
      .eq('id', agencyId)
      .single()

    if (error) throw error
    return data
  }

  // Staff Management
  async addStaffMember(agencyId: string, staffData: Partial<StaffMember>) {
    const { data, error } = await this.supabase
      .from('staff')
      .insert({
        agency_id: agencyId,
        ...staffData,
      })
      .select()
      .single()

    if (error) throw error
    return data
  }

  async updateStaffMember(staffId: string, updates: Partial<StaffMember>) {
    const { data, error } = await this.supabase
      .from('staff')
      .update(updates)
      .eq('id', staffId)
      .select()
      .single()

    if (error) throw error
    return data
  }

  async getStaffMembers(agencyId: string): Promise<StaffMember[]> {
    const { data, error } = await this.supabase
      .from('staff')
      .select('*')
      .eq('agency_id', agencyId)

    if (error) throw error
    return data
  }

  // Company Relationships
  async getCompanyRelationships(agencyId: string) {
    const { data, error } = await this.supabase
      .from('agency_company_relationships')
      .select(`
        *,
        companies (*)
      `)
      .eq('agency_id', agencyId)

    if (error) throw error
    return data
  }

  async createCompanyRelationship(agencyId: string, companyId: string) {
    const { data, error } = await this.supabase
      .from('agency_company_relationships')
      .insert({
        agency_id: agencyId,
        company_id: companyId,
      })
      .select()
      .single()

    if (error) throw error
    return data
  }

  // Analytics
  async getAgencyAnalytics(agencyId: string, startDate: Date, endDate: Date) {
    const { data, error } = await this.supabase
      .rpc('get_agency_analytics', {
        p_agency_id: agencyId,
        p_start_date: startDate.toISOString(),
        p_end_date: endDate.toISOString(),
      })

    if (error) throw error
    return data
  }

  // Subscription Management
  async updateSubscription(agencyId: string, status: Agency['subscription_status'], endDate: Date) {
    const { data, error } = await this.supabase
      .from('agencies')
      .update({
        subscription_status: status,
        subscription_end_date: endDate,
      })
      .eq('id', agencyId)
      .select()
      .single()

    if (error) throw error
    return data
  }

  // Settings Management
  async updateSettings(agencyId: string, settings: Record<string, any>) {
    const { data, error } = await this.supabase
      .from('agencies')
      .update({ settings })
      .eq('id', agencyId)
      .select()
      .single()

    if (error) throw error
    return data
  }
} 