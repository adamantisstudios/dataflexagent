"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { createUser, getUserByEmail } from "./database"
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
      // Check if user exists in database
      const dbUser = await getUserByEmail(email)

      if (!dbUser) {
        throw new Error("User not found")
      }

      // For demo purposes, we'll use simple password check
      const isValidPassword = password === "password" // Demo password for agents

      if (!isValidPassword) {
        throw new Error("Invalid password")
      }

      const user: User = {
        id: dbUser.id,
        name: dbUser.name,
        email: dbUser.email,
        role: dbUser.role,
        phone: dbUser.phone,
      }

      setUser(user)
      localStorage.setItem("user", JSON.stringify(user))
    } catch (error) {
      console.error("Login error:", error)
      throw new Error("Invalid credentials")
    }
  }

  // Update the adminLogin function to properly handle admin login
  const adminLogin = async (email: string, password: string) => {
    try {
      // Admin login validation
      if (email !== "admin@dataflexghana.com" || password !== "admin123") {
        throw new Error("Invalid admin credentials")
      }

      // Check if admin exists in database, create if not
      let dbUser = await getUserByEmail(email)

      if (!dbUser) {
        // For demo purposes, create an admin user if it doesn't exist
        const adminUser = {
          name: "Admin User",
          email: "admin@dataflexghana.com",
          role: "admin" as const,
          phone: "0551999901",
        }

        dbUser = await createUser(adminUser)
      }

      const user: User = {
        id: dbUser.id,
        name: dbUser.name,
        email: dbUser.email,
        role: dbUser.role,
        phone: dbUser.phone,
      }

      setUser(user)
      localStorage.setItem("user", JSON.stringify(user))
    } catch (error) {
      console.error("Admin login error:", error)
      throw new Error("Invalid admin credentials")
    }
  }

  const register = async (name: string, email: string, password: string, phone: string) => {
    try {
      // Check if user already exists
      const existingUser = await getUserByEmail(email)
      if (existingUser) {
        throw new Error("User already exists")
      }

      // Create new user in database
      const dbUser = await createUser({
        name,
        email,
        role: "agent",
        phone,
      })

      const user: User = {
        id: dbUser.id,
        name: dbUser.name,
        email: dbUser.email,
        role: dbUser.role,
        phone: dbUser.phone,
      }

      setUser(user)
      localStorage.setItem("user", JSON.stringify(user))
    } catch (error) {
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
