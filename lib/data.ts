import { supabase } from "./supabase"
import type { Order, User, Product } from "./types"

// Products data
export const products: Product[] = [
  {
    id: "1",
    name: "MTN 1GB",
    price: 3.5,
    category: "MTN",
    description: "1GB MTN data bundle valid for 30 days",
    shortDescription: "1GB data for 30 days",
  },
  {
    id: "2",
    name: "MTN 2GB",
    price: 6.5,
    category: "MTN",
    description: "2GB MTN data bundle valid for 30 days",
    shortDescription: "2GB data for 30 days",
  },
  {
    id: "3",
    name: "MTN 5GB",
    price: 15.0,
    category: "MTN",
    description: "5GB MTN data bundle valid for 30 days",
    shortDescription: "5GB data for 30 days",
  },
  {
    id: "4",
    name: "Vodafone 1GB",
    price: 3.8,
    category: "Vodafone",
    description: "1GB Vodafone data bundle valid for 30 days",
    shortDescription: "1GB data for 30 days",
  },
  {
    id: "5",
    name: "Vodafone 2GB",
    price: 7.0,
    category: "Vodafone",
    description: "2GB Vodafone data bundle valid for 30 days",
    shortDescription: "2GB data for 30 days",
  },
  {
    id: "6",
    name: "AirtelTigo 1GB",
    price: 3.2,
    category: "AirtelTigo",
    description: "1GB AirtelTigo data bundle valid for 30 days",
    shortDescription: "1GB data for 30 days",
  },
]

// Real database functions
export async function createOrder(orderData: {
  productId: string
  productName: string
  userId: string
  userName: string
  price: number
}): Promise<Order> {
  const { data, error } = await supabase
    .from("orders")
    .insert([
      {
        product_id: orderData.productId,
        product_name: orderData.productName,
        user_id: orderData.userId,
        user_name: orderData.userName,
        price: orderData.price,
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
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Database error:", error)
    throw new Error("Failed to fetch orders")
  }

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
  const { data, error } = await supabase.from("orders").select("*").order("created_at", { ascending: false })

  if (error) {
    console.error("Database error:", error)
    throw new Error("Failed to fetch orders")
  }

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

export async function updateOrderStatus(orderId: string, status: string): Promise<void> {
  const { error } = await supabase
    .from("orders")
    .update({
      status,
      updated_at: new Date().toISOString(),
    })
    .eq("id", orderId)

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

  return (data || []).map((user) => ({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    phone: user.phone,
  }))
}

export async function getAdminStats() {
  try {
    // Get all orders
    const { data: orders, error: ordersError } = await supabase.from("orders").select("*")

    if (ordersError) {
      console.error("Orders error:", ordersError)
      throw ordersError
    }

    // Get all users with role 'agent'
    const { data: agents, error: agentsError } = await supabase.from("users").select("*").eq("role", "agent")

    if (agentsError) {
      console.error("Agents error:", agentsError)
      throw agentsError
    }

    const totalOrders = orders?.length || 0
    const pendingOrders = orders?.filter((order) => order.status === "pending").length || 0
    const completedOrders = orders?.filter((order) => order.status === "completed").length || 0
    const totalAgents = agents?.length || 0

    return {
      totalOrders,
      pendingOrders,
      completedOrders,
      totalAgents,
    }
  } catch (error) {
    console.error("Failed to get admin stats:", error)
    // Return zeros if there's an error
    return {
      totalOrders: 0,
      pendingOrders: 0,
      completedOrders: 0,
      totalAgents: 0,
    }
  }
}

export async function createUser(userData: {
  name: string
  email: string
  role: "admin" | "agent"
  phone?: string
}): Promise<User> {
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

  return {
    id: data.id,
    name: data.name,
    email: data.email,
    role: data.role,
    phone: data.phone,
  }
}

export async function getUserByEmail(email: string): Promise<User | null> {
  const { data, error } = await supabase.from("users").select("*").eq("email", email).single()

  if (error) {
    if (error.code === "PGRST116") {
      // No rows returned
      return null
    }
    console.error("Database error:", error)
    throw new Error("Failed to fetch user")
  }

  return {
    id: data.id,
    name: data.name,
    email: data.email,
    role: data.role,
    phone: data.phone,
  }
}

export async function updateUserProfile(userId: string, updates: { name?: string; phone?: string }): Promise<void> {
  const { error } = await supabase
    .from("users")
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq("id", userId)

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
