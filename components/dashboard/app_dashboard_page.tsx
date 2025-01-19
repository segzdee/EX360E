import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { ClientDashboard } from '@/components/dashboard/ClientDashboard'
import { AgencyDashboard } from '@/components/dashboard/AgencyDashboard'
import { ExtraStaffDashboard } from '@/components/dashboard/ExtraStaffDashboard'

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
    <div className="container mx-auto px-4 py-8">
      {profile.user_type === 'client' && <ClientDashboard />}
      {profile.user_type === 'agency' && <AgencyDashboard />}
      {profile.user_type === 'staff' && <ExtraStaffDashboard />}
    </div>
  )
}

