import { createClient } from '@supabase/supabase-js'

export interface AgencyAnalytics {
  revenue: {
    total: number
    growth: number
    byMonth: Array<{
      month: string
      value: number
    }>
  }
  staff: {
    total: number
    active: number
    utilization: number
    performance: Array<{
      id: string
      name: string
      rating: number
      shifts_completed: number
      revenue_generated: number
    }>
  }
  shifts: {
    total: number
    completed: number
    cancelled: number
    upcoming: number
    byStatus: Record<string, number>
    byVenue: Array<{
      venue_id: string
      venue_name: string
      total_shifts: number
      total_revenue: number
    }>
  }
  clients: {
    total: number
    active: number
    new: number
    byIndustry: Record<string, number>
  }
}

export interface CompanyAnalytics {
  spending: {
    total: number
    byMonth: Array<{
      month: string
      value: number
    }>
    byVenue: Array<{
      venue_id: string
      venue_name: string
      total_spent: number
    }>
  }
  shifts: {
    total: number
    completed: number
    cancelled: number
    staffing_rate: number
    byStatus: Record<string, number>
  }
  staff: {
    total_worked: number
    average_rating: number
    top_performers: Array<{
      id: string
      name: string
      rating: number
      shifts_completed: number
    }>
  }
  venues: {
    total: number
    active: number
    performance: Array<{
      id: string
      name: string
      total_shifts: number
      average_rating: number
      total_spent: number
    }>
  }
}

export interface StaffAnalytics {
  earnings: {
    total: number
    byMonth: Array<{
      month: string
      value: number
    }>
    byVenue: Array<{
      venue_id: string
      venue_name: string
      total_earned: number
    }>
  }
  shifts: {
    total: number
    completed: number
    cancelled: number
    upcoming: number
    byStatus: Record<string, number>
  }
  performance: {
    average_rating: number
    total_hours: number
    ratings_breakdown: Record<number, number>
    feedback: Array<{
      shift_id: string
      rating: number
      comment: string
      date: Date
    }>
  }
  availability: {
    utilization_rate: number
    preferred_venues: string[]
    common_shift_times: Array<{
      day: string
      start_time: string
      end_time: string
      frequency: number
    }>
  }
}

export class AnalyticsService {
  private supabase

  constructor() {
    this.supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
  }

  // Agency Analytics
  async getAgencyAnalytics(agencyId: string, startDate: Date, endDate: Date): Promise<AgencyAnalytics> {
    const { data, error } = await this.supabase
      .rpc('get_agency_analytics', {
        p_agency_id: agencyId,
        p_start_date: startDate.toISOString(),
        p_end_date: endDate.toISOString(),
      })

    if (error) throw error
    return data
  }

  async getAgencyStaffPerformance(agencyId: string, startDate: Date, endDate: Date) {
    const { data, error } = await this.supabase
      .rpc('get_agency_staff_performance', {
        p_agency_id: agencyId,
        p_start_date: startDate.toISOString(),
        p_end_date: endDate.toISOString(),
      })

    if (error) throw error
    return data
  }

  async getAgencyVenueAnalytics(agencyId: string, startDate: Date, endDate: Date) {
    const { data, error } = await this.supabase
      .rpc('get_agency_venue_analytics', {
        p_agency_id: agencyId,
        p_start_date: startDate.toISOString(),
        p_end_date: endDate.toISOString(),
      })

    if (error) throw error
    return data
  }

  // Company Analytics
  async getCompanyAnalytics(companyId: string, startDate: Date, endDate: Date): Promise<CompanyAnalytics> {
    const { data, error } = await this.supabase
      .rpc('get_company_analytics', {
        p_company_id: companyId,
        p_start_date: startDate.toISOString(),
        p_end_date: endDate.toISOString(),
      })

    if (error) throw error
    return data
  }

  async getCompanyVenuePerformance(companyId: string, startDate: Date, endDate: Date) {
    const { data, error } = await this.supabase
      .rpc('get_company_venue_performance', {
        p_company_id: companyId,
        p_start_date: startDate.toISOString(),
        p_end_date: endDate.toISOString(),
      })

    if (error) throw error
    return data
  }

  async getCompanyStaffAnalytics(companyId: string, startDate: Date, endDate: Date) {
    const { data, error } = await this.supabase
      .rpc('get_company_staff_analytics', {
        p_company_id: companyId,
        p_start_date: startDate.toISOString(),
        p_end_date: endDate.toISOString(),
      })

    if (error) throw error
    return data
  }

  // Staff Analytics
  async getStaffAnalytics(staffId: string, startDate: Date, endDate: Date): Promise<StaffAnalytics> {
    const { data, error } = await this.supabase
      .rpc('get_staff_analytics', {
        p_staff_id: staffId,
        p_start_date: startDate.toISOString(),
        p_end_date: endDate.toISOString(),
      })

    if (error) throw error
    return data
  }

  async getStaffPerformanceMetrics(staffId: string, startDate: Date, endDate: Date) {
    const { data, error } = await this.supabase
      .rpc('get_staff_performance_metrics', {
        p_staff_id: staffId,
        p_start_date: startDate.toISOString(),
        p_end_date: endDate.toISOString(),
      })

    if (error) throw error
    return data
  }

  async getStaffEarningsBreakdown(staffId: string, startDate: Date, endDate: Date) {
    const { data, error } = await this.supabase
      .rpc('get_staff_earnings_breakdown', {
        p_staff_id: staffId,
        p_start_date: startDate.toISOString(),
        p_end_date: endDate.toISOString(),
      })

    if (error) throw error
    return data
  }

  // Custom Reports
  async generateCustomReport(params: {
    entity_type: 'agency' | 'company' | 'staff'
    entity_id: string
    metrics: string[]
    start_date: Date
    end_date: Date
    grouping?: 'daily' | 'weekly' | 'monthly'
  }) {
    const { data, error } = await this.supabase
      .rpc('generate_custom_report', {
        p_entity_type: params.entity_type,
        p_entity_id: params.entity_id,
        p_metrics: params.metrics,
        p_start_date: params.start_date.toISOString(),
        p_end_date: params.end_date.toISOString(),
        p_grouping: params.grouping || 'monthly',
      })

    if (error) throw error
    return data
  }

  // Forecasting
  async generateForecast(params: {
    entity_type: 'agency' | 'company' | 'staff'
    entity_id: string
    metric: string
    periods: number
  }) {
    const { data, error } = await this.supabase
      .rpc('generate_forecast', {
        p_entity_type: params.entity_type,
        p_entity_id: params.entity_id,
        p_metric: params.metric,
        p_periods: params.periods,
      })

    if (error) throw error
    return data
  }

  // Export Data
  async exportData(params: {
    entity_type: 'agency' | 'company' | 'staff'
    entity_id: string
    data_type: string
    start_date: Date
    end_date: Date
    format: 'csv' | 'xlsx'
  }) {
    const { data, error } = await this.supabase
      .rpc('export_analytics_data', {
        p_entity_type: params.entity_type,
        p_entity_id: params.entity_id,
        p_data_type: params.data_type,
        p_start_date: params.start_date.toISOString(),
        p_end_date: params.end_date.toISOString(),
        p_format: params.format,
      })

    if (error) throw error
    return data
  }
} 