export interface BaseMetrics {
  id: string
  createdAt: Date
  updatedAt: Date
}

export interface AgencyMetrics extends BaseMetrics {
  totalStaff: number
  staffUtilization: number
  activeShifts: number
  completedShifts: number
  revenue: number
  pendingPayments: number
}

export interface VenueMetrics extends BaseMetrics {
  totalShifts: number
  filledShifts: number
  openShifts: number
  totalSpent: number
  averageRating: number
  regularStaff: number
}

export interface StaffMetrics extends BaseMetrics {
  completedShifts: number
  upcomingShifts: number
  totalEarnings: number
  averageRating: number
  preferredVenues: number
  availableShifts: number
} 