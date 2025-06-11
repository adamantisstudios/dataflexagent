import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types for our database
export interface DatabaseUser {
  id: string
  name: string
  email: string
  role: "admin" | "agent"
  phone?: string
  created_at: string
}

export interface DatabaseOrder {
  id: string
  product_id: string
  product_name: string
  user_id: string
  user_name: string
  status: "pending" | "processing" | "completed" | "cancelled"
  price: number
  processing_note?: string
  created_at: string
  updated_at: string
}
