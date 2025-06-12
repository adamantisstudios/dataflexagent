"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"
import { type Session, type SupabaseClient, useSession, useSupabaseClient } from "@supabase/auth-helpers-react"
import { useRouter } from "next/router"

// Define the User type
export type User = {
  id: string
  email: string
  name: string
  role: string
  phone: string
  created_at: string
  agent_code: string
}

// Define the AuthContext type
type AuthContextType = {
  supabaseClient: SupabaseClient | null
  session: Session | null
  user: User | null
  isLoading: boolean
  signUp: (email: string, password?: string) => Promise<any>
  signIn: (email: string, password?: string) => Promise<any>
  signOut: () => Promise<boolean>
  register: (email: string, password?: string, name?: string, phone?: string) => Promise<any>
}

// Create the AuthContext
const AuthContext = createContext<AuthContextType | undefined>(undefined)

// AuthProvider component
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const supabaseClient = useSupabaseClient()
  const session = useSession()
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    async function loadUser() {
      setIsLoading(true)
      if (session) {
        const { data: user, error } = await supabaseClient
          .from("users")
          .select("*")
          .eq("email", session?.user?.email)
          .single()

        if (error) {
          console.log("Error fetching user:", error)
        }

        if (user) {
          setUser(user as User)
        }
      } else {
        setUser(null)
      }
      setIsLoading(false)
    }

    loadUser()
  }, [session, supabaseClient])

  const signUp = async (email: string, password?: string) => {
    try {
      const { data, error } = await supabaseClient.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })
      if (error) {
        console.log("Error signing up:", error)
        return { error }
      }
      return { data }
    } catch (error: any) {
      console.log("Error signing up:", error)
      return { error }
    }
  }

  const signIn = async (email: string, password?: string) => {
    try {
      const { data, error } = await supabaseClient.auth.signInWithPassword({
        email,
        password,
      })
      if (error) {
        console.log("Error signing in:", error)
        return { error }
      }
      return { data }
    } catch (error: any) {
      console.log("Error signing in:", error)
      return { error }
    }
  }

  const signOut = async () => {
    try {
      const { error } = await supabaseClient.auth.signOut()
      if (error) {
        console.log("Error signing out:", error)
        return false
      }
      setUser(null)
      router.push("/")
      return true
    } catch (error: any) {
      console.log("Error signing out:", error)
      return false
    }
  }

  // Helper function to generate agent code
  function generateAgentCode(): string {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
    let result = ""
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return result
  }

  const register = async (email: string, password?: string, name?: string, phone?: string) => {
    try {
      const { data: authData, error: authError } = await supabaseClient.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (authError) {
        console.error("Error signing up:", authError)
        return { error: authError }
      }

      // Generate agent code
      const agentCode = generateAgentCode()

      const { data, error } = await supabaseClient
        .from("users")
        .insert([
          {
            name,
            email,
            role: "agent",
            phone,
            agent_code: agentCode,
            created_at: new Date().toISOString(),
          },
        ])
        .select()
        .single()

      if (error) {
        console.error("Error creating user:", error)
        return { error }
      }

      setUser(data as User)
      return { data }
    } catch (error: any) {
      console.error("Error during registration:", error)
      return { error }
    }
  }

  const value: AuthContextType = {
    supabaseClient,
    session,
    user,
    isLoading,
    signUp,
    signIn,
    signOut,
    register,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// Custom hook to use the AuthContext
export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
