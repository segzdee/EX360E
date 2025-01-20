import { useAuth } from './AuthContext'
import { ShiftTicker } from './ShiftTicker'

export function ClientDashboard({ children }: { children: React.ReactNode }) {
  const { logout } = useAuth()

  return (
    <div>
      <header>
        <h1>Client Dashboard</h1>
        <button onClick={logout}>Logout</button>
      </header>
      <ShiftTicker />
      <nav>
        <ul>
          <li>Post Shift</li>
          <li>Manage Applications</li>
          <li>Financial Process</li>
          <li>Shift Monitoring</li>
        </ul>
      </nav>
      <main>{children}</main>
    </div>
  )
}

