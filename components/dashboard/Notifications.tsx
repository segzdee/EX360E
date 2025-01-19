'use client'

import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Database } from '@/types/supabase'
import { Bell } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

type Notification = Database['public']['Tables']['notifications']['Row']

export function Notifications() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const supabase = createClientComponentClient<Database>()

  useEffect(() => {
    const fetchNotifications = async () => {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5)

      if (error) {
        console.error('Error fetching notifications:', error)
      } else {
        setNotifications(data)
        setUnreadCount(data.filter(n => !n.read).length)
      }
    }

    fetchNotifications()

    // Set up real-time listener for new notifications
    const channel = supabase
      .channel('notifications')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'notifications' }, payload => {
        setNotifications(current => [payload.new as Notification, ...current].slice(0, 5))
        setUnreadCount(count => count + 1)
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [supabase])

  const markAsRead = async (id: string) => {
    const { error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('id', id)

    if (error) {
      console.error('Error marking notification as read:', error)
    } else {
      setNotifications(current =>
        current.map(n => (n.id === id ? { ...n, read: true } : n))
      )
      setUnreadCount(count => Math.max(0, count - 1))
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <span className="absolute top-0 right-0 h-3 w-3 rounded-full bg-red-500 text-[10px] font-bold text-white flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        {notifications.length === 0 ? (
          <DropdownMenuItem>No new notifications</DropdownMenuItem>
        ) : (
          notifications.map(notification => (
            <DropdownMenuItem key={notification.id} onSelect={() => markAsRead(notification.id)}>
              <div className={`w-full ${notification.read ? 'opacity-50' : ''}`}>
                <p className="font-medium">{notification.title}</p>
                <p className="text-sm text-gray-500">{notification.body}</p>
                <p className="text-xs text-gray-400 mt-1">
                  {new Date(notification.created_at).toLocaleString()}
                </p>
              </div>
            </DropdownMenuItem>
          ))
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

