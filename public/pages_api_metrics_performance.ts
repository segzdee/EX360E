import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]'
import { AnalyticsService } from '@/lib/services/analytics'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions)
  
  if (!session || session.user.role !== 'SUPER_ADMIN') {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  try {
    // Fetch real-time metrics
    const metrics = await prisma.metrics.findMany({
      orderBy: { timestamp: 'desc' },
      take: 100
    })

    // Enhance metrics with AI insights
    const enhancedMetrics = {
      metrics,
      predictions: await AnalyticsService.predictStaffDemand(metrics),
      sentiment: await AnalyticsService.analyzeSentiment(
        metrics.filter(m => m.type === 'feedback').map(m => m.value)
      ),
      anomalies: await AnalyticsService.detectAnomalies(metrics)
    }

    res.status(200).json(enhancedMetrics)
  } catch (error) {
    console.error('Error fetching metrics:', error)
    res.status(500).json({ error: 'Failed to fetch metrics' })
  }
}

