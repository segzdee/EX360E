'use client'

import { useAuth } from '@/context/AuthContext'
import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

const ClientDashboard = () => {
  const { user, profile } = useAuth()
  const [stats, setStats] = useState({
    activeShifts: 0,
    completedShifts: 0,
    pendingPayments: 0,
    totalSpent: 0
  })

  const supabase = createClientComponentClient()

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user) return

      // Fetch active shifts
      const { data: activeShifts } = await supabase
        .from('shifts')
        .select('*', { count: 'exact' })
        .eq('company_id', profile?.id)
        .eq('status', 'active')

      // Fetch completed shifts
      const { data: completedShifts } = await supabase
        .from('shifts')
        .select('*', { count: 'exact' })
        .eq('company_id', profile?.id)
        .eq('status', 'completed')

      // Update stats
      setStats({
        activeShifts: activeShifts?.length || 0,
        completedShifts: completedShifts?.length || 0,
        pendingPayments: 0, // TODO: Add actual pending payments count
        totalSpent: 0 // TODO: Add actual spending calculation
      })
    }

    fetchDashboardData()
  }, [user, profile])

  return (
    <div className="p-6">
      {/* Dashboard Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Client Dashboard</h1>
        <p className="text-gray-500">Welcome back, {profile?.company_name}</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 mb-8 lg:grid-cols-4">
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-sm font-medium text-gray-600">Active Shifts</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">{stats.activeShifts}</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-sm font-medium text-gray-600">Completed Shifts</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">{stats.completedShifts}</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-sm font-medium text-gray-600">Pending Payments</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">${stats.pendingPayments}</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-sm font-medium text-gray-600">Total Spent</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">${stats.totalSpent}</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white p-6 rounded-lg shadow mb-8">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
            Post New Shift
          </button>
          <button className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700">
            View Staff
          </button>
          <button className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700">
            View Reports
          </button>
        </div>
      </div>

      {/* Active Shifts */}
      <div className="bg-white p-6 rounded-lg shadow mb-8">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Active Shifts</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Position
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 text-sm text-gray-500">No active shifts</td>
                <td className="px-6 py-4"></td>
                <td className="px-6 py-4"></td>
                <td className="px-6 py-4"></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h2>
        <div className="space-y-4">
          {/* Add recent activity items here */}
          <p className="text-gray-500">No recent activity</p>
        </div>
      </div>
    </div>
  )
}

export default ClientDashboard