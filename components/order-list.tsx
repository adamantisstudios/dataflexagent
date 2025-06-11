"use client"

import { useState, useEffect } from "react"
import { getOrdersByUser, subscribeToUserOrders } from "@/lib/database"
import type { DatabaseOrder } from "@/lib/supabase"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/lib/auth-context"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle, Package, Loader2, Clock } from "lucide-react"
import { Progress } from "@/components/ui/progress"

interface OrderListProps {
  isAdmin?: boolean
}

export default function OrderList({ isAdmin = false }: OrderListProps) {
  const [orders, setOrders] = useState<DatabaseOrder[]>([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  useEffect(() => {
    if (!user) return

    loadOrders()

    // Subscribe to real-time updates for user's orders
    const subscription = subscribeToUserOrders(user.id, (updatedOrders) => {
      setOrders(updatedOrders)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [user])

  const loadOrders = async () => {
    if (!user) return

    try {
      const data = await getOrdersByUser(user.id)
      setOrders(data)
    } catch (error) {
      console.error("Failed to load orders:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading orders...</span>
      </div>
    )
  }

  if (orders.length === 0) {
    return (
      <Card>
        <CardContent className="py-10 text-center">
          <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-gray-500">No orders found.</p>
          <p className="text-sm text-muted-foreground mt-2">Your orders will appear here once you make a purchase.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {orders.map((order) => (
        <Card key={order.id}>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle>{order.product_name}</CardTitle>
                <CardDescription>
                  Order ID: {order.id.substring(0, 8)} • {new Date(order.created_at).toLocaleDateString()}
                </CardDescription>
              </div>
              <Badge
                className={
                  order.status === "completed"
                    ? "bg-green-100 text-green-800 hover:bg-green-100"
                    : order.status === "pending"
                      ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
                      : order.status === "processing"
                        ? "bg-blue-100 text-blue-800 hover:bg-blue-100"
                        : "bg-red-100 text-red-800 hover:bg-red-100"
                }
              >
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b pb-2">
                <span>Price:</span>
                <span className="font-bold">GHS {order.price.toFixed(2)}</span>
              </div>

              {order.status === "pending" && !isAdmin && (
                <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-md">
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Payment Instructions:
                  </h4>
                  <p>
                    Please send payment to: <strong>0551999901</strong> via Mobile Money.
                  </p>
                  <p className="mt-2">Include your Agent ID ({user?.id.substring(0, 8)}) in the payment description.</p>
                  <p className="mt-3 text-sm text-muted-foreground">
                    After payment, check your order status from time to time.
                  </p>
                  <p className="mt-1 text-sm font-medium text-muted-foreground">
                    Processing time: 1-40 minutes after payment confirmation.
                  </p>
                </div>
              )}

              {order.status === "processing" && !isAdmin && (
                <div className="space-y-4">
                  <Alert className="bg-blue-50">
                    <Package className="h-4 w-4 text-blue-600" />
                    <AlertTitle>Your order is being processed</AlertTitle>
                    <AlertDescription>
                      {order.processing_note || "Your data bundle is being processed and will be delivered shortly."}
                    </AlertDescription>
                  </Alert>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Processing</span>
                      <span>Estimated time: 1-30 minutes</span>
                    </div>
                    <Progress value={75} className="h-2" />
                  </div>
                </div>
              )}

              {order.status === "completed" && !isAdmin && (
                <Alert className="bg-green-50">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertTitle>Data Bundle Delivered</AlertTitle>
                  <AlertDescription>
                    Your data bundle has been successfully delivered. Thank you for using DataFlex Ghana!
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
