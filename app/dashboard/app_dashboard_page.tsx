import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import JobStats from '@/components/dashboard/JobStats'
import RecentActivity from '@/components/dashboard/RecentActivity'
import UserOverview from '@/components/dashboard/UserOverview'
import JobApplications from '@/components/dashboard/JobApplications'
import StaffApplications from '@/components/dashboard/StaffApplications'
import AgencyDashboard from '@/components/dashboard/AgencyDashboard'
import { CompanyAnalytics } from '@/components/dashboard/CompanyAnalytics'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default async function Dashboard() {
  const supabase = createServerComponentClient({ cookies })
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    redirect('/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', session.user.id)
    .single()

  if (!profile) {
    redirect('/profile/create')
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        {profile.user_type === 'company' && (
          <Button asChild>
            <Link href="/jobs/create">Post a New Job</Link>
          </Button>
        )}
      </div>
      
      <UserOverview user={session.user} profile={profile} />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <JobStats userType={profile.user_type} userId={session.user.id} />
        <RecentActivity userType={profile.user_type} userId={session.user.id} />
      </div>
      
      {profile.user_type === 'company' && (
        <>
          <JobApplications companyId={session.user.id} />
          <CompanyAnalytics companyId={session.user.id} />
        </>
      )}
      
      {profile.user_type === 'staff' && (
        <StaffApplications staffId={session.user.id} />
      )}
      
      {profile.user_type === 'agency' && (
        <AgencyDashboard agencyId={session.user.id} />
      )}
    </div>
  )
}

