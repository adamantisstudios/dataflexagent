import { createClient } from "@supabase/supabase-js"

// Create a single supabase client for interacting with your database
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://your-project.supabase.co"
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "your-anon-key"

export const supabase = createClient(supabaseUrl, supabaseKey)

// Create a helper function to check if we're on the server
export const isServer = () => typeof window === "undefined"

// Create a singleton pattern for client-side to prevent multiple instances
let clientSideSupabase: ReturnType<typeof createClient> | null = null

export const getSupabase = () => {
  if (isServer()) {
    return supabase
  }

  if (!clientSideSupabase) {
    clientSideSupabase = createClient(supabaseUrl, supabaseKey)
  }

  return clientSideSupabase
}
