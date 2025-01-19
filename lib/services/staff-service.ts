import { createClient } from '@supabase/supabase-js'

export interface StaffProfile {
  id: string
  agency_id: string
  name: string
  email: string
  phone: string
  profile_image_url?: string
  date_of_birth: Date
  emergency_contact: {
    name: string
    relationship: string
    phone: string
  }
  skills: string[]
  certifications: Array<{
    type: string
    number: string
    expiry_date: Date
    verified: boolean
  }>
  rating: number
  status: 'Available' | 'On Shift' | 'Off Duty' | 'On Break'
  shifts_completed: number
  hourly_rate: number
  preferred_locations: Array<{
    lat: number
    lng: number
  }>
  max_travel_distance: number
}

export interface StaffPreferences {
  preferred_shift_duration: number[]
  preferred_shift_times: {
    weekday: boolean[]
    start_time: string
    end_time: string
  }
  blacklisted_venues: string[]
  notification_preferences: {
    email: boolean
    sms: boolean
    push: boolean
    shift_reminders: boolean
    payment_notifications: boolean
  }
}

export interface ShiftAssignment {
  id: string
  shift_id: string
  staff_id: string
  status: 'Scheduled' | 'Checked In' | 'Checked Out' | 'Cancelled'
  check_in_time?: Date
  check_out_time?: Date
  break_start?: Date
  break_end?: Date
}

export class StaffService {
  private supabase

  constructor() {
    this.supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
  }

  // Profile Management
  async createStaffProfile(userId: string, profileData: Partial<StaffProfile>) {
    const { data, error } = await this.supabase
      .from('staff')
      .insert({
        user_id: userId,
        ...profileData,
      })
      .select()
      .single()

    if (error) throw error
    return data
  }

  async updateStaffProfile(staffId: string, updates: Partial<StaffProfile>) {
    const { data, error } = await this.supabase
      .from('staff')
      .update(updates)
      .eq('id', staffId)
      .select()
      .single()

    if (error) throw error
    return data
  }

  async getStaffProfile(staffId: string): Promise<StaffProfile> {
    const { data, error } = await this.supabase
      .from('staff')
      .select('*')
      .eq('id', staffId)
      .single()

    if (error) throw error
    return data
  }

  // Document Management
  async uploadDocument(staffId: string, file: File, type: string) {
    const fileName = `${staffId}/${type}/${file.name}`
    const { error: uploadError } = await this.supabase.storage
      .from('staff-documents')
      .upload(fileName, file)

    if (uploadError) throw uploadError

    const { data: document, error: docError } = await this.supabase
      .from('staff_documents')
      .insert({
        staff_id: staffId,
        type,
        file_url: fileName,
        status: 'Pending',
      })
      .select()
      .single()

    if (docError) throw docError
    return document
  }

  // Availability Management
  async updateAvailability(staffId: string, preferences: StaffPreferences) {
    const { data, error } = await this.supabase
      .from('staff_preferences')
      .upsert({
        staff_id: staffId,
        ...preferences,
      })
      .select()
      .single()

    if (error) throw error
    return data
  }

  // Shift Management
  async getAvailableShifts(staffId: string) {
    const staff = await this.getStaffProfile(staffId)
    
    const { data, error } = await this.supabase
      .rpc('get_matching_shifts', {
        p_staff_id: staffId,
        p_max_distance: staff.max_travel_distance,
        p_required_skills: staff.skills,
      })

    if (error) throw error
    return data
  }

  async acceptShift(staffId: string, shiftId: string) {
    const { data, error } = await this.supabase
      .from('shift_assignments')
      .insert({
        staff_id: staffId,
        shift_id: shiftId,
        status: 'Scheduled',
      })
      .select()
      .single()

    if (error) throw error
    return data
  }

  async checkIn(assignmentId: string) {
    const { data, error } = await this.supabase
      .from('shift_assignments')
      .update({
        status: 'Checked In',
        check_in_time: new Date().toISOString(),
      })
      .eq('id', assignmentId)
      .select()
      .single()

    if (error) throw error
    return data
  }

  async checkOut(assignmentId: string) {
    const { data, error } = await this.supabase
      .from('shift_assignments')
      .update({
        status: 'Checked Out',
        check_out_time: new Date().toISOString(),
      })
      .eq('id', assignmentId)
      .select()
      .single()

    if (error) throw error
    return data
  }

  async startBreak(assignmentId: string) {
    const { data, error } = await this.supabase
      .from('shift_assignments')
      .update({
        break_start: new Date().toISOString(),
      })
      .eq('id', assignmentId)
      .select()
      .single()

    if (error) throw error
    return data
  }

  async endBreak(assignmentId: string) {
    const { data, error } = await this.supabase
      .from('shift_assignments')
      .update({
        break_end: new Date().toISOString(),
      })
      .eq('id', assignmentId)
      .select()
      .single()

    if (error) throw error
    return data
  }

  // Payment Management
  async getPaymentHistory(staffId: string) {
    const { data, error } = await this.supabase
      .from('payments')
      .select('*')
      .eq('staff_id', staffId)

    if (error) throw error
    return data
  }

  // Performance and Ratings
  async getRatings(staffId: string) {
    const { data, error } = await this.supabase
      .from('staff_ratings')
      .select('*')
      .eq('staff_id', staffId)

    if (error) throw error
    return data
  }

  // Notifications
  async updateNotificationPreferences(staffId: string, preferences: StaffPreferences['notification_preferences']) {
    const { data, error } = await this.supabase
      .from('staff_preferences')
      .update({
        notification_preferences: preferences,
      })
      .eq('staff_id', staffId)
      .select()
      .single()

    if (error) throw error
    return data
  }
} 