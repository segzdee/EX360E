// lib/validations/auth.ts
import * as z from 'zod'

const passwordSchema = z.string()
  .min(8, 'Password must be at least 8 characters')
  .max(100, 'Password must be less than 100 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')
  .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character')

const emailSchema = z.string()
  .email('Invalid email address')
  .min(5, 'Email must be at least 5 characters')
  .max(100, 'Email must be less than 100 characters')

const phoneSchema = z.string()
  .regex(/^\+?[\d\s-]{10,}$/, 'Invalid phone number format')

// Staff Registration Schema
export const staffSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: emailSchema,
  password: passwordSchema,
  phone: phoneSchema,
  staffCategoryId: z.string().min(1, 'Please select a staff category'),
  preferredPositions: z.array(z.string()).min(1, 'Select at least one position'),
  skills: z.string().min(1, 'Please enter at least one skill'),
  experience: z.string().regex(/^\d*\.?\d+$/, 'Please enter valid years of experience'),
  hourlyRate: z.string().regex(/^\d*\.?\d+$/, 'Please enter valid hourly rate'),
  availability: z.enum(['full_time', 'part_time', 'weekends', 'evenings', 'on_call']),
  hasWorkVisa: z.boolean(),
  hasCertifications: z.boolean(),
  certifications: z.string().optional(),
  preferredLocations: z.string().min(1, 'Please enter at least one location'),
  bio: z.string().max(500, 'Bio must be less than 500 characters')
})

// Agency Registration Schema
export const agencySchema = z.object({
  agencyName: z.string().min(2, 'Agency name must be at least 2 characters'),
  email: emailSchema,
  password: passwordSchema,
  categoryId: z.string().min(1, 'Please select an agency category'),
  website: z.string().url('Invalid website URL').optional(),
  phone: phoneSchema,
  description: z.string().min(50, 'Description must be at least 50 characters'),
  serviceAreas: z.string().min(1, 'Please enter at least one service area'),
  registrationNumber: z.string().min(1, 'Registration number is required'),
  taxId: z.string().min(1, 'Tax ID is required')
})

// Company Registration Schema
export const companySchema = z.object({
  companyName: z.string().min(2, 'Company name must be at least 2 characters'),
  email: emailSchema,
  password: passwordSchema,
  categoryId: z.string().min(1, 'Please select a company category'),
  location: z.string().min(1, 'Location is required'),
  description: z.string().min(50, 'Description must be at least 50 characters')
})

// Login Schema
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(8, 'Password must be at least 8 characters')
})

// Password Reset Schema
export const passwordResetSchema = z.object({
  email: emailSchema
})

// New Password Schema
export const newPasswordSchema = z.object({
  password: passwordSchema,
  confirmPassword: passwordSchema
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
})

// Email Verification Resend Schema
export const resendVerificationSchema = z.object({
  email: emailSchema
})