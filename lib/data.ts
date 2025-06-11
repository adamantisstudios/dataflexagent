import { supabase } from "./supabase"
import type { Order, User, Product } from "./types"

// Updated products data with real prices and bundles
export const products: Product[] = [
  // MTN Bundles - Valid for 3 months
  {
    id: "mtn-1gb",
    name: "MTN 1GB",
    shortDescription: "1GB data valid for 3 months",
    description:
      "MTN 1GB data bundle valid for 3 months. After checkout, pay to 0551999901 via Mobile Money. Use your agent ID during checkout.",
    price: 6.0,
    category: "MTN",
  },
  {
    id: "mtn-2gb",
    name: "MTN 2GB",
    shortDescription: "2GB data valid for 3 months",
    description:
      "MTN 2GB data bundle valid for 3 months. After checkout, pay to 0551999901 via Mobile Money. Use your agent ID during checkout.",
    price: 12.0,
    category: "MTN",
  },
  {
    id: "mtn-3gb",
    name: "MTN 3GB",
    shortDescription: "3GB data valid for 3 months",
    description:
      "MTN 3GB data bundle valid for 3 months. After checkout, pay to 0551999901 via Mobile Money. Use your agent ID during checkout.",
    price: 16.0,
    category: "MTN",
  },
  {
    id: "mtn-4gb",
    name: "MTN 4GB",
    shortDescription: "4GB data valid for 3 months",
    description:
      "MTN 4GB data bundle valid for 3 months. After checkout, pay to 0551999901 via Mobile Money. Use your agent ID during checkout.",
    price: 21.0,
    category: "MTN",
  },
  {
    id: "mtn-5gb",
    name: "MTN 5GB",
    shortDescription: "5GB data valid for 3 months",
    description:
      "MTN 5GB data bundle valid for 3 months. After checkout, pay to 0551999901 via Mobile Money. Use your agent ID during checkout.",
    price: 27.0,
    category: "MTN",
  },
  {
    id: "mtn-6gb",
    name: "MTN 6GB",
    shortDescription: "6GB data valid for 3 months",
    description:
      "MTN 6GB data bundle valid for 3 months. After checkout, pay to 0551999901 via Mobile Money. Use your agent ID during checkout.",
    price: 31.0,
    category: "MTN",
  },
  {
    id: "mtn-7gb",
    name: "MTN 7GB",
    shortDescription: "7GB data valid for 3 months",
    description:
      "MTN 7GB data bundle valid for 3 months. After checkout, pay to 0551999901 via Mobile Money. Use your agent ID during checkout.",
    price: 36.0,
    category: "MTN",
  },
  {
    id: "mtn-8gb",
    name: "MTN 8GB",
    shortDescription: "8GB data valid for 3 months",
    description:
      "MTN 8GB data bundle valid for 3 months. After checkout, pay to 0551999901 via Mobile Money. Use your agent ID during checkout.",
    price: 40.0,
    category: "MTN",
  },
  {
    id: "mtn-10gb",
    name: "MTN 10GB",
    shortDescription: "10GB data valid for 3 months",
    description:
      "MTN 10GB data bundle valid for 3 months. After checkout, pay to 0551999901 via Mobile Money. Use your agent ID during checkout.",
    price: 46.0,
    category: "MTN",
  },
  {
    id: "mtn-15gb",
    name: "MTN 15GB",
    shortDescription: "15GB data valid for 3 months",
    description:
      "MTN 15GB data bundle valid for 3 months. After checkout, pay to 0551999901 via Mobile Money. Use your agent ID during checkout.",
    price: 67.0,
    category: "MTN",
  },
  {
    id: "mtn-20gb",
    name: "MTN 20GB",
    shortDescription: "20GB data valid for 3 months",
    description:
      "MTN 20GB data bundle valid for 3 months. After checkout, pay to 0551999901 via Mobile Money. Use your agent ID during checkout.",
    price: 84.0,
    category: "MTN",
  },
  {
    id: "mtn-25gb",
    name: "MTN 25GB",
    shortDescription: "25GB data valid for 3 months",
    description:
      "MTN 25GB data bundle valid for 3 months. After checkout, pay to 0551999901 via Mobile Money. Use your agent ID during checkout.",
    price: 105.0,
    category: "MTN",
  },
  {
    id: "mtn-30gb",
    name: "MTN 30GB",
    shortDescription: "30GB data valid for 3 months",
    description:
      "MTN 30GB data bundle valid for 3 months. After checkout, pay to 0551999901 via Mobile Money. Use your agent ID during checkout.",
    price: 126.0,
    category: "MTN",
  },
  {
    id: "mtn-40gb",
    name: "MTN 40GB",
    shortDescription: "40GB data valid for 3 months",
    description:
      "MTN 40GB data bundle valid for 3 months. After checkout, pay to 0551999901 via Mobile Money. Use your agent ID during checkout.",
    price: 163.0,
    category: "MTN",
  },
  {
    id: "mtn-50gb",
    name: "MTN 50GB",
    shortDescription: "50GB data valid for 3 months",
    description:
      "MTN 50GB data bundle valid for 3 months. After checkout, pay to 0551999901 via Mobile Money. Use your agent ID during checkout.",
    price: 201.0,
    category: "MTN",
  },
  {
    id: "mtn-100gb",
    name: "MTN 100GB",
    shortDescription: "100GB data valid for 3 months",
    description:
      "MTN 100GB data bundle valid for 3 months. After checkout, pay to 0551999901 via Mobile Money. Use your agent ID during checkout.",
    price: 396.0,
    category: "MTN",
  },

  // AirtelTigo Bundles - Valid for 3 months
  {
    id: "airteltigo-1gb",
    name: "AirtelTigo 1GB",
    shortDescription: "1GB data valid for 3 months",
    description:
      "AirtelTigo 1GB data bundle valid for 3 months. After checkout, pay to 0551999901 via Mobile Money. Use your agent ID during checkout.",
    price: 6.0,
    category: "AirtelTigo",
  },
  {
    id: "airteltigo-2gb",
    name: "AirtelTigo 2GB",
    shortDescription: "2GB data valid for 3 months",
    description:
      "AirtelTigo 2GB data bundle valid for 3 months. After checkout, pay to 0551999901 via Mobile Money. Use your agent ID during checkout.",
    price: 10.0,
    category: "AirtelTigo",
  },
  {
    id: "airteltigo-3gb",
    name: "AirtelTigo 3GB",
    shortDescription: "3GB data valid for 3 months",
    description:
      "AirtelTigo 3GB data bundle valid for 3 months. After checkout, pay to 0551999901 via Mobile Money. Use your agent ID during checkout.",
    price: 16.0,
    category: "AirtelTigo",
  },
  {
    id: "airteltigo-4gb",
    name: "AirtelTigo 4GB",
    shortDescription: "4GB data valid for 3 months",
    description:
      "AirtelTigo 4GB data bundle valid for 3 months. After checkout, pay to 0551999901 via Mobile Money. Use your agent ID during checkout.",
    price: 21.0,
    category: "AirtelTigo",
  },
  {
    id: "airteltigo-5gb",
    name: "AirtelTigo 5GB",
    shortDescription: "5GB data valid for 3 months",
    description:
      "AirtelTigo 5GB data bundle valid for 3 months. After checkout, pay to 0551999901 via Mobile Money. Use your agent ID during checkout.",
    price: 25.0,
    category: "AirtelTigo",
  },
  {
    id: "airteltigo-6gb",
    name: "AirtelTigo 6GB",
    shortDescription: "6GB data valid for 3 months",
    description:
      "AirtelTigo 6GB data bundle valid for 3 months. After checkout, pay to 0551999901 via Mobile Money. Use your agent ID during checkout.",
    price: 27.0,
    category: "AirtelTigo",
  },
  {
    id: "airteltigo-7gb",
    name: "AirtelTigo 7GB",
    shortDescription: "7GB data valid for 3 months",
    description:
      "AirtelTigo 7GB data bundle valid for 3 months. After checkout, pay to 0551999901 via Mobile Money. Use your agent ID during checkout.",
    price: 31.0,
    category: "AirtelTigo",
  },
  {
    id: "airteltigo-8gb",
    name: "AirtelTigo 8GB",
    shortDescription: "8GB data valid for 3 months",
    description:
      "AirtelTigo 8GB data bundle valid for 3 months. After checkout, pay to 0551999901 via Mobile Money. Use your agent ID during checkout.",
    price: 36.0,
    category: "AirtelTigo",
  },
  {
    id: "airteltigo-9gb",
    name: "AirtelTigo 9GB",
    shortDescription: "9GB data valid for 3 months",
    description:
      "AirtelTigo 9GB data bundle valid for 3 months. After checkout, pay to 0551999901 via Mobile Money. Use your agent ID during checkout.",
    price: 40.0,
    category: "AirtelTigo",
  },
  {
    id: "airteltigo-10gb",
    name: "AirtelTigo 10GB",
    shortDescription: "10GB data valid for 3 months",
    description:
      "AirtelTigo 10GB data bundle valid for 3 months. After checkout, pay to 0551999901 via Mobile Money. Use your agent ID during checkout.",
    price: 44.0,
    category: "AirtelTigo",
  },
  {
    id: "airteltigo-15gb",
    name: "AirtelTigo 15GB",
    shortDescription: "15GB data valid for 3 months",
    description:
      "AirtelTigo 15GB data bundle valid for 3 months. After checkout, pay to 0551999901 via Mobile Money. Use your agent ID during checkout.",
    price: 57.0,
    category: "AirtelTigo",
  },
  {
    id: "airteltigo-20gb",
    name: "AirtelTigo 20GB",
    shortDescription: "20GB data valid for 3 months",
    description:
      "AirtelTigo 20GB data bundle valid for 3 months. After checkout, pay to 0551999901 via Mobile Money. Use your agent ID during checkout.",
    price: 66.0,
    category: "AirtelTigo",
  },
  {
    id: "airteltigo-25gb",
    name: "AirtelTigo 25GB",
    shortDescription: "25GB data valid for 3 months",
    description:
      "AirtelTigo 25GB data bundle valid for 3 months. After checkout, pay to 0551999901 via Mobile Money. Use your agent ID during checkout.",
    price: 81.0,
    category: "AirtelTigo",
  },
  {
    id: "airteltigo-30gb",
    name: "AirtelTigo 30GB",
    shortDescription: "30GB data valid for 3 months",
    description:
      "AirtelTigo 30GB data bundle valid for 3 months. After checkout, pay to 0551999901 via Mobile Money. Use your agent ID during checkout.",
    price: 91.0,
    category: "AirtelTigo",
  },
  {
    id: "airteltigo-40gb",
    name: "AirtelTigo 40GB",
    shortDescription: "40GB data valid for 3 months",
    description:
      "AirtelTigo 40GB data bundle valid for 3 months. After checkout, pay to 0551999901 via Mobile Money. Use your agent ID during checkout.",
    price: 106.0,
    category: "AirtelTigo",
  },
  {
    id: "airteltigo-50gb",
    name: "AirtelTigo 50GB",
    shortDescription: "50GB data valid for 3 months",
    description:
      "AirtelTigo 50GB data bundle valid for 3 months. After checkout, pay to 0551999901 via Mobile Money. Use your agent ID during checkout.",
    price: 116.0,
    category: "AirtelTigo",
  },
  {
    id: "airteltigo-60gb",
    name: "AirtelTigo 60GB",
    shortDescription: "60GB data valid for 3 months",
    description:
      "AirtelTigo 60GB data bundle valid for 3 months. After checkout, pay to 0551999901 via Mobile Money. Use your agent ID during checkout.",
    price: 126.0,
    category: "AirtelTigo",
  },
  {
    id: "airteltigo-80gb",
    name: "AirtelTigo 80GB",
    shortDescription: "80GB data valid for 3 months",
    description:
      "AirtelTigo 80GB data bundle valid for 3 months. After checkout, pay to 0551999901 via Mobile Money. Use your agent ID during checkout.",
    price: 156.0,
    category: "AirtelTigo",
  },
  {
    id: "airteltigo-100gb",
    name: "AirtelTigo 100GB",
    shortDescription: "100GB data valid for 3 months",
    description:
      "AirtelTigo 100GB data bundle valid for 3 months. After checkout, pay to 0551999901 via Mobile Money. Use your agent ID during checkout.",
    price: 217.0,
    category: "AirtelTigo",
  },

  // Telecel Bundles - Valid for 3 months
  {
    id: "telecel-5gb",
    name: "Telecel 5GB",
    shortDescription: "5GB data valid for 3 months",
    description:
      "Telecel 5GB data bundle valid for 3 months. After checkout, pay to 0551999901 via Mobile Money. Use your agent ID during checkout.",
    price: 28.0,
    category: "Telecel",
  },
  {
    id: "telecel-10gb",
    name: "Telecel 10GB",
    shortDescription: "10GB data valid for 3 months",
    description:
      "Telecel 10GB data bundle valid for 3 months. After checkout, pay to 0551999901 via Mobile Money. Use your agent ID during checkout.",
    price: 47.0,
    category: "Telecel",
  },
  {
    id: "telecel-15gb",
    name: "Telecel 15GB",
    shortDescription: "15GB data valid for 3 months",
    description:
      "Telecel 15GB data bundle valid for 3 months. After checkout, pay to 0551999901 via Mobile Money. Use your agent ID during checkout.",
    price: 68.0,
    category: "Telecel",
  },
  {
    id: "telecel-20gb",
    name: "Telecel 20GB",
    shortDescription: "20GB data valid for 3 months",
    description:
      "Telecel 20GB data bundle valid for 3 months. After checkout, pay to 0551999901 via Mobile Money. Use your agent ID during checkout.",
    price: 89.0,
    category: "Telecel",
  },
  {
    id: "telecel-25gb",
    name: "Telecel 25GB",
    shortDescription: "25GB data valid for 3 months",
    description:
      "Telecel 25GB data bundle valid for 3 months. After checkout, pay to 0551999901 via Mobile Money. Use your agent ID during checkout.",
    price: 109.0,
    category: "Telecel",
  },
  {
    id: "telecel-30gb",
    name: "Telecel 30GB",
    shortDescription: "30GB data valid for 3 months",
    description:
      "Telecel 30GB data bundle valid for 3 months. After checkout, pay to 0551999901 via Mobile Money. Use your agent ID during checkout.",
    price: 127.0,
    category: "Telecel",
  },
  {
    id: "telecel-40gb",
    name: "Telecel 40GB",
    shortDescription: "40GB data valid for 3 months",
    description:
      "Telecel 40GB data bundle valid for 3 months. After checkout, pay to 0551999901 via Mobile Money. Use your agent ID during checkout.",
    price: 169.0,
    category: "Telecel",
  },
  {
    id: "telecel-50gb",
    name: "Telecel 50GB",
    shortDescription: "50GB data valid for 3 months",
    description:
      "Telecel 50GB data bundle valid for 3 months. After checkout, pay to 0551999901 via Mobile Money. Use your agent ID during checkout.",
    price: 207.0,
    category: "Telecel",
  },
  {
    id: "telecel-100gb",
    name: "Telecel 100GB",
    shortDescription: "100GB data valid for 3 months",
    description:
      "Telecel 100GB data bundle valid for 3 months. After checkout, pay to 0551999901 via Mobile Money. Use your agent ID during checkout.",
    price: 414.0,
    category: "Telecel",
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
  console.log("Creating order:", orderData)

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

export async function getProducts(): Promise<Product[]> {
  return products
}

export async function getProductById(id: string): Promise<Product | null> {
  return products.find((product) => product.id === id) || null
}

export async function getProductsByCategory(category: string): Promise<Product[]> {
  return products.filter((product) => product.category === category)
}
