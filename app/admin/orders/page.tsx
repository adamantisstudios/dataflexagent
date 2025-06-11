"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function AdminOrdersPage() {
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
      <div className="flex items-center justify-center min-h-[80vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!user || user.role !== "admin") {
    return null
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Orders Management</h1>

      <Card>
        <CardHeader>
          <CardTitle>All Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Orders management functionality will be loaded here.</p>
        </CardContent>
      </Card>
    </div>
  )
}
