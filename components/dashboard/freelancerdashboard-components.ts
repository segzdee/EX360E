// components/dashboard/freelancer/Overview.tsx
'use client'

import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface FreelancerOverviewProps {
  data: any
}

export default function FreelancerOverview({ data }: FreelancerOverviewProps) {
  return (
    <Card className="p-6">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-xl font-semibold">Profile Overview</h2>
          <p className="text-sm text-gray-500">Your current status and metrics</p>
        </div>
        <Badge variant={data.is_available ? "success" : "secondary"}>
          {data.is_available ? "Available" : "Unavailable"}
        </Badge>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <span className="text-sm text-gray-500">Total Shifts</span>
          <p className="text-2xl font-bold">{data.total_shifts_completed || 0}</p>
        </div>
        <div>
          <span className="text-sm text-gray-500">Rating</span>
          <p className="text-2xl font-bold">{data.average_rating?.toFixed(1) || 0}/5.0</p>
        </div>
        <div>
          <span className="text-sm text-gray-500">Skills</span>
          <div className="flex flex-wrap gap-1 mt-1">
            {data.skills?.map((skill: string) => (
              <Badge key={skill} variant="outline">{skill}</Badge>
            ))}
          </div>
        </div>
        <div>
          <span className="text-sm text-gray-500">Certifications</span>
          <div className="flex flex-wrap gap-1 mt-1">
            {data.certifications?.map((cert: any) => (
              <Badge key={cert.name} variant="outline">{cert.name}</Badge>
            ))}
          </div>
        </div>
      </div>
    </Card>
  )
}

// components/dashboard/freelancer/AvailableShifts.tsx
'use client'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { formatDate, formatCurrency } from '@/lib/utils'

interface AvailableShiftsProps {
  shifts: any[]
}

export default function AvailableShifts({ shifts }: AvailableShiftsProps) {
  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-xl font-semibold">Available Shifts</h2>
          <p className="text-sm text-gray-500">Shifts matching your profile</p>
        </div>
        <Button variant="outline">View All</Button>
      </div>
      <div className="space-y-4">
        {shifts.length > 0 ? (
          shifts.map((shift) => (
            <div key={shift.id} className="border-b pb-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium">{shift.title}</h3>
                  <p className="text-sm text-gray-500">
                    {formatDate(shift.start_time)} - {formatDate(shift.end_time)}
                  </p>
                  <p className="text-sm text-gray-500">{shift.location}</p>
                </div>
                <div className="text-right">
                  <span className="text-sm font-medium">
                    {formatCurrency(shift.hourly_rate)}/hr
                  </span>
                  <Button size="sm" className="mt-2">Apply</Button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No shifts available</p>
        )}
      </div>
    </Card>
  )
}

// components/dashboard/freelancer/EarningsSummary.tsx
'use client'

import { Card } from '@/components/ui/card'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

interface EarningsSummaryProps {
  freelancerId: string
}

export default function EarningsSummary({ freelancerId }: EarningsSummaryProps) {
  // Example data - replace with real data
  const data = [
    { month: 'Jan', earnings: 1200 },
    { month: 'Feb', earnings: 1800 },
    { month: 'Mar', earnings: 1500 },
    { month: 'Apr', earnings: 2200 },
    { month: 'May', earnings: 1900 },
  ]

  const totalEarnings = data.reduce((acc, curr) => acc + curr.earnings, 0)

  return (
    <Card className="p-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold">Earnings Summary</h2>
        <p className="text-2xl font-bold mt-2">${totalEarnings.toFixed(2)}</p>
      </div>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="earnings" stroke="#2563eb" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  )
}

// components/dashboard/freelancer/UpcomingShifts.tsx
'use client'

import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatDate, formatCurrency } from '@/lib/utils'

interface UpcomingShiftsProps {
  shifts: any[]
}

export default function UpcomingShifts({ shifts }: UpcomingShiftsProps) {
  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4">Upcoming Shifts</h2>
      <div className="space-y-4">
        {shifts.length > 0 ? (
          shifts.map((assignment) => (
            <div key={assignment.id} className="border-b pb-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium">{assignment.shift.title}</h3>
                  <p className="text-sm text-gray-500">
                    {formatDate(assignment.shift.start_time)}
                  </p>
                  <p className="text-sm text-gray-500">
                    {assignment.shift.location}
                  </p>
                </div>
                <div className="text-right">
                  <Badge>
                    {formatCurrency(assignment.shift.hourly_rate)}/hr
                  </Badge>
                  <p className="text-sm text-gray-500 mt-1">
                    {assignment.status}
                  </p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No upcoming shifts</p>
        )}
      </div>
    </Card>
  )
}