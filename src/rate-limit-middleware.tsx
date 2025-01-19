// src/middleware/rateLimit.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

interface RateLimitConfig {
  windowMs: number;    // Time window in milliseconds
  maxRequests: number; // Maximum requests per window
}

interface RateLimitInfo {
  count: number;
  resetTime: number;
}

// Configure different limits for different types of requests
const rateLimitConfigs: Record<string, RateLimitConfig> = {
  default: {
    windowMs: 60 * 60 * 1000, // 1 hour
    maxRequests: 1000,
  },
  auth: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 30,
  },
  api: {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 100,
  }
}

// In-memory store for rate limiting
// Note: In production, use Redis or similar for distributed systems
const rateLimitStore = new Map<string, RateLimitInfo>()

export function rateLimitMiddleware(req: NextRequest) {
  try {
    const ip = req.ip ?? req.headers.get('x-forwarded-for') ?? 'anonymous'
    const path = req.nextUrl.pathname
    
    // Determine which config to use based on the path
    const config = getRateLimitConfig(path)
    
    // Generate unique identifier for this client
    const identifier = `${ip}-${getConfigType(path)}`
    
    const rateLimitInfo = checkRateLimit(identifier, config)
    
    // Add rate limit headers
    const headers = new Headers()
    headers.set('X-RateLimit-Limit', config.maxRequests.toString())
    headers.set('X-RateLimit-Remaining', (config.maxRequests - rateLimitInfo.count).toString())
    headers.set('X-RateLimit-Reset', rateLimitInfo.resetTime.toString())

    // If rate limit exceeded
    if (rateLimitInfo.count > config.maxRequests) {
      return new NextResponse('Too Many Requests', {
        status: 429,
        headers: {
          'Retry-After': Math.ceil((rateLimitInfo.resetTime - Date.now()) / 1000).toString(),
          ...Object.fromEntries(headers)
        }
      })
    }

    // Continue with the request
    const response = NextResponse.next()
    // Copy headers to response
    headers.forEach((value, key) => response.headers.set(key, value))
    return response

  } catch (error) {
    console.error('Rate limit middleware error:', error)
    // On error, allow the request to proceed
    return NextResponse.next()
  }
}

function getRateLimitConfig(path: string): RateLimitConfig {
  if (path.startsWith('/auth')) return rateLimitConfigs.auth
  if (path.startsWith('/api')) return rateLimitConfigs.api
  return rateLimitConfigs.default
}

function getConfigType(path: string): string {
  if (path.startsWith('/auth')) return 'auth'
  if (path.startsWith('/api')) return 'api'
  return 'default'
}

function checkRateLimit(identifier: string, config: RateLimitConfig): RateLimitInfo {
  const now = Date.now()
  const windowStart = now - config.windowMs
  
  let rateLimitInfo = rateLimitStore.get(identifier)
  
  if (!rateLimitInfo || rateLimitInfo.resetTime < now) {
    // Create new rate limit entry
    rateLimitInfo = {
      count: 1,
      resetTime: now + config.windowMs
    }
  } else {
    // Increment existing entry
    rateLimitInfo.count++
  }
  
  // Clean up old entries periodically
  if (Math.random() < 0.001) { // 0.1% chance to clean up on each request
    cleanup()
  }
  
  rateLimitStore.set(identifier, rateLimitInfo)
  return rateLimitInfo
}

function cleanup() {
  const now = Date.now()
  for (const [key, info] of rateLimitStore.entries()) {
    if (info.resetTime < now) {
      rateLimitStore.delete(key)
    }
  }
}