import { Users, DollarSign, Calendar, TrendingUp } from 'lucide-react'
import { useEffect, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

interface StatData {
  icon: any
  label: string
  value: string
  change: string
  loading?: boolean
}

export function StatsDisplay() {
  const [stats, setStats] = useState<StatData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClientComponentClient()

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        const { data: analytics, error } = await supabase.rpc('get_agency_analytics', {
          p_start_date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
          p_end_date: new Date().toISOString()
        })

        if (error) throw error

        setStats([
          {
            icon: Users,
            label: "Active Staff",
            value: analytics.staff.active.toLocaleString(),
            change: `${(analytics.staff.utilization).toFixed(1)}%`
          },
          {
            icon: DollarSign,
            label: "Revenue",
            value: `$${(analytics.revenue.total / 1000).toFixed(1)}K`,
            change: `${analytics.revenue.growth.toFixed(1)}%`
          },
          {
            icon: Calendar,
            label: "Shifts",
            value: analytics.shifts.completed.toLocaleString(),
            change: `${((analytics.shifts.completed / analytics.shifts.total) * 100).toFixed(1)}%`
          },
          {
            icon: TrendingUp,
            label: "Growth",
            value: `${analytics.clients.new} new`,
            change: `+${((analytics.clients.new / analytics.clients.total) * 100).toFixed(1)}%`
          }
        ])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load analytics')
      } finally {
        setLoading(false)
      }
    }

    fetchAnalytics()
  }, [])

  if (error) {
    return (
      <div className="w-full max-w-lg p-4 bg-red-50 text-red-600 rounded-lg">
        Error loading stats: {error}
      </div>
    )
  }

  return (
    <div className="w-full max-w-lg space-y-8" aria-label="Statistics Dashboard">
      <div className="grid grid-cols-2 gap-4">
        {stats.map((stat, i) => (
          <div 
            key={i} 
            className="bg-primary-foreground/10 rounded-lg p-4"
            role="region"
            aria-label={`${stat.label} Statistics`}
          >
            <div className="flex items-center justify-between">
              <stat.icon className="h-5 w-5 text-primary-foreground/80" aria-hidden="true" />
              <span className={`text-xs ${
                stat.change.startsWith('+') ? 'text-green-400' : 'text-red-400'
              }`}>
                {stat.change}
              </span>
            </div>
            <div className="mt-2">
              {loading ? (
                <div className="animate-pulse bg-primary-foreground/20 h-8 w-24 rounded" />
              ) : (
                <>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-sm text-primary-foreground/80">{stat.label}</p>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
      <div className="space-y-4">
        <div className="bg-primary-foreground/10 rounded-lg p-4">
          <h3 className="text-sm font-medium mb-4">Weekly Performance</h3>
          <div className="h-32 flex items-end justify-between gap-2">
            {[40, 70, 45, 90, 65, 45, 80].map((height, i) => (
              <div key={i} className="w-full">
                <div 
                  className="bg-primary-foreground/50 rounded-t hover:bg-primary-foreground/70 transition-all"
                  style={{ height: `${height}%` }}
                />
              </div>
            ))}
          </div>
        </div>
        <div className="bg-primary-foreground/10 rounded-lg p-4">
          <h3 className="text-sm font-medium mb-4">Monthly Trend</h3>
          <div className="h-32 relative">
            <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              <path
                d="M0,50 Q25,20 50,50 T100,50"
                fill="none"
                stroke="rgba(255, 255, 255, 0.5)"
                strokeWidth="2"
              />
            </svg>
          </div>
        </div>
      </div>
      <div className="bg-primary-foreground/10 rounded-lg p-4 overflow-hidden">
        <div className="animate-marquee whitespace-nowrap">
          Active Jobs <span className="font-bold">+2,145</span> (+12.5%) | 
          Staff Placed <span className="font-bold">15,890</span> (+8.3%) | 
          Companies <span className="font-bold">450</span> (+15.2%) | 
          Agencies <span className="font-bold">280</span> (+10.1%)
        </div>
      </div>
    </div>
  )
}

