// EXTRASTAFF360 Supabase Client Configuration
// Version: 2.0.0
// Environment: Production

import { createClient } from '@supabase/supabase-js';
import { Database } from './types/supabase';

const supabaseUrl = process.env.SUPABASE_DATABASE_URL!;
const supabaseAnonKey = process.env.PUBLIC_SUPABASE_ANON_KEY!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Initialize Supabase client with type safety
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true
    },
    realtime: {
        params: {
            eventsPerSecond: 10
        }
    },
    db: {
        schema: 'public'
    },
    global: {
        headers: {
            'x-application-name': 'extrastaff360',
            'x-application-version': '2.0.0'
        }
    }
});

// Admin client for backend operations
export const adminSupabase = createClient<Database>(
    supabaseUrl,
    supabaseServiceKey,
    {
        auth: {
            autoRefreshToken: true,
            persistSession: false
        }
    }
);

// Database Types
export type Tables = Database['public']['Tables'];
export type Enums = Database['public']['Enums'];

// Utility functions for database operations
export const db = {
    // User Operations
    users: {
        async create(userData: Tables['users']['Insert']) {
            const { data, error } = await supabase
                .from('users')
                .insert(userData)
                .select()
                .single();
            
            if (error) throw error;
            return data;
        },
        
        async update(id: string, updates: Partial<Tables['users']['Update']>) {
            const { data, error } = await supabase
                .from('users')
                .update(updates)
                .eq('id', id)
                .select()
                .single();
            
            if (error) throw error;
            return data;
        }
    },

    // Shift Operations
    shifts: {
        async create(shiftData: Tables['shifts']['Insert']) {
            const { data, error } = await supabase
                .from('shifts')
                .insert(shiftData)
                .select()
                .single();
            
            if (error) throw error;
            return data;
        },

        async findNearby(lat: number, lng: number, radiusInMeters: number) {
            const { data, error } = await supabase
                .rpc('find_nearby_shifts', {
                    latitude: lat,
                    longitude: lng,
                    radius: radiusInMeters
                });
            
            if (error) throw error;
            return data;
        }
    },

    // Payment Operations
    payments: {
        async process(paymentData: Tables['payments']['Insert']) {
            const { data, error } = await supabase
                .from('payments')
                .insert(paymentData)
                .select()
                .single();
            
            if (error) throw error;
            return data;
        },

        async updateStatus(id: string, status: Enums['payment_status']) {
            const { data, error } = await supabase
                .from('payments')
                .update({ status })
                .eq('id', id)
                .select()
                .single();
            
            if (error) throw error;
            return data;
        }
    },

    // Real-time subscriptions
    subscriptions: {
        onShiftUpdates(callback: (payload: any) => void) {
            return supabase
                .channel('shifts')
                .on(
                    'postgres_changes',
                    { event: '*', schema: 'public', table: 'shifts' },
                    callback
                )
                .subscribe();
        },

        onApplicationUpdates(shiftId: string, callback: (payload: any) => void) {
            return supabase
                .channel(`shift_${shiftId}`)
                .on(
                    'postgres_changes',
                    { 
                        event: '*', 
                        schema: 'public', 
                        table: 'shift_applications',
                        filter: `shift_id=eq.${shiftId}`
                    },
                    callback
                )
                .subscribe();
        }
    }
};

// Error handling middleware
export class SupabaseError extends Error {
    constructor(
        message: string,
        public code: string,
        public details: any
    ) {
        super(message);
        this.name = 'SupabaseError';
    }
}

// Export configured instance
export { supabase, adminSupabase };
