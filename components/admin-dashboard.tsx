"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { RefreshCw, Users, ShoppingCart, DollarSign, TrendingUp } from "lucide-react"

interface Order {
  id: string
  productName: string
  productPrice: number
  customerName: string
  customerPhone: string
  agentCode: string
  status: string
  createdAt: string
}

export default function AdminDashboard() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  const loadOrders = () => {
    try {
      if (typeof window !== "undefined") {
        const storedOrders = localStorage.getItem("orders")
        if (storedOrders) {
          const parsedOrders = JSON.parse(storedOrders)
          setOrders(parsedOrders)
        }
      }
    } catch (error) {
      console.error("Error loading orders:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadOrders()
    // Auto-refresh every 5 seconds
    const interval = setInterval(loadOrders, 5000)
    return () => clearInterval(interval)
  }, [])

  const updateOrderStatus = (orderId: string, newStatus: string) => {
    try {
      if (typeof window !== "undefined") {
        const updatedOrders = orders.map((order) => (order.id === orderId ? { ...order, status: newStatus } : order))
        setOrders(updatedOrders)
        localStorage.setItem("orders", JSON.stringify(updatedOrders))
      }
    } catch (error) {
      console.error("Error updating order status:", error)
    }
  }

  const totalOrders = orders.length
  const totalRevenue = orders.reduce((sum, order) => sum + order.productPrice, 0)
  const pendingOrders = orders.filter((order) => order.status === "pending").length
  const completedOrders = orders.filter((order) => order.status === "completed").length

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="h-96 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <Button onClick={loadOrders} variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalOrders}</div>
            <p className="text-xs text-muted-foreground">All time orders</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">GH₵{totalRevenue}</div>
            <p className="text-xs text-muted-foreground">Total earnings</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingOrders}</div>
            <p className="text-xs text-muted-foreground">Awaiting processing</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Orders</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedOrders}</div>
            <p className="text-xs text-muted-foreground">Successfully processed</p>
          </CardContent>
        </Card>
      </div>

      {/* Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
          <CardDescription>Manage and track all customer orders</CardDescription>
        </CardHeader>
        <CardContent>
          {orders.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No orders found</p>
              <p className="text-sm text-muted-foreground mt-2">Orders will appear here when customers place them</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Agent Code</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-mono text-xs">{order.id.slice(-8)}</TableCell>
                    <TableCell className="font-medium">{order.productName}</TableCell>
                    <TableCell>{order.customerName}</TableCell>
                    <TableCell>{order.customerPhone}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{order.agentCode}</Badge>
                    </TableCell>
                    <TableCell>GH₵{order.productPrice}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          order.status === "completed"
                            ? "default"
                            : order.status === "pending"
                              ? "secondary"
                              : "destructive"
                        }
                      >
                        {order.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        {order.status === "pending" && (
                          <Button size="sm" onClick={() => updateOrderStatus(order.id, "completed")}>
                            Complete
                          </Button>
                        )}
                        {order.status === "completed" && (
                          <Button size="sm" variant="outline" onClick={() => updateOrderStatus(order.id, "pending")}>
                            Revert
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
