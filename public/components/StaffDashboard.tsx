import { useAuth } from './AuthContext'
import { ShiftTicker } from './ShiftTicker'

export function StaffDashboard({ children }: { children: React.ReactNode }) {
  const { logout } = useAuth()

  return (
    <div>
      <header>
        <h1>Staff Dashboard</h1>
        <button onClick={logout}>Logout</button>
      </header>
      <ShiftTicker />
      <nav>
        <ul>
          <li>Profile Management</li>
          <li>Availability Management</li>
          <li>Shift Management</li>
          <li>Payment Processing</li>
        </ul>
      </nav>
      <main>{children}</main>
    </div>
  )
}

