import { StaffMember, Activity, AgencyMetrics } from '@/types/dashboard'

export function generateDemoData(): AgencyMetrics {
  const recentActivity: Activity[] = [
    {
      id: crypto.randomUUID(),
      message: 'New shift booked at Venue A',
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
      type: 'shift_booked',
      actor: 'John Doe'
    },
    {
      id: crypto.randomUUID(),
      message: 'Payment processed for John Doe',
      timestamp: new Date(Date.now() - 1000 * 60 * 60),
      type: 'payment_processed',
      actor: 'System'
    },
    {
      id: crypto.randomUUID(),
      message: 'New staff member onboarded',
      timestamp: new Date(Date.now() - 1000 * 60 * 120),
      type: 'staff_onboarded',
      actor: 'Admin'
    }
  ]

  const staffMembers: StaffMember[] = [
    {
      id: crypto.randomUUID(),
      name: 'John Doe',
      skills: ['Bartending', 'Customer Service'],
      status: 'Available',
      shiftsCompleted: 45,
      rating: 4.8,
      hourlyRate: 25,
      availability: {
        weekdays: [false, false, false, false, false, false, false], // All weekdays false
        preferredHours: {
          start: '17:00', // Evening start time
          end: '23:00' // Evening end time
        }
      },
      email: '',
      phone: '',
      documents: [],
      bankDetails: {
        accountName: '',
        accountNumber: '',
        routingNumber: ''
      }
    },
    {
      id: crypto.randomUUID(),
      name: 'Jane Smith',
      skills: ['Security', 'Crowd Control'],
      status: 'On Shift',
      shiftsCompleted: 32,
      rating: 4.9,
      hourlyRate: 28,
      availability: {
        weekdays: [false, false, false, false, false, false, false],
        preferredHours: {
          start: '20:00',
          end: '04:00'
        }
      },
      email: '',
      phone: '',
      documents: [],
      bankDetails: {
        accountName: '',
        accountNumber: '',
        routingNumber: ''
      }
    }
  ]

  return {
    totalStaff: 25,
    staffUtilization: 78,
    activeShifts: 12,
    completedShifts: 156,
    revenue: 45250,
    rating: 4.8,
    revenueHistory: [
      { month: 'Jan', value: 30000 },
      { month: 'Feb', value: 35000 },
      { month: 'Mar', value: 32000 },
      { month: 'Apr', value: 40000 },
      { month: 'May', value: 45250 }
    ],
    staffMembers,
    recentActivity,
    analytics: {
      staffUtilization: 78,
      averageShiftDuration: 6.5,
      repeatBookingRate: 65,
      clientSatisfaction: 4.8
    }
  }
} 