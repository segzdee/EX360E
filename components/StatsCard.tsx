export function StatsCard({
  title,
  value,
  change,
  loading = false
}: {
  title: string
  value: string
  change: number
  loading?: boolean
}) {
  if (loading) {
    return (
      <div className="bg-blue-500/20 p-4 rounded-lg animate-pulse">
        <div className="h-4 bg-blue-200 rounded w-24 mb-2"></div>
        <div className="h-8 bg-blue-200 rounded w-16"></div>
      </div>
    )
  }

  return (
    <div className="bg-blue-500/20 p-4 rounded-lg">
      <div className="flex justify-between mb-1">
        <span>{title}</span>
        <span className="text-green-400">+{change}%</span>
      </div>
      <div className="text-2xl font-bold">{value}</div>
    </div>
  )
}