import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export interface AnalyticsData {
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
  performance: {
    weekly: Array<{
      date: string
      shifts_completed: number
      revenue: number
    }>
    monthly: Array<{
      date: string
      shifts_completed: number
      revenue: number
    }>
  }
  ticker: {
    active_jobs: number
    staff_placed: number
    companies: number
    agencies: number
  }
}

export async function fetchAnalytics(
  entityType: 'agency' | 'company' | 'staff',
  entityId: string,
  startDate: Date,
  endDate: Date
): Promise<AnalyticsData> {
  const supabase = createClientComponentClient()
  
  const { data, error } = await supabase.rpc(
    `get_${entityType}_analytics`,
    {
      p_entity_id: entityId,
      p_start_date: startDate.toISOString(),
      p_end_date: endDate.toISOString()
    }
  )

  if (error) {
    throw new Error(`Failed to fetch analytics: ${error.message}`)
  }

  return data as AnalyticsData
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount)
}

export function formatPercentage(value: number): string {
  return `${value.toFixed(1)}%`
}

export function formatChange(value: number): string {
  const prefix = value >= 0 ? '+' : ''
  return `${prefix}${formatPercentage(value)}`
}

export function getDateRange(range: 'week' | 'month' | 'year'): [Date, Date] {
  const end = new Date()
  const start = new Date()

  switch (range) {
    case 'week':
      start.setDate(start.getDate() - 7)
      break
    case 'month':
      start.setMonth(start.getMonth() - 1)
      break
    case 'year':
      start.setFullYear(start.getFullYear() - 1)
      break
  }

  return [start, end]
}

export function calculateGrowth(current: number, previous: number): number {
  if (previous === 0) return 0
  return ((current - previous) / previous) * 100
} 