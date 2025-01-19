import { StaffMember, Activity, AgencyMetrics } from '@/types/dashboard'

export function generateDemoData(): AgencyMetrics {
  const recentActivity: Activity[] = [
    {
      id: '1',
      message: 'New shift booked at Venue A',
      timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 mins ago
      type: 'shift_booked'
    },
    {
      id: '2',
      message: 'Payment processed for John Doe',
      timestamp: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
      type: 'payment_processed'
    },
    {
      id: '3',
      message: 'New staff member onboarded',
      timestamp: new Date(Date.now() - 1000 * 60 * 120), // 2 hours ago
      type: 'staff_onboarded'
    }
  ]

  const staffMembers: StaffMember[] = [
    {
      id: '1',
      name: 'John Doe',
      skills: ['Bartending', 'Customer Service'],
      status: 'Available',
      shiftsCompleted: 45,
      rating: 4.8
    },
    {
      id: '2', 
      name: 'Jane Smith',
      skills: ['Security', 'Crowd Control'],
      status: 'On Shift',
      shiftsCompleted: 32,
      rating: 4.9
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