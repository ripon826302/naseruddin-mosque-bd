
import { createClient } from '@supabase/supabase-js'

// Use dummy values if environment variables are not set
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://dummy.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'dummy-key'

// Only create real client if both URL and key are provided
export const supabase = supabaseUrl !== 'https://dummy.supabase.co' && supabaseAnonKey !== 'dummy-key' 
  ? createClient(supabaseUrl, supabaseAnonKey, {
      realtime: {
        params: {
          eventsPerSecond: 10,
        },
      },
    })
  : null;

// Helper function to check if Supabase is configured
export const isSupabaseConfigured = () => {
  return supabase !== null;
};

// Database types
export type Database = {
  public: {
    Tables: {
      mosque_settings: {
        Row: {
          id: string
          name: string
          address: string
          phone: string
          email: string
          prayer_times: any
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          address: string
          phone: string
          email: string
          prayer_times: any
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          address?: string
          phone?: string
          email?: string
          prayer_times?: any
          created_at?: string
          updated_at?: string
        }
      }
      donors: {
        Row: {
          id: string
          name: string
          phone: string
          address: string
          monthly_amount: number
          status: string
          start_date: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          phone: string
          address: string
          monthly_amount: number
          status: string
          start_date: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          phone?: string
          address?: string
          monthly_amount?: number
          status?: string
          start_date?: string
          created_at?: string
          updated_at?: string
        }
      }
      income: {
        Row: {
          id: string
          date: string
          source: string
          amount: number
          donor_id: string | null
          month: string | null
          receipt_number: string
          created_at: string
        }
        Insert: {
          id?: string
          date: string
          source: string
          amount: number
          donor_id?: string | null
          month?: string | null
          receipt_number: string
          created_at?: string
        }
        Update: {
          id?: string
          date?: string
          source?: string
          amount?: number
          donor_id?: string | null
          month?: string | null
          receipt_number?: string
          created_at?: string
        }
      }
      expenses: {
        Row: {
          id: string
          date: string
          type: string
          amount: number
          month: string | null
          created_at: string
        }
        Insert: {
          id?: string
          date: string
          type: string
          amount: number
          month?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          date?: string
          type?: string
          amount?: number
          month?: string | null
          created_at?: string
        }
      }
      committee: {
        Row: {
          id: string
          name: string
          role: string
          phone: string
          email: string | null
          join_date: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          role: string
          phone: string
          email?: string | null
          join_date: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          role?: string
          phone?: string
          email?: string | null
          join_date?: string
          created_at?: string
        }
      }
      notices: {
        Row: {
          id: string
          title: string
          message: string
          date: string
          type: string
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          message: string
          date: string
          type: string
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          message?: string
          date?: string
          type?: string
          created_at?: string
        }
      }
    }
  }
}
