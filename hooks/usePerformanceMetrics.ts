import { useState, useEffect } from 'react'
import { AnalyticsService } from '@/lib/services/analytics'

export function usePerformanceMetrics() {
  const [metrics, setMetrics] = useState({
    responseTime: [],
    errorRates: [],
    userSatisfaction: null,
    systemHealth: null
  })

  useEffect(() => {
    const fetchMetrics = async () => {
      // Fetch real-time metrics
      const performance = await fetch('/api/metrics/performance').then(res => res.json())
      
      // Detect anomalies
      const anomalies = await AnalyticsService.detectAnomalies(performance.metrics)
      
      // Update metrics with AI-enhanced insights
      setMetrics({
        ...performance,
        anomalies,
        predictions: await AnalyticsService.predictStaffDemand(performance.historicalData)
      })
    }

    const interval = setInterval(fetchMetrics, 30000)
    fetchMetrics()

    return () => clearInterval(interval)
  }, [])

  return metrics
}

