"use client"

import { useEffect, useState } from "react"
import { getAllOrders, updateOrderStatus } from "@/lib/data"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, Package } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import type { Order } from "@/lib/types"

export default function AdminOrderList() {
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [processingNote, setProcessingNote] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)

  useEffect(() => {
    loadOrders()
  }, [])

  const loadOrders = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const allOrders = await getAllOrders()
      setOrders(allOrders)
    } catch (err) {
      console.error("Failed to load orders:", err)
      setError("Failed to load orders. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    const order = orders.find((o) => o.id === orderId)
    if (!order) return

    if (newStatus === "processing") {
      setSelectedOrder(order)
      setProcessingNote(order.processingNote || "")
      setIsDialogOpen(true)
    } else {
      try {
        await updateOrderStatus(orderId, newStatus)
        setOrders(orders.map((order) => (order.id === orderId ? { ...order, status: newStatus } : order)))
      } catch (err) {
        console.error("Failed to update order status:", err)
      }
    }
  }

  const handleUpdateWithNote = async () => {
    if (!selectedOrder) return

    try {
      setIsUpdating(true)
      await updateOrderStatus(selectedOrder.id, "processing", processingNote)
      setOrders(
        orders.map((order) =>
          order.id === selectedOrder.id ? { ...order, status: "processing", processingNote } : order,
        ),
      )
      setIsDialogOpen(false)
    } catch (err) {
      console.error("Failed to update order status:", err)
    } finally {
      setIsUpdating(false)
    }
  }

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
        <p className="text-muted-foreground">No orders have been placed yet.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">All Orders</h1>

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
                </td>
                <td className="py-3 px-2">
                  <Select defaultValue={order.status} onValueChange={(value) => handleStatusChange(order.id, value)}>
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

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Processing Note</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="mb-2 text-sm text-muted-foreground">
              Add a note about how you're processing this order. This will be visible to the agent.
            </p>
            <Input
              value={processingNote}
              onChange={(e) => setProcessingNote(e.target.value)}
              placeholder="e.g., Verifying payment, will deliver bundle shortly"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)} disabled={isUpdating}>
              Cancel
            </Button>
            <Button onClick={handleUpdateWithNote} disabled={isUpdating}>
              {isUpdating ? "Updating..." : "Update Status"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
