"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { getAllOrders } from "@/lib/data"
import AdminOrderList from "@/components/admin-order-list"
import type { Order } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function AdminOrdersPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!loading && (!user || user.role !== "admin")) {
      router.push("/admin")
    }
  }, [user, loading, router])

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const data = await getAllOrders()
        setOrders(data)
      } catch (error) {
        console.error("Failed to load orders:", error)
      } finally {
        setIsLoading(false)
      }
    }

    if (user && user.role === "admin") {
      loadOrders()
    }
  }, [user])

  if (loading || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!user || user.role !== "admin") return null

  const pendingOrders = orders.filter((order) => order.status === "pending")
  const processingOrders = orders.filter((order) => order.status === "processing")
  const completedOrders = orders.filter((order) => order.status === "completed")
  const cancelledOrders = orders.filter((order) => order.status === "cancelled")

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl">Order Management</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="pending" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="pending">Pending ({pendingOrders.length})</TabsTrigger>
              <TabsTrigger value="processing">Processing ({processingOrders.length})</TabsTrigger>
              <TabsTrigger value="completed">Completed ({completedOrders.length})</TabsTrigger>
              <TabsTrigger value="cancelled">Cancelled ({cancelledOrders.length})</TabsTrigger>
            </TabsList>
            <TabsContent value="pending" className="mt-6">
              <AdminOrderList orders={pendingOrders} onOrdersUpdate={setOrders} />
            </TabsContent>
            <TabsContent value="processing" className="mt-6">
              <AdminOrderList orders={processingOrders} onOrdersUpdate={setOrders} />
            </TabsContent>
            <TabsContent value="completed" className="mt-6">
              <AdminOrderList orders={completedOrders} onOrdersUpdate={setOrders} />
            </TabsContent>
            <TabsContent value="cancelled" className="mt-6">
              <AdminOrderList orders={cancelledOrders} onOrdersUpdate={setOrders} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
