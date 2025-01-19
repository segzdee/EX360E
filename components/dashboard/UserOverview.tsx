import { User } from '@supabase/auth-helpers-nextjs'
import { Database } from '@/types/supabase'
import { Avatar } from '@/components/ui/Avatar'

type Profile = Database['public']['Tables']['profiles']['Row']

interface UserOverviewProps {
  user: User
  profile: Profile
}

export default function UserOverview({ user, profile }: UserOverviewProps) {
  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex items-center">
        <Avatar src={profile.avatar_url || undefined} alt={profile.full_name || user.email || ''} />
        <div className="ml-4">
          <h2 className="text-xl font-semibold">{profile.full_name || user.email}</h2>
          <p className="text-gray-500">{profile.user_type}</p>
        </div>
      </div>
      {profile.bio && (
        <div className="mt-4">
          <h3 className="text-lg font-medium">Bio</h3>
          <p className="text-gray-700">{profile.bio}</p>
        </div>
      )}
      {profile.location && (
        <div className="mt-4">
          <h3 className="text-lg font-medium">Location</h3>
          <p className="text-gray-700">{profile.location}</p>
        </div>
      )}
    </div>
  )
}

