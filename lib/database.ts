import { supabase } from "./supabase"
import type { Order, User } from "./types"

export async function createOrder(orderData: {
  product_id: string
  product_name: string
  user_id: string
  user_name: string
  price: number
}): Promise<Order> {
  const { data, error } = await supabase
    .from("orders")
    .insert([
      {
        ...orderData,
        status: "pending",
        created_at: new Date().toISOString(),
      },
    ])
    .select()
    .single()

  if (error) {
    console.error("Database error:", error)
    throw new Error("Failed to create order")
  }

  return data
}

export async function getOrdersByUserId(userId: string): Promise<Order[]> {
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Database error:", error)
    throw new Error("Failed to fetch orders")
  }

  return data || []
}

export async function getAllOrders(): Promise<Order[]> {
  const { data, error } = await supabase.from("orders").select("*").order("created_at", { ascending: false })

  if (error) {
    console.error("Database error:", error)
    throw new Error("Failed to fetch orders")
  }

  return data || []
}

export async function updateOrderStatus(orderId: string, status: string): Promise<void> {
  const { error } = await supabase.from("orders").update({ status }).eq("id", orderId)

  if (error) {
    console.error("Database error:", error)
    throw new Error("Failed to update order status")
  }
}

export async function getAllUsers(): Promise<User[]> {
  const { data, error } = await supabase.from("users").select("*").order("created_at", { ascending: false })

  if (error) {
    console.error("Database error:", error)
    throw new Error("Failed to fetch users")
  }

  return data || []
}

export async function updateUserProfile(userId: string, updates: { name?: string; phone?: string }): Promise<void> {
  const { error } = await supabase.from("users").update(updates).eq("id", userId)

  if (error) {
    console.error("Database error:", error)
    throw new Error("Failed to update user profile")
  }
}

export async function deleteUser(userId: string): Promise<void> {
  // First delete all orders for this user
  const { error: ordersError } = await supabase.from("orders").delete().eq("user_id", userId)

  if (ordersError) {
    console.error("Database error deleting orders:", ordersError)
    throw new Error("Failed to delete user orders")
  }

  // Then delete the user
  const { error: userError } = await supabase.from("users").delete().eq("id", userId)

  if (userError) {
    console.error("Database error deleting user:", userError)
    throw new Error("Failed to delete user")
  }
}

// Add the missing functions needed for authentication
export async function getUserByEmail(email: string) {
  const { data, error } = await supabase.from("users").select("*").eq("email", email).single()

  if (error && error.code !== "PGSQL_NO_ROWS_RETURNED") {
    console.error("Database error:", error)
    throw new Error("Failed to fetch user")
  }

  return data
}

export async function createUser(userData: {
  name: string
  email: string
  role: "admin" | "agent"
  phone?: string
}) {
  const { data, error } = await supabase
    .from("users")
    .insert([
      {
        ...userData,
        created_at: new Date().toISOString(),
      },
    ])
    .select()
    .single()

  if (error) {
    console.error("Database error:", error)
    throw new Error("Failed to create user")
  }

  return data
}

export async function getAllAgents() {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("role", "agent")
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Database error:", error)
    throw new Error("Failed to fetch agents")
  }

  return data || []
}

export async function updateUserPassword(userId: string, currentPassword: string, newPassword: string) {
  // This is a mock function since we're not actually storing passwords in this demo
  // In a real app, you would verify the current password and update with the new hashed password
  return true
}

export async function getAnalytics() {
  // Mock analytics data
  return {
    totalOrders: 156,
    totalRevenue: 2345.5,
    totalAgents: 24,
    dailyOrders: [
      { date: "2023-06-05", count: 12, revenue: 145.5 },
      { date: "2023-06-06", count: 15, revenue: 187.25 },
      { date: "2023-06-07", count: 10, revenue: 120.0 },
      { date: "2023-06-08", count: 18, revenue: 210.75 },
      { date: "2023-06-09", count: 14, revenue: 168.5 },
      { date: "2023-06-10", count: 16, revenue: 192.0 },
      { date: "2023-06-11", count: 20, revenue: 240.0 },
    ],
    weeklyOrders: [
      { week: "Week 22", count: 68, revenue: 816.0 },
      { week: "Week 23", count: 75, revenue: 900.0 },
      { week: "Week 24", count: 82, revenue: 984.0 },
    ],
    monthlyOrders: [
      { month: "April", count: 280, revenue: 3360.0 },
      { month: "May", count: 320, revenue: 3840.0 },
      { month: "June", count: 156, revenue: 1872.0 },
    ],
    ordersByStatus: [
      { status: "completed", count: 98, percentage: 62.8 },
      { status: "pending", count: 32, percentage: 20.5 },
      { status: "processing", count: 18, percentage: 11.5 },
      { status: "cancelled", count: 8, percentage: 5.2 },
    ],
    topAgents: [
      { name: "John Doe", orders: 24, revenue: 288.0 },
      { name: "Jane Smith", orders: 18, revenue: 216.0 },
      { name: "Robert Johnson", orders: 15, revenue: 180.0 },
      { name: "Emily Davis", orders: 12, revenue: 144.0 },
      { name: "Michael Brown", orders: 10, revenue: 120.0 },
    ],
    recentActivity: [
      { date: "2023-06-11", description: "New agent registered", type: "agent" },
      { date: "2023-06-11", description: "Order #12345 completed", type: "order" },
      { date: "2023-06-10", description: "Payment received for order #12344", type: "payment" },
      { date: "2023-06-10", description: "New order #12346 created", type: "order" },
      { date: "2023-06-09", description: "Agent profile updated", type: "agent" },
    ],
  }
}

export function subscribeToOrders(callback: (orders: any[]) => void) {
  // Mock subscription
  return {
    unsubscribe: () => {},
  }
}

export function subscribeToUserOrders(userId: string, callback: (orders: any[]) => void) {
  // Mock subscription
  return {
    unsubscribe: () => {},
  }
}
