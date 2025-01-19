import { Suspense } from 'react'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { SettingsForm } from './settings-form'

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Settings</h3>
        <p className="text-sm text-muted-foreground">
          Manage your account settings and preferences.
        </p>
      </div>
      <Suspense fallback={<LoadingSpinner />}>
        <SettingsForm />
      </Suspense>
    </div>
  )
} 