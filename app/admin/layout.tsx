"use client"

import type React from "react"

import { useAuth } from "@/lib/auth-context"
import { useRouter, usePathname } from "next/navigation"
import { useEffect } from "react"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import AdminSidebar from "@/components/admin-sidebar"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, loading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  // Skip auth check for the admin login page
  const isAdminLoginPage = pathname === "/admin" || pathname === "/admin/"

  useEffect(() => {
    if (!loading && !isAdminLoginPage && (!user || user.role !== "admin")) {
      router.push("/admin")
    }
  }, [user, loading, router, isAdminLoginPage])

  // For the login page, just render the children without the sidebar
  if (isAdminLoginPage) {
    return children
  }

  if (loading) {
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
    <SidebarProvider>
      <AdminSidebar />
      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  )
}
