import { createClient, RealtimeChannel } from '@supabase/supabase-js'

export type NotificationType = 
  | 'shift_assigned'
  | 'shift_cancelled'
  | 'shift_reminder'
  | 'document_verified'
  | 'payment_received'
  | 'new_rating'
  | 'agency_message'
  | 'company_message'

export interface Notification {
  id: string
  user_id: string
  type: NotificationType
  title: string
  message: string
  data?: Record<string, any>
  read: boolean
  created_at: Date
}

export class NotificationService {
  private supabase
  private realtimeChannel: RealtimeChannel | null = null

  constructor() {
    this.supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
  }

  // Real-time notifications
  subscribeToNotifications(userId: string, onNotification: (notification: Notification) => void) {
    this.realtimeChannel = this.supabase
      .channel(`notifications:${userId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          onNotification(payload.new as Notification)
        }
      )
      .subscribe()
  }

  unsubscribeFromNotifications() {
    if (this.realtimeChannel) {
      this.supabase.removeChannel(this.realtimeChannel)
    }
  }

  // Notification Management
  async getNotifications(userId: string): Promise<Notification[]> {
    const { data, error } = await this.supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  }

  async markAsRead(notificationId: string) {
    const { error } = await this.supabase
      .from('notifications')
      .update({ read: true })
      .eq('id', notificationId)

    if (error) throw error
  }

  async markAllAsRead(userId: string) {
    const { error } = await this.supabase
      .from('notifications')
      .update({ read: true })
      .eq('user_id', userId)

    if (error) throw error
  }

  async deleteNotification(notificationId: string) {
    const { error } = await this.supabase
      .from('notifications')
      .delete()
      .eq('id', notificationId)

    if (error) throw error
  }

  // Push Notifications
  async registerPushToken(userId: string, token: string) {
    const { error } = await this.supabase
      .from('push_tokens')
      .upsert({
        user_id: userId,
        token,
        created_at: new Date().toISOString(),
      })

    if (error) throw error
  }

  async unregisterPushToken(token: string) {
    const { error } = await this.supabase
      .from('push_tokens')
      .delete()
      .eq('token', token)

    if (error) throw error
  }

  // Email Notifications
  async updateEmailPreferences(userId: string, preferences: {
    shift_notifications: boolean
    payment_notifications: boolean
    marketing_emails: boolean
  }) {
    const { error } = await this.supabase
      .from('notification_preferences')
      .upsert({
        user_id: userId,
        email_preferences: preferences,
        updated_at: new Date().toISOString(),
      })

    if (error) throw error
  }

  // SMS Notifications
  async updateSMSPreferences(userId: string, preferences: {
    shift_reminders: boolean
    urgent_notifications: boolean
  }) {
    const { error } = await this.supabase
      .from('notification_preferences')
      .upsert({
        user_id: userId,
        sms_preferences: preferences,
        updated_at: new Date().toISOString(),
      })

    if (error) throw error
  }

  // In-App Notifications
  async createNotification(notification: Omit<Notification, 'id' | 'created_at' | 'read'>) {
    const { data, error } = await this.supabase
      .from('notifications')
      .insert({
        ...notification,
        read: false,
        created_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) throw error
    return data
  }

  // Batch Notifications
  async createBatchNotifications(notifications: Array<Omit<Notification, 'id' | 'created_at' | 'read'>>) {
    const { data, error } = await this.supabase
      .from('notifications')
      .insert(
        notifications.map(notification => ({
          ...notification,
          read: false,
          created_at: new Date().toISOString(),
        }))
      )
      .select()

    if (error) throw error
    return data
  }
} 