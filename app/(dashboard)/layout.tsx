import { SideNav } from '@/components/dashboard/shared/side-nav'
import { Header } from '@/components/dashboard/shared/header'
import { getUserRole } from '@/lib/utils/auth'
import { Suspense } from 'react'
import { LoadingSpinner } from '@/components/ui/loading-spinner'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const userRole = await getUserRole()

  return (
    <div className="min-h-screen bg-background">
      <Header userRole={userRole} />
      <div className="flex">
        <SideNav userRole={userRole} />
        <main className="flex-1 p-6">
          <Suspense fallback={<LoadingSpinner />}>
            {children}
          </Suspense>
        </main>
      </div>
    </div>
  )
} 