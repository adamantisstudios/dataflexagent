"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { getRecentOrders, getStats } from "@/lib/data"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { Order } from "@/lib/types"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Package, ShoppingCart, Clock, AlertCircle, CheckCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"

export default function DashboardAgent() {
  const { user } = useAuth()
  const [recentOrders, setRecentOrders] = useState<Order[]>([])
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    completedOrders: 0,
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        if (user) {
          const orders = await getRecentOrders(user.id)
          const userStats = await getStats(user.id)
          setRecentOrders(orders)
          setStats(userStats)
        }
      } catch (error) {
        console.error("Failed to load dashboard data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [user])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Agent Dashboard</h1>

      <Alert className="mb-6">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Important Information</AlertTitle>
        <AlertDescription>
          Your Agent ID is <strong>{user?.id}</strong>. Always use this ID when making payments for orders.
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalOrders}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingOrders}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Completed Orders</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completedOrders}</div>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
          <CardDescription>Your most recent data bundle orders</CardDescription>
        </CardHeader>
        <CardContent>
          {recentOrders.length > 0 ? (
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div key={order.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-medium">{order.productName}</h3>
                      <p className="text-sm text-muted-foreground">
                        Order ID: {order.id.substring(0, 8)} • {new Date(order.createdAt).toLocaleDateString()}
                      </p>
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

                  <div className="flex justify-between items-center text-sm">
                    <span>Price: GHS {order.price.toFixed(2)}</span>

                    {order.status === "pending" && (
                      <div className="flex items-center text-yellow-600">
                        <Clock className="h-4 w-4 mr-1" />
                        <span>Awaiting payment confirmation</span>
                      </div>
                    )}

                    {order.status === "processing" && (
                      <div className="flex items-center text-blue-600">
                        <Package className="h-4 w-4 mr-1" />
                        <span>{order.processingNote || "Processing your order"}</span>
                      </div>
                    )}

                    {order.status === "completed" && (
                      <div className="flex items-center text-green-600">
                        <CheckCircle className="h-4 w-4 mr-1" />
                        <span>Data bundle delivered successfully</span>
                      </div>
                    )}
                  </div>

                  {order.status === "pending" && (
                    <Alert className="mt-3 bg-yellow-50">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        Please send payment to <strong>0551999901</strong> via Mobile Money with your Agent ID (
                        {user?.id}) as reference.
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No orders found.</p>
              <p className="text-sm text-muted-foreground mt-2">Place an order to see it here.</p>
              <Link href="/dashboard/products" passHref>
                <Button className="mt-4">Browse Data Bundles</Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>

      {recentOrders.length === 0 && (
        <div className="flex justify-center">
          <Link href="/dashboard/products" passHref>
            <Button>Browse Data Bundles</Button>
          </Link>
        </div>
      )}
    </div>
  )
}
