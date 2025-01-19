import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface MetricsCardProps {
  title: string
  value: string | number
  icon: React.ReactNode
  trend?: {
    value: number
    isPositive: boolean
  }
  className?: string
}

export function MetricsCard({
  title,
  value,
  icon,
  trend,
  className,
}: MetricsCardProps) {
  return (
    <Card className={cn("p-6", className)}>
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
        </div>
        <div className="text-muted-foreground">{icon}</div>
      </div>
      {trend && (
        <div className="mt-4 flex items-center text-sm">
          <span
            className={cn(
              "font-medium",
              trend.isPositive ? "text-green-600" : "text-red-600"
            )}
          >
            {trend.isPositive ? "+" : "-"}{trend.value}%
          </span>
          <span className="ml-2 text-muted-foreground">from last month</span>
        </div>
      )}
    </Card>
  )
} 