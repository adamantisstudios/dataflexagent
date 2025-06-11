"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, ShoppingCart, Clock, Users, Trash2, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { supabase } from "@/lib/supabase"
import type { Order } from "@/lib/types"

interface AdminStats {
  totalOrders: number
  pendingOrders: number
  completedOrders: number
  totalAgents: number
}

export default function AdminDashboard() {
  const [orders, setOrders] = useState<Order[]>([])
  const [stats, setStats] = useState<AdminStats>({
    totalOrders: 0,
    pendingOrders: 0,
    completedOrders: 0,
    totalAgents: 0,
  })
  const [isLoading, setIsLoading] = useState(true)
  const [isClearingOrders, setIsClearingOrders] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadData = async () => {
    try {
      setIsLoading(true)
      setError(null)

      // Fetch all orders
      const { data: ordersData, error: ordersError } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false })

      if (ordersError) {
        throw new Error("Failed to fetch orders")
      }

      // Fetch all agents
      const { data: agentsData, error: agentsError } = await supabase.from("users").select("*").eq("role", "agent")

      if (agentsError) {
        throw new Error("Failed to fetch agents")
      }

      // Transform orders data
      const transformedOrders: Order[] = (ordersData || []).map((order) => ({
        id: order.id,
        productId: order.product_id,
        productName: order.product_name,
        userId: order.user_id,
        userName: order.user_name,
        status: order.status,
        price: order.price,
        createdAt: order.created_at,
        updatedAt: order.updated_at,
        processingNote: order.processing_note,
      }))

      // Calculate stats
      const totalOrders = transformedOrders.length
      const pendingOrders = transformedOrders.filter((order) => order.status === "pending").length
      const completedOrders = transformedOrders.filter((order) => order.status === "completed").length
      const totalAgents = agentsData?.length || 0

      setOrders(transformedOrders)
      setStats({
        totalOrders,
        pendingOrders,
        completedOrders,
        totalAgents,
      })
    } catch (error: any) {
      console.error("Failed to load admin dashboard data:", error)
      setError(error.message || "Failed to load dashboard data")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from("orders")
        .update({
          status: newStatus,
          updated_at: new Date().toISOString(),
        })
        .eq("id", orderId)

      if (error) {
        throw new Error("Failed to update order status")
      }

      // Update local state
      setOrders((prevOrders) =>
        prevOrders.map((order) => (order.id === orderId ? { ...order, status: newStatus } : order)),
      )

      // Update stats
      const updatedOrders = orders.map((order) => (order.id === orderId ? { ...order, status: newStatus } : order))
      const newStats = {
        ...stats,
        pendingOrders: updatedOrders.filter((order) => order.status === "pending").length,
        completedOrders: updatedOrders.filter((order) => order.status === "completed").length,
      }
      setStats(newStats)
    } catch (error: any) {
      console.error("Failed to update order status:", error)
      setError("Failed to update order status")
    }
  }

  const handleClearAllOrders = async () => {
    try {
      setIsClearingOrders(true)

      const { error } = await supabase.from("orders").delete().neq("id", "placeholder")

      if (error) {
        throw new Error("Failed to clear orders")
      }

      setOrders([])
      setStats((prevStats) => ({
        ...prevStats,
        totalOrders: 0,
        pendingOrders: 0,
        completedOrders: 0,
      }))
    } catch (error: any) {
      console.error("Failed to clear orders:", error)
      setError("Failed to clear orders")
    } finally {
      setIsClearingOrders(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="destructive" className="flex items-center gap-2">
              <Trash2 className="h-4 w-4" />
              Clear All Orders
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-500" />
                Clear All Orders
              </DialogTitle>
              <DialogDescription>
                This action will permanently delete all orders from the database. This cannot be undone. User accounts
                will be preserved.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" disabled={isClearingOrders}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleClearAllOrders} disabled={isClearingOrders}>
                {isClearingOrders ? "Clearing..." : "Yes, Clear All Orders"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
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
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Agents</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalAgents}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
          <CardDescription>Manage all customer orders</CardDescription>
        </CardHeader>
        <CardContent>
          {orders.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-2">Order ID</th>
                    <th className="text-left py-3 px-2">Product</th>
                    <th className="text-left py-3 px-2">Agent</th>
                    <th className="text-left py-3 px-2">Date</th>
                    <th className="text-left py-3 px-2">Price</th>
                    <th className="text-left py-3 px-2">Status</th>
                    <th className="text-left py-3 px-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id} className="border-b">
                      <td className="py-3 px-2">{order.id.substring(0, 8)}</td>
                      <td className="py-3 px-2">{order.productName}</td>
                      <td className="py-3 px-2">{order.userName}</td>
                      <td className="py-3 px-2">{new Date(order.createdAt).toLocaleDateString()}</td>
                      <td className="py-3 px-2">GHS {order.price.toFixed(2)}</td>
                      <td className="py-3 px-2">
                        <span
                          className={`px-2 py-1 rounded text-xs ${
                            order.status === "completed"
                              ? "bg-green-100 text-green-800"
                              : order.status === "pending"
                                ? "bg-yellow-100 text-yellow-800"
                                : order.status === "processing"
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                      </td>
                      <td className="py-3 px-2">
                        <Select
                          defaultValue={order.status}
                          onValueChange={(value) => handleStatusChange(order.id, value)}
                        >
                          <SelectTrigger className="w-[130px]">
                            <SelectValue placeholder="Update Status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="processing">Processing</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
                          </SelectContent>
                        </Select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8">
              <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No orders found.</p>
              <p className="text-sm text-muted-foreground mt-2">Orders will appear here when agents place them.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
