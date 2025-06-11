import { supabase } from "./supabase"
import type { Order, User } from "./types"

export async function createOrder(orderData: {
  product_id: string
  product_name: string
  user_id: string
  user_name: string
  price: number
}): Promise<Order> {
  console.log("Creating order:", orderData)

  const { data, error } = await supabase
    .from("orders")
    .insert([
      {
        product_id: orderData.product_id,
        product_name: orderData.product_name,
        user_id: orderData.user_id,
        user_name: orderData.user_name,
        price: orderData.price,
        status: "pending",
        created_at: new Date().toISOString(),
      },
    ])
    .select()
    .single()

  if (error) {
    console.error("Database error creating order:", error)
    throw new Error("Failed to create order")
  }

  console.log("Order created successfully:", data.id)

  return {
    id: data.id,
    productId: data.product_id,
    productName: data.product_name,
    userId: data.user_id,
    userName: data.user_name,
    status: data.status,
    price: data.price,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
    processingNote: data.processing_note,
  }
}

export async function getOrdersByUserId(userId: string): Promise<Order[]> {
  console.log("Fetching orders for user:", userId)

  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Database error fetching orders:", error)
    throw new Error("Failed to fetch orders")
  }

  console.log(`Found ${data?.length || 0} orders for user ${userId}`)

  return (data || []).map((order) => ({
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
}

export async function getAllOrders(): Promise<Order[]> {
  console.log("Fetching all orders")

  const { data, error } = await supabase.from("orders").select("*").order("created_at", { ascending: false })

  if (error) {
    console.error("Database error fetching all orders:", error)
    throw new Error("Failed to fetch orders")
  }

  console.log(`Found ${data?.length || 0} total orders`)

  return (data || []).map((order) => ({
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
}

export async function updateOrderStatus(orderId: string, status: string, processingNote?: string): Promise<void> {
  console.log(`Updating order ${orderId} status to ${status}`)

  const updateData: any = {
    status,
    updated_at: new Date().toISOString(),
  }

  if (processingNote) {
    updateData.processing_note = processingNote
  }

  const { error } = await supabase.from("orders").update(updateData).eq("id", orderId)

  if (error) {
    console.error("Database error updating order:", error)
    throw new Error("Failed to update order status")
  }

  console.log(`Order ${orderId} updated successfully`)
}

export async function getAllUsers(): Promise<User[]> {
  console.log("Fetching all users")

  const { data, error } = await supabase.from("users").select("*").order("created_at", { ascending: false })

  if (error) {
    console.error("Database error fetching users:", error)
    throw new Error("Failed to fetch users")
  }

  console.log(`Found ${data?.length || 0} total users`)

  return (data || []).map((user) => ({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    phone: user.phone,
  }))
}

export async function getAllAgents(): Promise<User[]> {
  console.log("Fetching all agents")

  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("role", "agent")
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Database error fetching agents:", error)
    throw new Error("Failed to fetch agents")
  }

  console.log(`Found ${data?.length || 0} agents`)

  // Get order counts for each agent
  const agentsWithOrders = await Promise.all(
    (data || []).map(async (agent) => {
      const { count, error: countError } = await supabase
        .from("orders")
        .select("*", { count: "exact", head: true })
        .eq("user_id", agent.id)

      if (countError) {
        console.error(`Error getting order count for agent ${agent.id}:`, countError)
      }

      return {
        id: agent.id,
        name: agent.name,
        email: agent.email,
        role: agent.role,
        phone: agent.phone,
        orderCount: count || 0,
      }
    }),
  )

  return agentsWithOrders
}

export async function getAnalytics() {
  try {
    console.log("Fetching analytics data...")

    // Get all orders
    const { data: orders, error: ordersError } = await supabase.from("orders").select("*")

    if (ordersError) {
      console.error("Orders error:", ordersError)
      throw ordersError
    }

    console.log("Orders fetched:", orders?.length || 0)

    // Get all agents
    const { data: agents, error: agentsError } = await supabase.from("users").select("*").eq("role", "agent")

    if (agentsError) {
      console.error("Agents error:", agentsError)
      throw agentsError
    }

    console.log("Agents fetched:", agents?.length || 0)

    const totalOrders = orders?.length || 0
    const totalRevenue = orders?.reduce((sum, order) => sum + (order.price || 0), 0) || 0
    const totalAgents = agents?.length || 0

    // Orders by status
    const statusCounts =
      orders?.reduce(
        (acc, order) => {
          const status = order.status || "unknown"
          acc[status] = (acc[status] || 0) + 1
          return acc
        },
        {} as Record<string, number>,
      ) || {}

    const ordersByStatus = Object.entries(statusCounts).map(([status, count]) => ({
      status,
      count,
      percentage: totalOrders > 0 ? (count / totalOrders) * 100 : 0,
    }))

    // Top agents by order count
    const agentOrderCounts =
      agents
        ?.map((agent) => {
          const agentOrders = orders?.filter((order) => order.user_id === agent.id) || []
          return {
            name: agent.name,
            orders: agentOrders.length,
            revenue: agentOrders.reduce((sum, order) => sum + (order.price || 0), 0),
          }
        })
        .sort((a, b) => b.orders - a.orders) || []

    // Daily orders for the last 7 days
    const dailyOrders = []
    for (let i = 6; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      const dateStr = date.toISOString().split("T")[0]

      const dayOrders =
        orders?.filter((order) => {
          const orderDate = new Date(order.created_at).toISOString().split("T")[0]
          return orderDate === dateStr
        }) || []

      dailyOrders.push({
        date: dateStr,
        count: dayOrders.length,
        revenue: dayOrders.reduce((sum, order) => sum + (order.price || 0), 0),
      })
    }

    // Weekly orders (simplified - using daily data)
    const weeklyOrders = dailyOrders.map((day) => ({
      week: day.date,
      count: day.count,
      revenue: day.revenue,
    }))

    // Monthly orders (simplified - using daily data)
    const monthlyOrders = dailyOrders.map((day) => ({
      month: day.date,
      count: day.count,
      revenue: day.revenue,
    }))

    // Recent activity
    const recentActivity =
      orders?.slice(0, 10).map((order) => ({
        date: order.created_at,
        description: `Order ${order.id.substring(0, 8)} - ${order.product_name}`,
        type: order.status,
      })) || []

    const analyticsData = {
      totalOrders,
      totalRevenue,
      totalAgents,
      dailyOrders,
      weeklyOrders,
      monthlyOrders,
      ordersByStatus,
      topAgents: agentOrderCounts,
      recentActivity,
    }

    console.log("Analytics data prepared:", analyticsData)
    return analyticsData
  } catch (error) {
    console.error("Analytics error:", error)
    // Return empty data structure instead of throwing
    return {
      totalOrders: 0,
      totalRevenue: 0,
      totalAgents: 0,
      dailyOrders: [],
      weeklyOrders: [],
      monthlyOrders: [],
      ordersByStatus: [],
      topAgents: [],
      recentActivity: [],
    }
  }
}

export async function createUser(userData: {
  name: string
  email: string
  role: "admin" | "agent"
  phone?: string
  password?: string
}): Promise<User> {
  console.log("Creating user:", userData.name, userData.email, userData.role)

  const { data, error } = await supabase
    .from("users")
    .insert([
      {
        name: userData.name,
        email: userData.email,
        role: userData.role,
        phone: userData.phone,
        password: userData.password || "password", // Default password
        created_at: new Date().toISOString(),
      },
    ])
    .select()
    .single()

  if (error) {
    console.error("Database error creating user:", error)
    throw new Error("Failed to create user")
  }

  console.log("User created successfully:", data.id)

  return {
    id: data.id,
    name: data.name,
    email: data.email,
    role: data.role,
    phone: data.phone,
  }
}

export async function getUserByEmail(email: string): Promise<User | null> {
  console.log("Looking up user by email:", email)

  const { data, error } = await supabase.from("users").select("*").eq("email", email).single()

  if (error) {
    if (error.code === "PGRST116") {
      // No rows returned
      console.log("No user found with email:", email)
      return null
    }
    console.error("Database error looking up user:", error)
    throw new Error("Failed to fetch user")
  }

  console.log("User found:", data.id, data.name)

  return {
    id: data.id,
    name: data.name,
    email: data.email,
    role: data.role,
    phone: data.phone,
  }
}

export async function updateUserProfile(userId: string, updates: { name?: string; phone?: string }): Promise<void> {
  console.log("Updating user profile:", userId, updates)

  const { error } = await supabase
    .from("users")
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq("id", userId)

  if (error) {
    console.error("Database error updating user:", error)
    throw new Error("Failed to update user profile")
  }

  console.log("User profile updated successfully")
}

export async function updateUserPassword(userId: string, currentPassword: string, newPassword: string): Promise<void> {
  console.log("Updating user password:", userId)

  // First verify current password
  const { data: user, error: fetchError } = await supabase.from("users").select("password").eq("id", userId).single()

  if (fetchError) {
    console.error("Database error fetching user:", fetchError)
    throw new Error("Failed to verify current password")
  }

  if (user.password !== currentPassword) {
    throw new Error("Current password is incorrect")
  }

  // Update password
  const { error } = await supabase
    .from("users")
    .update({
      password: newPassword,
      updated_at: new Date().toISOString(),
    })
    .eq("id", userId)

  if (error) {
    console.error("Database error updating password:", error)
    throw new Error("Failed to update password")
  }

  console.log("User password updated successfully")
}

export async function deleteUser(userId: string): Promise<void> {
  console.log("Deleting user:", userId)

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

  console.log("User and associated orders deleted successfully")
}

export async function getStats(userId: string) {
  try {
    console.log("Getting stats for user:", userId)

    const { data: orders, error } = await supabase.from("orders").select("*").eq("user_id", userId)

    if (error) {
      console.error("Error fetching user stats:", error)
      throw error
    }

    const stats = {
      totalOrders: orders?.length || 0,
      pendingOrders: orders?.filter((order) => order.status === "pending").length || 0,
      completedOrders: orders?.filter((order) => order.status === "completed").length || 0,
    }

    console.log("User stats:", stats)
    return stats
  } catch (error) {
    console.error("Failed to get stats:", error)
    return {
      totalOrders: 0,
      pendingOrders: 0,
      completedOrders: 0,
    }
  }
}

export async function getRecentOrders(userId: string, limit = 5): Promise<Order[]> {
  try {
    console.log(`Getting ${limit} recent orders for user:`, userId)

    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(limit)

    if (error) {
      console.error("Error fetching recent orders:", error)
      throw error
    }

    console.log(`Found ${data?.length || 0} recent orders`)

    return (data || []).map((order) => ({
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
  } catch (error) {
    console.error("Failed to get recent orders:", error)
    return []
  }
}

export async function getAdminStats() {
  try {
    console.log("Getting admin stats")

    const { data: orders, error: ordersError } = await supabase.from("orders").select("*")
    if (ordersError) throw ordersError

    const { data: agents, error: agentsError } = await supabase.from("users").select("*").eq("role", "agent")
    if (agentsError) throw agentsError

    const stats = {
      totalOrders: orders?.length || 0,
      pendingOrders: orders?.filter((order) => order.status === "pending").length || 0,
      completedOrders: orders?.filter((order) => order.status === "completed").length || 0,
      totalAgents: agents?.length || 0,
    }

    console.log("Admin stats:", stats)
    return stats
  } catch (error) {
    console.error("Failed to get admin stats:", error)
    return {
      totalOrders: 0,
      pendingOrders: 0,
      completedOrders: 0,
      totalAgents: 0,
    }
  }
}

export async function clearAllOrders(): Promise<void> {
  console.log("Clearing all orders from database")

  const { error } = await supabase.from("orders").delete().neq("id", "placeholder")

  if (error) {
    console.error("Database error clearing orders:", error)
    throw new Error("Failed to clear orders")
  }

  console.log("All orders cleared successfully")
}

// Re-export functions from data.ts
export * from "./data"
