import { supabase } from "./supabase"
import type { DatabaseUser, DatabaseOrder } from "./supabase"

// User Management
export const createUser = async (userData: {
  name: string
  email: string
  role: "admin" | "agent"
  phone?: string
}): Promise<DatabaseUser> => {
  const { data, error } = await supabase.from("users").insert([userData]).select().single()

  if (error) throw error
  return data
}

export const getUserByEmail = async (email: string): Promise<DatabaseUser | null> => {
  const { data, error } = await supabase.from("users").select("*").eq("email", email).single()

  if (error && error.code !== "PGRST116") throw error
  return data
}

export const getAllAgents = async (): Promise<DatabaseUser[]> => {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("role", "agent")
    .order("created_at", { ascending: false })

  if (error) throw error
  return data || []
}

// Order Management
export const createOrder = async (orderData: {
  product_id: string
  product_name: string
  user_id: string
  user_name: string
  price: number
}): Promise<DatabaseOrder> => {
  const { data, error } = await supabase
    .from("orders")
    .insert([
      {
        ...orderData,
        status: "pending",
      },
    ])
    .select()
    .single()

  if (error) throw error
  return data
}

export const getOrdersByUser = async (userId: string): Promise<DatabaseOrder[]> => {
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })

  if (error) throw error
  return data || []
}

export const getAllOrders = async (): Promise<DatabaseOrder[]> => {
  const { data, error } = await supabase.from("orders").select("*").order("created_at", { ascending: false })

  if (error) throw error
  return data || []
}

export const updateOrderStatus = async (orderId: string, status: string, processingNote?: string): Promise<void> => {
  const updateData: any = {
    status,
    updated_at: new Date().toISOString(),
  }

  if (processingNote) {
    updateData.processing_note = processingNote
  }

  const { error } = await supabase.from("orders").update(updateData).eq("id", orderId)

  if (error) throw error
}

export const getOrderStats = async (userId?: string) => {
  let query = supabase.from("orders").select("status")

  if (userId) {
    query = query.eq("user_id", userId)
  }

  const { data, error } = await query

  if (error) throw error

  const orders = data || []
  return {
    totalOrders: orders.length,
    pendingOrders: orders.filter((order) => order.status === "pending").length,
    processingOrders: orders.filter((order) => order.status === "processing").length,
    completedOrders: orders.filter((order) => order.status === "completed").length,
  }
}

// Real-time subscriptions
export const subscribeToOrders = (callback: (orders: DatabaseOrder[]) => void) => {
  return supabase
    .channel("orders")
    .on("postgres_changes", { event: "*", schema: "public", table: "orders" }, async () => {
      const orders = await getAllOrders()
      callback(orders)
    })
    .subscribe()
}

export const subscribeToUserOrders = (userId: string, callback: (orders: DatabaseOrder[]) => void) => {
  return supabase
    .channel(`user-orders-${userId}`)
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "orders",
        filter: `user_id=eq.${userId}`,
      },
      async () => {
        const orders = await getOrdersByUser(userId)
        callback(orders)
      },
    )
    .subscribe()
}
