import { createClient } from '@supabase/supabase-js'

export interface Company {
  id: string
  name: string
  industry?: string
  logo_url?: string
  website?: string
  primary_contact_name: string
  primary_contact_email: string
  primary_contact_phone?: string
  billing_address?: string
  payment_terms?: {
    type: string
    days: number
    method: string
  }
  verified: boolean
}

export interface Venue {
  id: string
  company_id: string
  name: string
  type: string
  address: string
  coordinates: {
    lat: number
    lng: number
  }
  contact_person: {
    name: string
    phone: string
    email: string
  }
  requirements: {
    minimumRating: number
    requiredSkills: string[]
    uniformCode: string[]
  }
}

export interface Shift {
  id: string
  venue_id: string
  start_time: Date
  end_time: Date
  staff_needed: number
  staff_assigned: number
  hourly_rate: number
  status: 'Scheduled' | 'In Progress' | 'Completed' | 'Cancelled'
  requirements: string[]
  notes?: string
}

export class CompanyService {
  private supabase

  constructor() {
    this.supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
  }

  // Company Profile Management
  async createCompany(userId: string, companyData: Partial<Company>) {
    const { data, error } = await this.supabase
      .from('companies')
      .insert({
        user_id: userId,
        ...companyData,
      })
      .select()
      .single()

    if (error) throw error
    return data
  }

  async updateCompany(companyId: string, updates: Partial<Company>) {
    const { data, error } = await this.supabase
      .from('companies')
      .update(updates)
      .eq('id', companyId)
      .select()
      .single()

    if (error) throw error
    return data
  }

  async getCompany(companyId: string): Promise<Company> {
    const { data, error } = await this.supabase
      .from('companies')
      .select('*')
      .eq('id', companyId)
      .single()

    if (error) throw error
    return data
  }

  // Venue Management
  async addVenue(companyId: string, venueData: Partial<Venue>) {
    const { data, error } = await this.supabase
      .from('venues')
      .insert({
        company_id: companyId,
        ...venueData,
      })
      .select()
      .single()

    if (error) throw error
    return data
  }

  async updateVenue(venueId: string, updates: Partial<Venue>) {
    const { data, error } = await this.supabase
      .from('venues')
      .update(updates)
      .eq('id', venueId)
      .select()
      .single()

    if (error) throw error
    return data
  }

  async getVenues(companyId: string): Promise<Venue[]> {
    const { data, error } = await this.supabase
      .from('venues')
      .select('*')
      .eq('company_id', companyId)

    if (error) throw error
    return data
  }

  // Shift Management
  async createShift(venueId: string, shiftData: Partial<Shift>) {
    const { data, error } = await this.supabase
      .from('shifts')
      .insert({
        venue_id: venueId,
        ...shiftData,
      })
      .select()
      .single()

    if (error) throw error
    return data
  }

  async updateShift(shiftId: string, updates: Partial<Shift>) {
    const { data, error } = await this.supabase
      .from('shifts')
      .update(updates)
      .eq('id', shiftId)
      .select()
      .single()

    if (error) throw error
    return data
  }

  async getShifts(companyId: string, status?: Shift['status']): Promise<Shift[]> {
    let query = this.supabase
      .from('shifts')
      .select(`
        *,
        venues!inner(company_id)
      `)
      .eq('venues.company_id', companyId)

    if (status) {
      query = query.eq('status', status)
    }

    const { data, error } = await query

    if (error) throw error
    return data
  }

  // Agency Relationships
  async getAgencyRelationships(companyId: string) {
    const { data, error } = await this.supabase
      .from('agency_company_relationships')
      .select(`
        *,
        agencies (*)
      `)
      .eq('company_id', companyId)

    if (error) throw error
    return data
  }

  // Staff Rating and Feedback
  async rateStaff(shiftId: string, staffId: string, rating: number, feedback?: string) {
    const { data, error } = await this.supabase
      .from('staff_ratings')
      .insert({
        shift_id: shiftId,
        staff_id: staffId,
        rating,
        feedback,
      })
      .select()
      .single()

    if (error) throw error
    return data
  }

  // Analytics and Reporting
  async getCompanyAnalytics(companyId: string, startDate: Date, endDate: Date) {
    const { data, error } = await this.supabase
      .rpc('get_company_analytics', {
        p_company_id: companyId,
        p_start_date: startDate.toISOString(),
        p_end_date: endDate.toISOString(),
      })

    if (error) throw error
    return data
  }

  // Payment Management
  async getPaymentHistory(companyId: string) {
    const { data, error } = await this.supabase
      .from('payments')
      .select(`
        *,
        shifts!inner(
          venues!inner(company_id)
        )
      `)
      .eq('shifts.venues.company_id', companyId)

    if (error) throw error
    return data
  }
} 