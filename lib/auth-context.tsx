"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"

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
  user: User | null
  isLoading: boolean
  adminLogin: (email: string, password: string) => Promise<any>
  login: (email: string, password: string) => Promise<any>
  logout: () => void
  register: (email: string, password: string, name: string, phone: string) => Promise<any>
}

// Create the AuthContext
const AuthContext = createContext<AuthContextType | undefined>(undefined)

// AuthProvider component
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Load user from localStorage on mount
    const loadUser = () => {
      if (typeof window !== "undefined") {
        const savedUser = localStorage.getItem("currentUser")
        if (savedUser) {
          try {
            setUser(JSON.parse(savedUser))
          } catch (e) {
            console.error("Error parsing user from localStorage:", e)
            localStorage.removeItem("currentUser")
          }
        }
      }
      setIsLoading(false)
    }

    loadUser()
  }, [])

  // Helper function to generate agent code
  function generateAgentCode(): string {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
    let result = ""
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return result
  }

  const adminLogin = async (email: string, password: string) => {
    try {
      // Simple mock authentication for admin
      if (email === "admin@dataflexghana.com" && password === "admin123") {
        const adminUser = {
          id: "admin-1",
          email: "admin@dataflexghana.com",
          name: "Admin User",
          role: "admin",
          phone: "0000000000",
          created_at: new Date().toISOString(),
          agent_code: "ADMIN1",
        }
        setUser(adminUser)
        if (typeof window !== "undefined") {
          localStorage.setItem("currentUser", JSON.stringify(adminUser))
        }
        return { success: true, user: adminUser }
      }
      return { error: { message: "Invalid admin credentials" } }
    } catch (error: any) {
      console.error("Login error:", error)
      return { error }
    }
  }

  const login = async (email: string, password: string) => {
    try {
      // Check for existing users in localStorage
      if (typeof window !== "undefined") {
        const users = JSON.parse(localStorage.getItem("users") || "[]")
        const foundUser = users.find((u: User) => u.email === email)

        if (foundUser) {
          setUser(foundUser)
          localStorage.setItem("currentUser", JSON.stringify(foundUser))
          return { success: true, user: foundUser }
        }
      }

      return { error: { message: "Invalid credentials" } }
    } catch (error: any) {
      console.error("Login error:", error)
      return { error }
    }
  }

  const logout = () => {
    setUser(null)
    if (typeof window !== "undefined") {
      localStorage.removeItem("currentUser")
    }
  }

  const register = async (email: string, password: string, name: string, phone: string) => {
    try {
      if (typeof window !== "undefined") {
        const users = JSON.parse(localStorage.getItem("users") || "[]")

        // Check if user already exists
        if (users.find((u: User) => u.email === email)) {
          return { error: { message: "User already exists" } }
        }

        const newUser: User = {
          id: `user_${Date.now()}`,
          email,
          name,
          role: "agent",
          phone,
          created_at: new Date().toISOString(),
          agent_code: generateAgentCode(),
        }

        users.push(newUser)
        localStorage.setItem("users", JSON.stringify(users))
        setUser(newUser)
        localStorage.setItem("currentUser", JSON.stringify(newUser))
        return { success: true, user: newUser }
      }
      return { error: { message: "Browser storage not available" } }
    } catch (error: any) {
      console.error("Registration error:", error)
      return { error }
    }
  }

  const value: AuthContextType = {
    user,
    isLoading,
    adminLogin,
    login,
    logout,
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
