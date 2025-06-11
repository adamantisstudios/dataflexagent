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
