import { createClient } from "@supabase/supabase-js"

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://your-supabase-url.supabase.co"
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "your-anon-key"

// Create a single supabase client for the entire app
export const supabase = createClient(supabaseUrl, supabaseKey)

// For debugging
console.log("Supabase initialized with URL:", supabaseUrl.substring(0, 15) + "...")
