
import { createClient } from '@supabase/supabase-js'

// Hardcoded Supabase URL and Key to ensure connectivity on published site
const supabaseUrl = 'https://focmfavoetrwfqawvqbd.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZvY21mYXZvZXRyd2ZxYXd2cWJkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg5MjgyMTQsImV4cCI6MjA2NDUwNDIxNH0.1StECCifLR0KxWxCZiyE8O3x7Uq8e03lqAqO6uWYDMM'

// Create Supabase client
export const supabase = supabaseUrl && supabaseAnonKey 
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
