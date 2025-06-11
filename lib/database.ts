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
  const { data: users, error: usersError } = await supabase
    .from("users")
    .select("*")
    .eq("role", "agent")
    .order("created_at", { ascending: false })

  if (usersError) throw usersError

  // Get order counts for each agent
  const { data: orders, error: ordersError } = await supabase.from("orders").select("user_id")

  if (ordersError) throw ordersError

  // Count orders per agent
  const orderCounts = orders.reduce((acc: Record<string, number>, order) => {
    acc[order.user_id] = (acc[order.user_id] || 0) + 1
    return acc
  }, {})

  // Add order count to each user
  const usersWithOrderCount = users.map((user) => ({
    ...user,
    orderCount: orderCounts[user.id] || 0,
  }))

  return usersWithOrderCount || []
}

export const deleteUser = async (userId: string): Promise<void> => {
  // First delete all orders for this user
  const { error: ordersError } = await supabase.from("orders").delete().eq("user_id", userId)

  if (ordersError) throw ordersError

  // Then delete the user
  const { error: userError } = await supabase.from("users").delete().eq("id", userId)

  if (userError) throw userError
}

export const updateUserProfile = async (
  userId: string,
  updates: {
    name?: string
    phone?: string
  },
): Promise<void> => {
  const { error } = await supabase.from("users").update(updates).eq("id", userId)

  if (error) throw error
}

export const updateUserPassword = async (
  userId: string,
  currentPassword: string,
  newPassword: string,
): Promise<void> => {
  // In a real app, you'd verify the current password and hash the new one
  // For this demo, we'll just simulate the password change
  if (currentPassword !== "admin123" && currentPassword !== "password") {
    throw new Error("Invalid current password")
  }

  // In production, you'd hash the password and store it
  // For now, we'll just simulate success
  return Promise.resolve()
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

// Analytics
export const getAnalytics = async () => {
  const { data: orders, error: ordersError } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false })

  if (ordersError) throw ordersError

  const { data: users, error: usersError } = await supabase.from("users").select("*").eq("role", "agent")

  if (usersError) throw usersError

  // Calculate analytics
  const totalOrders = orders.length
  const totalRevenue = orders.reduce((sum, order) => sum + order.price, 0)
  const totalAgents = users.length

  // Orders by status
  const statusCounts = orders.reduce((acc: Record<string, number>, order) => {
    acc[order.status] = (acc[order.status] || 0) + 1
    return acc
  }, {})

  const ordersByStatus = Object.entries(statusCounts).map(([status, count]) => ({
    status,
    count,
    percentage: (count / totalOrders) * 100,
  }))

  // Daily orders (last 7 days)
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() - i)
    return date.toISOString().split("T")[0]
  }).reverse()

  const dailyOrders = last7Days.map((date) => {
    const dayOrders = orders.filter((order) => order.created_at.split("T")[0] === date)
    return {
      date,
      count: dayOrders.length,
      revenue: dayOrders.reduce((sum, order) => sum + order.price, 0),
    }
  })

  // Top agents
  const agentStats = users
    .map((user) => {
      const userOrders = orders.filter((order) => order.user_id === user.id)
      return {
        name: user.name,
        orders: userOrders.length,
        revenue: userOrders.reduce((sum, order) => sum + order.price, 0),
      }
    })
    .sort((a, b) => b.orders - a.orders)

  return {
    totalOrders,
    totalRevenue,
    totalAgents,
    dailyOrders,
    weeklyOrders: [], // You can implement weekly/monthly if needed
    monthlyOrders: [],
    ordersByStatus,
    topAgents: agentStats,
    recentActivity: [],
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
