import { useAuth } from './AuthContext'
import { ShiftTicker } from './ShiftTicker'

export function AgencyDashboard({ children }: { children: React.ReactNode }) {
  const { logout } = useAuth()

  return (
    <div>
      <header>
        <h1>Agency Dashboard</h1>
        <button onClick={logout}>Logout</button>
      </header>
      <ShiftTicker />
      <nav>
        <ul>
          <li>Staff Management</li>
          <li>Client Management</li>
          <li>Shift Operations</li>
          <li>Financial Operations</li>
        </ul>
      </nav>
      <main>{children}</main>
    </div>
  )
}

