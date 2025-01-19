'use client'

import React from 'react'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { formatCurrency } from '@/lib/utils/format-currency'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { Building, Users, DollarSign, Clock } from 'lucide-react'
import type { VenueMetrics } from '@/types/dashboard-types'

export default function VenueDashboard({ metrics }: { metrics: VenueMetrics }) {
  return (
    <div className="flex gap-4 h-[calc(100vh-4rem)]">
      {/* Side Panel */}
      <aside className="w-64 bg-card p-4 rounded-lg shadow-lg">
        <div className="space-y-6">
          <div className="space-y-2">
            <h1 className="text-xl font-bold">Venue Dashboard</h1>
            <p className="text-sm text-muted-foreground">Shift Management</p>
          </div>
          
          <nav className="space-y-2" aria-label="Dashboard navigation">
            <a 
              href="#active-shifts" 
              className="flex items-center gap-2 p-2 rounded-lg hover:bg-accent transition-colors"
              role="menuitem"
            >
              <Clock size={20} aria-hidden="true" />
              <span>Active Shifts</span>
            </a>
            <a 
              href="#staff-pool" 
              className="flex items-center gap-2 p-2 rounded-lg hover:bg-accent transition-colors"
              role="menuitem"
            >
              <Users size={20} aria-hidden="true" />
              <span>Staff Pool</span>
            </a>
            <a 
              href="#expenses" 
              className="flex items-center gap-2 p-2 rounded-lg hover:bg-accent transition-colors"
              role="menuitem"
            >
              <DollarSign size={20} aria-hidden="true" />
              <span>Expenses</span>
            </a>
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 space-y-4">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4" aria-label="Dashboard statistics">
          <Card className="p-4">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-muted-foreground" />
              <h3 className="text-sm font-medium">Total Staff</h3>
            </div>
            <p className="text-2xl font-bold mt-2">{metrics.totalStaff}</p>
            <p className="text-xs text-muted-foreground mt-1">Active staff members</p>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-muted-foreground" />
              <h3 className="text-sm font-medium">Active Shifts</h3>
            </div>
            <p className="text-2xl font-bold mt-2">{metrics.activeShifts}</p>
            <p className="text-xs text-muted-foreground mt-1">Currently in progress</p>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-muted-foreground" />
              <h3 className="text-sm font-medium">Monthly Expenses</h3>
            </div>
            <p className="text-2xl font-bold mt-2">{formatCurrency(metrics.monthlyExpenses)}</p>
            <p className="text-xs text-muted-foreground mt-1">This month's total</p>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-2">
              <Building className="h-5 w-5 text-muted-foreground" />
              <h3 className="text-sm font-medium">Venue Status</h3>
            </div>
            <div className="mt-2">
              <Badge variant={metrics.isActive ? "default" : "destructive"}>
                {metrics.isActive ? "Active" : "Inactive"}
              </Badge>
            </div>
          </Card>
        </div>

        {/* Chart */}
        <Card className="p-4">
          <h2 className="text-lg font-medium mb-4">Shift Distribution</h2>
          <div className="h-[300px]" aria-label="Shift distribution chart">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={metrics.shiftData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: 12 }}
                  aria-label="Date"
                />
                <YAxis 
                  tick={{ fontSize: 12 }}
                  aria-label="Number of shifts"
                />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="shifts" 
                  stroke="#8884d8" 
                  strokeWidth={2}
                  dot={{ strokeWidth: 2 }}
                  name="Shifts"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </main>
    </div>
  )
} 