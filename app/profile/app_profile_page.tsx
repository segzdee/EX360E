import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import ProfileForm from '@/components/forms/ProfileForm'

export default async function Profile() {
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

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Your Profile</h1>
      <ProfileForm initialData={profile} />
    </div>
  )
}

