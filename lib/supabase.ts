import type { Database } from "@/types/supabase"
import { createClient } from "@supabase/supabase-js"

// Create a single supabase client for the entire server
export const createServerSupabaseClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY!
  return createClient<Database>(supabaseUrl, supabaseKey)
}

// Create a client-side supabase client
export const createClientSupabaseClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY!
  return createClient<Database>(supabaseUrl, supabaseKey)
}
