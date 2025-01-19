// lib/validations/auth.ts
import * as z from 'zod'
import { passwordStrength } from 'check-password-strength'

// Password strength requirements
const passwordRequirements = {
  minLength: 8,
  maxLength: 64,
  minScore: 2 // 0-3 score based on complexity
}

// Custom password validation
const passwordValidation = z.string()
  .min(passwordRequirements.minLength, `Password must be at least ${passwordRequirements.minLength} characters`)
  .max(passwordRequirements.maxLength, `Password must be less than ${passwordRequirements.maxLength} characters`)
  .refine((password) => {
    const strength = passwordStrength(password).id
    return strength >= passwordRequirements.minScore
  }, {
    message: 'Password is too weak. Include uppercase, lowercase, numbers, and special characters.'
  })

// Email validation with common email provider check
const emailValidation = z.string()
  .email('Invalid email address')
  .min(5, 'Email is too short')
  .max(255, 'Email is too long')
  .refine((email) => {
    const [, domain] = email.split('@')
    const commonProviders = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com']
    return domain && (
      commonProviders.includes(domain.toLowerCase()) ||
      /^[a-zA-Z0-9-]+\.[a-zA-Z]{2,}$/.test(domain) // Basic domain validation
    )
  }, {
    message: 'Please use a valid email provider'
  })

// Login form schema
export const loginSchema = z.object({
  email: emailValidation,
  password: z.string().min(1, 'Password is required'),
  rememberMe: z.boolean().optional(),
})

// Registration form schema
export const registrationSchema = z.object({
  email: emailValidation,
  password: passwordValidation,
  confirmPassword: z.string(),
  fullName: z.string()
    .min(2, 'Full name must be at least 2 characters')
    .max(100, 'Full name must be less than 100 characters')
    .regex(/^[a-zA-Z\s'-]+$/, 'Name can only contain letters, spaces, hyphens, and apostrophes'),
  role: z.enum(['staff', 'company', 'agency']),
  agreeToTerms: z.literal(true, {
    errorMap: () => ({ message: 'You must agree to the terms and conditions' }),
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

// Password reset request schema
export const resetRequestSchema = z.object({
  email: emailValidation,
})

// New password schema for reset
export const newPasswordSchema = z.object({
  password: passwordValidation,
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

// Profile update schema
export const profileUpdateSchema = z.object({
  fullName: z.string()
    .min(2, 'Full name must be at least 2 characters')
    .max(100, 'Full name must be less than 100 characters')
    .regex(/^[a-zA-Z\s'-]+$/, 'Name can only contain letters, spaces, hyphens, and apostrophes'),
  phone: z.string()
    .regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number format')
    .optional()
    .nullable(),
  avatar: z.any().optional(), // Handle file upload separately
  preferences: z.object({
    emailNotifications: z.boolean(),
    smsNotifications: z.boolean(),
  }).optional(),
})

// Form error handling utility
export const getFormErrors = (error: any) => {
  if (error.errors) {
    return error.errors.reduce((acc: Record<string, string>, curr: any) => {
      if (curr.path) {
        acc[curr.path.join('.')] = curr.message
      }
      return acc
    }, {})
  }
  return { form: error.message || 'An error occurred' }
}

// Rate limiting utility
export class RateLimiter {
  private attempts: Map<string, number> = new Map()
  private resetTimes: Map<string, number> = new Map()
  private readonly maxAttempts: number
  private readonly windowMs: number

  constructor(maxAttempts = 5, windowMs = 15 * 60 * 1000) { // 15 minutes default
    this.maxAttempts = maxAttempts
    this.windowMs = windowMs
  }

  checkLimit(identifier: string): boolean {
    const now = Date.now()
    const resetTime = this.resetTimes.get(identifier) || 0
    
    if (now > resetTime) {
      this.attempts.set(identifier, 1)
      this.resetTimes.set(identifier, now + this.windowMs)
      return true
    }

    const attempts = this.attempts.get(identifier) || 0
    if (attempts >= this.maxAttempts) {
      return false
    }

    this.attempts.set(identifier, attempts + 1)
    return true
  }

  getRemainingAttempts(identifier: string): number {
    const attempts = this.attempts.get(identifier) || 0
    return Math.max(0, this.maxAttempts - attempts)
  }

  getResetTime(identifier: string): Date | null {
    const resetTime = this.resetTimes.get(identifier)
    return resetTime ? new Date(resetTime) : null
  }

  reset(identifier: string): void {
    this.attempts.delete(identifier)
    this.resetTimes.delete(identifier)
  }
}