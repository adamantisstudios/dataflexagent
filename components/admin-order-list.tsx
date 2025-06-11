"use client"

import { useState, useEffect } from "react"
import { getAllOrders, updateOrderStatus, subscribeToOrders } from "@/lib/database"
import type { DatabaseOrder } from "@/lib/supabase"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { toast } from "@/hooks/use-toast"
import { Search, Loader2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"

export default function AdminOrderList() {
  const [orders, setOrders] = useState<DatabaseOrder[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedOrder, setSelectedOrder] = useState<DatabaseOrder | null>(null)
  const [processingNote, setProcessingNote] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  useEffect(() => {
    loadOrders()

    // Subscribe to real-time updates
    const subscription = subscribeToOrders((updatedOrders) => {
      setOrders(updatedOrders)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const loadOrders = async () => {
    try {
      const data = await getAllOrders()
      setOrders(data)
    } catch (error) {
      console.error("Failed to load orders:", error)
      toast({
        title: "Error",
        description: "Failed to load orders",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const filteredOrders = orders.filter(
    (order) =>
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.product_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.user_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.user_id.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      await updateOrderStatus(orderId, newStatus)
      toast({
        title: "Order Updated",
        description: `Order status changed to ${newStatus}`,
        variant: "default",
      })
    } catch (error) {
      console.error("Failed to update order status:", error)
      toast({
        title: "Update Failed",
        description: "There was a problem updating the order status.",
        variant: "destructive",
      })
    }
  }

  const handleProcessOrder = (order: DatabaseOrder) => {
    setSelectedOrder(order)
    setProcessingNote("")
    setIsDialogOpen(true)
  }

  const completeProcessing = async () => {
    if (!selectedOrder) return

    try {
      await updateOrderStatus(selectedOrder.id, "processing", processingNote)
      toast({
        title: "Order Processing",
        description: `Order is now being processed`,
        variant: "default",
      })
      setIsDialogOpen(false)
    } catch (error) {
      console.error("Failed to process order:", error)
      toast({
        title: "Processing Failed",
        description: "There was a problem processing the order.",
        variant: "destructive",
      })
    }
  }

  const completeOrder = async (orderId: string) => {
    try {
      await updateOrderStatus(orderId, "completed", "Data bundle has been delivered successfully.")
      toast({
        title: "Order Completed",
        description: `Order has been marked as completed`,
        variant: "default",
      })
    } catch (error) {
      console.error("Failed to complete order:", error)
      toast({
        title: "Completion Failed",
        description: "There was a problem completing the order.",
        variant: "destructive",
      })
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
          <p className="text-gray-500">No orders found.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Search className="h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search orders by ID, product, or agent..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Product</TableHead>
              <TableHead>Agent</TableHead>
              <TableHead>Agent ID</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.id.substring(0, 8)}</TableCell>
                  <TableCell>{order.product_name}</TableCell>
                  <TableCell>{order.user_name}</TableCell>
                  <TableCell>{order.user_id.substring(0, 8)}</TableCell>
                  <TableCell>{new Date(order.created_at).toLocaleDateString()}</TableCell>
                  <TableCell>GHS {order.price.toFixed(2)}</TableCell>
                  <TableCell>
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
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {order.status === "pending" && (
                        <Button size="sm" onClick={() => handleProcessOrder(order)}>
                          Process
                        </Button>
                      )}
                      {order.status === "processing" && (
                        <Button size="sm" variant="outline" onClick={() => completeOrder(order.id)}>
                          Mark Complete
                        </Button>
                      )}
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
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center">
                  No results found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Process Order</DialogTitle>
            <DialogDescription>Add processing details for order {selectedOrder?.id.substring(0, 8)}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <div className="font-medium">Product:</div>
              <div className="col-span-3">{selectedOrder?.product_name}</div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <div className="font-medium">Agent:</div>
              <div className="col-span-3">{selectedOrder?.user_name}</div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <div className="font-medium">Price:</div>
              <div className="col-span-3">GHS {selectedOrder?.price.toFixed(2)}</div>
            </div>
            <div className="space-y-2">
              <label htmlFor="note" className="font-medium">
                Processing Note:
              </label>
              <Textarea
                id="note"
                placeholder="Add details about the processing (optional)"
                value={processingNote}
                onChange={(e) => setProcessingNote(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={completeProcessing}>Start Processing</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
