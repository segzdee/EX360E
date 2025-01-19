'use client'

import { useState } from 'react'
import { useAuth } from '@/lib/auth/auth-provider'
import { createBrowserClient } from '@supabase/ssr'

export function SettingsForm() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [formData, setFormData] = useState({
    fullName: user?.user_metadata?.full_name || '',
    phone: user?.user_metadata?.phone || '',
    language: user?.user_metadata?.preferred_language || 'en',
    notifications: user?.user_metadata?.notifications_enabled || false,
  })

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      const { error } = await supabase.auth.updateUser({
        data: {
          full_name: formData.fullName,
          phone: formData.phone,
          preferred_language: formData.language,
          notifications_enabled: formData.notifications,
        },
      })

      if (error) throw error

      setMessage('Settings updated successfully')
    } catch (error: any) {
      setMessage(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {message && (
        <div className="p-4 rounded-md bg-primary/10 text-sm">
          {message}
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label htmlFor="fullName" className="block text-sm font-medium">
            Full Name
          </label>
          <input
            type="text"
            id="fullName"
            value={formData.fullName}
            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
            className="mt-1 block w-full rounded-md border p-2"
          />
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium">
            Phone Number
          </label>
          <input
            type="tel"
            id="phone"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className="mt-1 block w-full rounded-md border p-2"
          />
        </div>

        <div>
          <label htmlFor="language" className="block text-sm font-medium">
            Preferred Language
          </label>
          <select
            id="language"
            value={formData.language}
            onChange={(e) => setFormData({ ...formData, language: e.target.value })}
            className="mt-1 block w-full rounded-md border p-2"
          >
            <option value="en">English</option>
            <option value="es">Spanish</option>
            <option value="fr">French</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="notifications"
            checked={formData.notifications}
            onChange={(e) => setFormData({ ...formData, notifications: e.target.checked })}
            className="rounded border"
          />
          <label htmlFor="notifications" className="text-sm font-medium">
            Enable Notifications
          </label>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-md bg-primary py-2 text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
      >
        {loading ? 'Saving...' : 'Save Changes'}
      </button>
    </form>
  )
} 