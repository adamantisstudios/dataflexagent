"use client"

import { useAuth } from "@/lib/auth-context"
import { useEffect, useState } from "react"
import { redirect } from "next/navigation"

export default function Dashboard() {
  const { user, isLoading } = useAuth()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted && !isLoading && !user) {
      redirect("/login")
    }
  }, [mounted, isLoading, user])

  if (!mounted || isLoading) {
    return (
      <div className="container mx-auto py-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="h-32 bg-gray-200 rounded mb-4"></div>
          <div className="h-8 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    )
  }

  if (!user) {
    return null // Will redirect
  }

  return (
    <div className="container mx-auto py-6">
      {/* Add Agent Code Display */}
      <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h2 className="text-lg font-semibold text-blue-800 mb-2">Your Agent Code</h2>
        <div className="text-2xl font-bold text-blue-900 font-mono">{user.agent_code}</div>
        <p className="text-sm text-blue-600 mt-1">Use this code when placing orders or for customer reference</p>
      </div>

      {/* Rest of the existing dashboard content */}
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <p>Welcome, {user.name}!</p>
      <p>Email: {user.email}</p>
      <p>Role: {user.role}</p>
    </div>
  )
}
