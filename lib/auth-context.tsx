"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { supabase } from "./supabase"
import type { User } from "./types"

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  adminLogin: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string, phone: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in from localStorage (for session persistence)
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch (error) {
        console.error("Error parsing stored user:", error)
        localStorage.removeItem("user")
      }
    }
    setLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    try {
      console.log("Attempting login for:", email)

      // Check if user exists in database
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("*")
        .eq("email", email)
        .eq("role", "agent")
        .single()

      if (userError) {
        console.error("User lookup error:", userError)
        throw new Error("User not found")
      }

      if (!userData) {
        throw new Error("User not found")
      }

      // For demo purposes, we'll use simple password check
      // In production, you should use proper password hashing
      const isValidPassword = password === "password" || password === userData.password

      if (!isValidPassword) {
        throw new Error("Invalid password")
      }

      const user: User = {
        id: userData.id,
        name: userData.name,
        email: userData.email,
        role: userData.role,
        phone: userData.phone,
      }

      console.log("Login successful for:", user.name)
      setUser(user)
      localStorage.setItem("user", JSON.stringify(user))
    } catch (error: any) {
      console.error("Login error:", error)
      throw new Error(error.message || "Invalid credentials")
    }
  }

  const adminLogin = async (email: string, password: string) => {
    try {
      console.log("Attempting admin login for:", email)

      // Admin login validation
      if (email !== "admin@dataflexghana.com" || password !== "admin123") {
        throw new Error("Invalid admin credentials")
      }

      // Check if admin exists in database, create if not
      const { data: adminData, error: adminError } = await supabase
        .from("users")
        .select("*")
        .eq("email", email)
        .single()

      let userData = adminData

      if (adminError && adminError.code === "PGRST116") {
        // Admin doesn't exist, create it
        console.log("Creating admin user")
        const { data: newAdmin, error: createError } = await supabase
          .from("users")
          .insert([
            {
              name: "Admin User",
              email: "admin@dataflexghana.com",
              role: "admin",
              phone: "0551999901",
              created_at: new Date().toISOString(),
            },
          ])
          .select()
          .single()

        if (createError) {
          console.error("Admin creation error:", createError)
          throw new Error("Failed to create admin user")
        }

        userData = newAdmin
      } else if (adminError) {
        console.error("Admin lookup error:", adminError)
        throw new Error("Error looking up admin user")
      }

      if (!userData) {
        throw new Error("Admin user not found")
      }

      const user: User = {
        id: userData.id,
        name: userData.name,
        email: userData.email,
        role: userData.role,
        phone: userData.phone,
      }

      console.log("Admin login successful for:", user.name)
      setUser(user)
      localStorage.setItem("user", JSON.stringify(user))
    } catch (error: any) {
      console.error("Admin login error:", error)
      throw new Error(error.message || "Invalid admin credentials")
    }
  }

  const register = async (name: string, email: string, password: string, phone: string) => {
    try {
      console.log("Registering new agent:", { name, email, phone })

      // Check if user already exists
      const { data: existingUser, error: lookupError } = await supabase
        .from("users")
        .select("*")
        .eq("email", email)
        .single()

      if (lookupError && lookupError.code !== "PGRST116") {
        console.error("User lookup error:", lookupError)
        throw new Error("Error checking for existing user")
      }

      if (existingUser) {
        throw new Error("User already exists with this email")
      }

      // Create new user in database
      const { data: newUser, error: createError } = await supabase
        .from("users")
        .insert([
          {
            name,
            email,
            password, // In production, hash this password
            role: "agent",
            phone,
            created_at: new Date().toISOString(),
          },
        ])
        .select()
        .single()

      if (createError) {
        console.error("User creation error:", createError)
        throw new Error("Failed to create user account")
      }

      if (!newUser) {
        throw new Error("Failed to create user account")
      }

      const user: User = {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        phone: newUser.phone,
      }

      console.log("Registration successful for:", user.name)
      setUser(user)
      localStorage.setItem("user", JSON.stringify(user))
    } catch (error: any) {
      console.error("Registration error:", error)
      throw error
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("user")
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, adminLogin, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
