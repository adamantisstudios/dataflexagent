import { supabase } from "./supabase"
import type { User } from "./types"

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

export async function getAllAgents(): Promise<User[]> {
  try {
    const { data: agents, error } = await supabase
      .from("users")
      .select(`
        *,
        orders:orders(count)
      `)
      .eq("role", "agent")
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Database error:", error)
      throw new Error("Failed to fetch agents")
    }

    return (agents || []).map((agent) => ({
      id: agent.id,
      name: agent.name,
      email: agent.email,
      role: agent.role,
      phone: agent.phone,
      orderCount: agent.orders?.[0]?.count || 0,
    }))
  } catch (error) {
    console.error("Failed to get agents:", error)
    return []
  }
}

// Re-export other functions from data.ts
export * from "./data"
