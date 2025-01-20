import { User } from '@supabase/auth-helpers-nextjs'
import { Database } from '@/types/supabase'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

type Profile = Database['public']['Tables']['profiles']['Row']

interface UserOverviewProps {
  user: User
  profile: Profile
}

export default function UserOverview({ user, profile }: UserOverviewProps) {
  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex items-center">
        <Avatar className="h-16 w-16">
          <AvatarImage src={profile.avatar_url || undefined} alt={profile.full_name || user.email || ''} />
          <AvatarFallback>{profile.full_name?.[0] || user.email?.[0] || '?'}</AvatarFallback>
        </Avatar>
        <div className="ml-4">
          <h2 className="text-2xl font-semibold">{profile.full_name || user.email}</h2>
          <p className="text-gray-500 capitalize">{profile.user_type}</p>
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

