"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getOrdersByUserId } from "@/lib/database"
import type { Order } from "@/lib/types"

export default function OrdersPage() {
  const { user } = useAuth()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    async function fetchOrders() {
      if (!user) return

      try {
        const userOrders = await getOrdersByUserId(user.id)
        setOrders(userOrders)
      } catch (err: any) {
        console.error("Error fetching orders:", err)
        setError(err.message || "Failed to fetch orders")
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [user])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto py-6">
        <h1 className="text-3xl font-bold mb-6">My Orders</h1>
        <div className="bg-red-50 border border-red-200 text-red-800 rounded-md p-4">
          <p>{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">My Orders</h1>

      {orders.length === 0 ? (
        <div className="text-center py-12">
          <h2 className="text-2xl font-semibold text-gray-600">No orders yet</h2>
          <p className="text-muted-foreground mt-2">Your orders will appear here once you make a purchase.</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {orders.map((order) => (
            <Card key={order.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{order.productName}</CardTitle>
                    <CardDescription>Order ID: {order.id.substring(0, 8)}</CardDescription>
                  </div>
                  <Badge
                    className={
                      order.status === "completed"
                        ? "bg-green-100 text-green-800"
                        : order.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                    }
                  >
                    {order.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Price</p>
                    <p className="font-medium">₵{order.price.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Date</p>
                    <p className="font-medium">
                      {new Date(order.createdAt).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                  {order.processingNote && (
                    <div className="col-span-2">
                      <p className="text-sm text-muted-foreground">Processing Note</p>
                      <p className="font-medium">{order.processingNote}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
