"use client"

import type React from "react"

import { useAuth } from "@/lib/auth-context"
import AdminSidebar from "@/components/admin-sidebar"
import { SidebarProvider } from "@/components/ui/sidebar"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()

  // Only show sidebar if user is admin
  const showSidebar = user?.role === "admin"

  return (
    <div className="min-h-screen">
      {showSidebar ? (
        <SidebarProvider defaultOpen={true}>
          <div className="flex min-h-screen">
            <AdminSidebar />
            <div className="flex-1 overflow-auto">{children}</div>
          </div>
        </SidebarProvider>
      ) : (
        <div>{children}</div>
      )}
    </div>
  )
}
