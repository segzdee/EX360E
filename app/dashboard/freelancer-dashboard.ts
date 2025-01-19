'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export default function FreelancerDashboard() {
  const { user, profile } = useAuth()
  const [stats, setStats] = useState({
    completedShifts: 0,
    upcomingShifts: 0,
    totalEarnings: 0,
    averageRating: 0
  })
  const [shifts, setShifts] = useState([])
  const supabase = createClientComponentClient()

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user) return

      try {
        // Fetch shift statistics
        const { data: shiftsData, error: shiftsError } = await supabase
          .from('shift_assignments')
          .select(`
            id,
            shift:shifts(
              title,
              start_time,
              end_time,
              hourly_rate,
              location,
              status
            ),
            rating,
            status
          `)
          .eq('freelancer_id', profile?.id)

        if (shiftsError) throw shiftsError

        // Calculate statistics
        const completed = shiftsData.filter(s => s.status === 'completed')
        const totalEarnings = completed.reduce((acc, curr) => {
          const hours = (new Date(curr.shift.end_time) - new Date(curr.shift.start_time)) / 3600000
          return acc + (hours * curr.shift.hourly_rate)
        }, 0)

        const avgRating = completed.reduce((acc, curr) => acc + (curr.rating || 0), 0) / 
          (completed.filter(s => s.rating).length || 1)

        setStats({
          completedShifts: completed.length,
          upcomingShifts: shiftsData.filter(s => s.status === 'upcoming').length,
          totalEarnings,
          averageRating: avgRating
        })

        // Set recent shifts
        setShifts(shiftsData.slice(0, 5))
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
          <h3 className="text-lg font-semibold text-gray-600">Completed Shifts</h3>
          <p className="text-3xl font-bold">{stats.completedShifts}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-600">Upcoming Shifts</h3>
          <p className="text-3xl font-bold">{stats.upcomingShifts}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-600">Total Earnings</h3>
          <p className="text-3xl font-bold">${stats.totalEarnings.toFixed(2)}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-600">Average Rating</h3>
          <p className="text-3xl font-bold">{stats.averageRating.toFixed(1)}/5.0</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white p-6 rounded-lg shadow mb-8">
        <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            Find Shifts
          </button>
          <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
            Update Availability
          </button>
          <button className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700">
            View Earnings
          </button>
          <button className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700">
            Training Modules
          </button>
        </div>
      </div>

      {/* Upcoming Shifts */}
      <div className="bg-white p-6 rounded-lg shadow mb-8">
        <h2 className="text-xl font-bold mb-4">Upcoming Shifts</h2>
        <div className="space-y-4">
          {shifts.filter(s => s.status === 'upcoming').length > 0 ? (
            shifts.map((shift: any) => (
              <div key={shift.id} className="border-b pb-4">
                <h3 className="font-semibold">{shift.shift.title}</h3>
                <p className="text-gray-600">
                  {new Date(shift.shift.start_time).toLocaleDateString()} - 
                  {new Date(shift.shift.end_time).toLocaleTimeString()}
                </p>
                <p className="text-sm text-gray-500">
                  ${shift.shift.hourly_rate}/hour
                </p>
              </div>
            ))
          ) : (
            <p className="text-gray-600">No upcoming shifts</p>
          )}
        </div>
      </div>

      {/* Skills and Certifications */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4">Skills & Certifications</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold mb-2">Skills</h3>
            <div className="flex flex-wrap gap-2">
              {profile?.skills?.map((skill: string) => (
                <span
                  key={skill}
                  className="bg-blue-100 text-blue-800 px-2 py-1 rounded"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Certifications</h3>
            <div className="space-y-2">
              {profile?.certifications?.map((cert: any) => (
                <div key={cert.name} className="flex items-center">
                  <span className="text-green-600 mr-2">✓</span>
                  <span>{cert.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}