import { useAuth } from './AuthContext'
import { ClientDashboard } from './ClientDashboard'
import { StaffDashboard } from './StaffDashboard'
import { AgencyDashboard } from './AgencyDashboard'
import { LandingPage } from './LandingPage'

export function Layout({ children }: { children: React.ReactNode }) {
  const { status, userType } = useAuth()

  if (status === "loading") {
    return <div>Loading...</div>
  }

  if (status === "unauthenticated") {
    return <LandingPage />
  }

  return (
    <div className="min-h-screen bg-background">
      {userType === 'client' && <ClientDashboard>{children}</ClientDashboard>}
      {userType === 'staff' && <StaffDashboard>{children}</StaffDashboard>}
      {userType === 'agency' && <AgencyDashboard>{children}</AgencyDashboard>}
    </div>
  )
}

