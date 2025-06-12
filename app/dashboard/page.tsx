"use client"

import { useSession } from "next-auth/react"
import { redirect } from "next/navigation"

export default function Dashboard() {
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      redirect("/api/auth/signin?callbackUrl=/dashboard")
    },
  })

  if (status === "loading") {
    return <div>Loading...</div>
  }

  const user = session?.user

  return (
    <div className="container mx-auto py-6">
      {/* Add Agent Code Display */}
      <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h2 className="text-lg font-semibold text-blue-800 mb-2">Your Agent Code</h2>
        <div className="text-2xl font-bold text-blue-900 font-mono">
          {user?.agent_code || user?.id?.substring(0, 6).toUpperCase() || "LOADING..."}
        </div>
        <p className="text-sm text-blue-600 mt-1">Use this code when placing orders or for customer reference</p>
      </div>

      {/* Rest of the existing dashboard content */}
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <p>Welcome, {user?.name}!</p>
      <p>Email: {user?.email}</p>
    </div>
  )
}
