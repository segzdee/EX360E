export type StaffStatus = 'Available' | 'On Shift' | 'Off Duty' | 'On Break'
export type ShiftStatus = 'Scheduled' | 'In Progress' | 'Completed' | 'Cancelled' | 'Starting Soon'
export type ActivityType = 'shift_booked' | 'payment_processed' | 'staff_onboarded'
export type PaymentStatus = 'Pending' | 'Completed' | 'Failed' | 'Refunded'

export interface StaffMember {
  id: string
  name: string
  email: string // Missing in demo
  phone: string // Missing in demo
  skills: string[]
  rating: number
  status: StaffStatus
  shiftsCompleted: number
  hourlyRate: number // Missing in demo
  availability: {
    // Missing in demo
    weekdays: boolean[]
    preferredHours: {
      start: string
      end: string
    }
  }
  documents: { // Missing in demo
    id: string
    type: string
    status: string
    expiryDate: string
  }[]
  bankDetails: { // Missing in demo
    accountName: string
    accountNumber: string
    routingNumber: string
  }
}

export interface Shift {
  id: string
  venue: string
  startTime: Date
  endTime: Date
  staffNeeded: number
  staffAssigned: number
  hourlyRate: number
  status: ShiftStatus
  requirements: string[] // Missing in demo
  assignedStaff: string[] // Missing in demo
  notes: string // Missing in demo
  location: { // Missing in demo
    address: string
    coordinates: {
      lat: number
      lng: number
    }
  }
  uniformRequirements: string[] // Missing in demo
  breakSchedule: { // Missing in demo
    duration: number
    paid: boolean
  }
}

export interface Venue {
  id: string
  name: string
  type: string // Missing in demo
  address: string // Missing in demo
  contactPerson: { // Missing in demo
    name: string
    phone: string
    email: string
  }
  paymentTerms: { // Missing in demo
    type: string
    dueDate: number
  }
  requirements: { // Missing in demo
    minimumRating: number
    requiredSkills: string[]
    uniformCode: string[]
  }
}

export interface Payment {
  id: string
  shiftId: string
  staffId: string
  amount: number
  status: PaymentStatus
  paymentDate: Date
  paymentMethod: string
  reference: string
  fees: { // Missing in demo
    platform: number
    processing: number
    tax: number
  }
}

export interface Activity {
  id: string
  message: string
  timestamp: Date
  type: ActivityType
}

export interface Analytics {
  staffUtilization: number
  averageShiftDuration: number
  repeatBookingRate: number
  clientSatisfaction: number
}

export interface AgencyMetrics {
  totalStaff: number
  staffUtilization: number
  activeShifts: number
  completedShifts: number
  revenue: number
  rating: number
  revenueHistory: Array<{
    month: string
    value: number
  }>
  staffMembers: StaffMember[]
  recentActivity: Activity[]
  analytics: Analytics
} 