// app/dashboard/company/page.tsx
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import CompanyOverview from '@/components/dashboard/company/Overview'
import ActiveShifts from '@/components/dashboard/company/ActiveShifts'
import StaffMetrics from '@/components/dashboard/company/StaffMetrics'
import FinancialSummary from '@/components/dashboard/company/FinancialSummary'

export default async function CompanyDashboard() {
  const supabase = createServerComponentClient({ cookies })
  
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect('/auth/login')
  }

  // Fetch company data
  const { data: companyData } = await supabase
    .from('companies')
    .select('*')
    .eq('profile_id', session.user.id)
    .single()

  // Fetch active shifts
  const { data: activeShifts } = await supabase
    .from('shifts')
    .select('*')
    .eq('company_id', companyData.id)
    .eq('status', 'active')

  // Fetch financial summary
  const { data: financialData } = await supabase
    .from('payments')
    .select('*')
    .eq('company_id', companyData.id)

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-6">Company Dashboard</h1>
      
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <CompanyOverview data={companyData} />
        <ActiveShifts shifts={activeShifts} />
        <StaffMetrics companyId={companyData.id} />
        <FinancialSummary data={financialData} />
      </div>
    </main>
  )
}

// app/dashboard/freelancer/page.tsx
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import FreelancerOverview from '@/components/dashboard/freelancer/Overview'
import AvailableShifts from '@/components/dashboard/freelancer/AvailableShifts'
import EarningsSummary from '@/components/dashboard/freelancer/EarningsSummary'
import UpcomingShifts from '@/components/dashboard/freelancer/UpcomingShifts'

export default async function FreelancerDashboard() {
  const supabase = createServerComponentClient({ cookies })
  
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect('/auth/login')
  }

  // Fetch freelancer data
  const { data: freelancerData } = await supabase
    .from('freelancers')
    .select('*')
    .eq('profile_id', session.user.id)
    .single()

  // Fetch available shifts
  const { data: availableShifts } = await supabase
    .from('shifts')
    .select('*')
    .eq('status', 'open')
    .order('start_time', { ascending: true })
    .limit(5)

  // Fetch upcoming shifts
  const { data: upcomingShifts } = await supabase
    .from('shift_assignments')
    .select('*, shift:shifts(*)')
    .eq('freelancer_id', freelancerData.id)
    .eq('status', 'upcoming')

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-6">Freelancer Dashboard</h1>
      
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <FreelancerOverview data={freelancerData} />
        <AvailableShifts shifts={availableShifts} />
        <EarningsSummary freelancerId={freelancerData.id} />
        <UpcomingShifts shifts={upcomingShifts} />
      </div>
    </main>
  )
}

// app/dashboard/agency/page.tsx
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import AgencyOverview from '@/components/dashboard/agency/Overview'
import StaffManagement from '@/components/dashboard/agency/StaffManagement'
import ClientOverview from '@/components/dashboard/agency/ClientOverview'
import ShiftOperations from '@/components/dashboard/agency/ShiftOperations'

export default async function AgencyDashboard() {
  const supabase = createServerComponentClient({ cookies })
  
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect('/auth/login')
  }

  // Fetch agency data
  const { data: agencyData } = await supabase
    .from('recruiters')
    .select('*')
    .eq('profile_id', session.user.id)
    .single()

  // Fetch staff data
  const { data: staffData } = await supabase
    .from('freelancers')
    .select('*')
    .eq('recruiter_id', agencyData.id)

  // Fetch active shifts
  const { data: activeShifts } = await supabase
    .from('shifts')
    .select('*')
    .eq('recruiter_id', agencyData.id)
    .eq('status', 'active')

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-6">Agency Dashboard</h1>
      
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <AgencyOverview data={agencyData} />
        <StaffManagement staffData={staffData} />
        <ClientOverview agencyId={agencyData.id} />
        <ShiftOperations shifts={activeShifts} />
      </div>
    </main>
  )
}

// app/dashboard/layout.tsx
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import DashboardNav from '@/components/dashboard/DashboardNav'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = createServerComponentClient({ cookies })
  
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect('/auth/login')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardNav />
      <div className="container mx-auto px-4 py-8">
        {children}
      </div>
    </div>
  )
}