"use client"

import type React from "react"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted && !loading && (!user || user.role !== "admin")) {
      router.push("/admin")
    }
  }, [user, loading, router, mounted])

  if (!mounted || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!user || user.role !== "admin") {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold">DataFlex Ghana Admin</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">Welcome, {user.name}</span>
              <button
                onClick={() => {
                  localStorage.removeItem("user")
                  router.push("/")
                }}
                className="text-sm text-red-600 hover:text-red-800"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto">{children}</main>
    </div>
  )
}
