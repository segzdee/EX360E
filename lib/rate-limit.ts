import { NextApiRequest, NextApiResponse } from 'next'
import { get, set } from '@vercel/edge-config'

const RATE_LIMIT_DURATION = 60 * 1000 // 1 minute
const MAX_REQUESTS = 60 // 60 requests per minute

export async function rateLimit(req: NextApiRequest, res: NextApiResponse, next: () => void) {
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress
  const key = `rateLimit_${ip}`

  const currentRequests = await get(key) || 0

  if (currentRequests >= MAX_REQUESTS) {
    res.status(429).json({ error: 'Too many requests, please try again later.' })
    return
  }

  await set(key, currentRequests + 1, { ttl: RATE_LIMIT_DURATION })
  next()
}

