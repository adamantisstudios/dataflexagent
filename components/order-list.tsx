"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { getOrdersByUserId } from "@/lib/data"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, Clock, CheckCircle, Package } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import type { Order } from "@/lib/types"

export default function OrderList() {
  const { user } = useAuth()
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadOrders = async () => {
      if (!user) return

      try {
        setIsLoading(true)
        setError(null)
        const userOrders = await getOrdersByUserId(user.id)
        setOrders(userOrders)
      } catch (err) {
        console.error("Failed to load orders:", err)
        setError("Failed to load your orders. Please try again.")
      } finally {
        setIsLoading(false)
      }
    }

    loadOrders()
  }, [user])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive" className="mb-6">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-12">
        <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-medium mb-2">No Orders Found</h3>
        <p className="text-muted-foreground">You haven't placed any orders yet.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">My Orders</h1>

      {orders.map((order) => (
        <Card key={order.id} className="overflow-hidden">
          <CardHeader className="bg-muted/50">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle>{order.productName}</CardTitle>
                <CardDescription>
                  Order ID: {order.id.substring(0, 8)} • {new Date(order.createdAt).toLocaleDateString()}
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
          <CardContent className="pt-6">
            <div className="flex justify-between items-center mb-4">
              <div>
                <p className="font-medium">Price</p>
                <p className="text-2xl font-bold">GHS {order.price.toFixed(2)}</p>
              </div>

              {order.status === "pending" && (
                <div className="flex items-center text-yellow-600">
                  <Clock className="h-5 w-5 mr-2" />
                  <span>Awaiting payment confirmation</span>
                </div>
              )}

              {order.status === "processing" && (
                <div className="flex items-center text-blue-600">
                  <Package className="h-5 w-5 mr-2" />
                  <span>{order.processingNote || "Processing your order"}</span>
                </div>
              )}

              {order.status === "completed" && (
                <div className="flex items-center text-green-600">
                  <CheckCircle className="h-5 w-5 mr-2" />
                  <span>Data bundle delivered successfully</span>
                </div>
              )}
            </div>

            {order.status === "pending" && (
              <Alert className="bg-yellow-50 border-yellow-200">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Please send payment to <strong>0551999901</strong> via Mobile Money with your Agent ID ({user?.id}) as
                  reference.
                </AlertDescription>
              </Alert>
            )}

            {order.processingNote && order.status !== "pending" && (
              <div className="mt-4 p-4 bg-muted rounded-md">
                <p className="font-medium">Processing Note:</p>
                <p>{order.processingNote}</p>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
