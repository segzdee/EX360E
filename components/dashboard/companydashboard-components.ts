// components/dashboard/company/Overview.tsx
'use client'

import { Card } from '@/components/ui/card'

interface CompanyOverviewProps {
  data: any
}

export default function CompanyOverview({ data }: CompanyOverviewProps) {
  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4">Company Overview</h2>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <span className="text-sm text-gray-500">Active Shifts</span>
          <p className="text-2xl font-bold">{data.active_shifts_count || 0}</p>
        </div>
        <div>
          <span className="text-sm text-gray-500">Total Staff</span>
          <p className="text-2xl font-bold">{data.total_staff_count || 0}</p>
        </div>
        <div>
          <span className="text-sm text-gray-500">Monthly Spend</span>
          <p className="text-2xl font-bold">${data.monthly_spend || 0}</p>
        </div>
        <div>
          <span className="text-sm text-gray-500">Service Fee</span>
          <p className="text-2xl font-bold">{data.service_fee_percentage || 8}%</p>
        </div>
      </div>
    </Card>
  )
}

// components/dashboard/company/ActiveShifts.tsx
'use client'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { formatDate } from '@/lib/utils'

interface ActiveShiftsProps {
  shifts: any[]
}

export default function ActiveShifts({ shifts }: ActiveShiftsProps) {
  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Active Shifts</h2>
        <Button variant="outline">Post New Shift</Button>
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
                </div>
                <div className="text-right">
                  <span className="text-sm font-medium">${shift.hourly_rate}/hr</span>
                  <p className="text-sm text-gray-500">
                    {shift.assigned_staff_count || 0} assigned
                  </p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No active shifts</p>
        )}
      </div>
    </Card>
  )
}

// components/dashboard/company/StaffMetrics.tsx
'use client'

import { Card } from '@/components/ui/card'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

interface StaffMetricsProps {
  companyId: string
}

export default function StaffMetrics({ companyId }: StaffMetricsProps) {
  // Example data - replace with real data
  const data = [
    { month: 'Jan', staff: 4 },
    { month: 'Feb', staff: 6 },
    { month: 'Mar', staff: 8 },
    { month: 'Apr', staff: 7 },
    { month: 'May', staff: 9 },
  ]

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4">Staff Metrics</h2>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="staff" stroke="#2563eb" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  )
}

// components/dashboard/company/FinancialSummary.tsx
'use client'

import { Card } from '@/components/ui/card'

interface FinancialSummaryProps {
  data: any[]
}

export default function FinancialSummary({ data }: FinancialSummaryProps) {
  const totalSpent = data?.reduce((acc, curr) => acc + curr.amount, 0) || 0
  const avgShiftCost = totalSpent / (data?.length || 1)

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4">Financial Summary</h2>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <span className="text-sm text-gray-500">Total Spent</span>
          <p className="text-2xl font-bold">${totalSpent.toFixed(2)}</p>
        </div>
        <div>
          <span className="text-sm text-gray-500">Avg. Shift Cost</span>
          <p className="text-2xl font-bold">${avgShiftCost.toFixed(2)}</p>
        </div>
        <div>
          <span className="text-sm text-gray-500">Service Fees</span>
          <p className="text-2xl font-bold">${(totalSpent * 0.08).toFixed(2)}</p>
        </div>
        <div>
          <span className="text-sm text-gray-500">Active Payments</span>
          <p className="text-2xl font-bold">{data?.filter(p => p.status === 'pending').length || 0}</p>
        </div>
      </div>
    </Card>
  )
}