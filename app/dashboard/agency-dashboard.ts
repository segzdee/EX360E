'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export default function AgencyDashboard() {
  const { user, profile } = useAuth()
  const [stats, setStats] = useState({
    activeStaff: 0,
    activeShifts: 0,
    completedShifts: 0,
    pendingPayments: 0
  })
  const supabase = createClientComponentClient()

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user) return

      try {
        // Fetch staff count
        const { data: staffData, error: staffError } = await supabase
          .from('freelancers')
          .select('id')
          .eq('recruiter_id', profile?.id)

        if (staffError) throw staffError

        // Fetch active shifts
        const { data: shiftsData, error: shiftsError } = await supabase
          .from('shifts')
          .select('id, status')
          .eq('recruiter_id', profile?.id)

        if (shiftsError) throw shiftsError

        setStats({
          activeStaff: staffData.length,
          activeShifts: shiftsData.filter(s => s.status === 'active').length,
          completedShifts: shiftsData.filter(s => s.status === 'completed').length,
          pendingPayments: shiftsData.filter(s => s.status === 'pending_payment').length
        })
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
      }
    }

    fetchDashboardData()
  }, [user, profile])

  return (
    <div className="p-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-600">Active Staff</h3>
          <p className="text-3xl font-bold">{stats.activeStaff}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-600">Active Shifts</h3>
          <p className="text-3xl font-bold">{stats.activeShifts}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-600">Completed Shifts</h3>
          <p className="text-3xl font-bold">{stats.completedShifts}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-600">Pending Payments</h3>
          <p className="text-3xl font-bold">{stats.pendingPayments}</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white p-6 rounded-lg shadow mb-8">
        <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            Post New Shift
          </button>
          <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
            Add Staff Member
          </button>
          <button className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700">
            View Reports
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
        <div className="space-y-4">
          <p className="text-gray-600">No recent activity to display</p>
        </div>
      </div>
    </div>
  )
}