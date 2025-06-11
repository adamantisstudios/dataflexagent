"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, ShoppingCart, TrendingUp } from "lucide-react"
import { supabase } from "@/lib/supabase"

interface AnalyticsData {
  totalOrders: number
  totalRevenue: number
  totalAgents: number
  ordersByStatus: Array<{ status: string; count: number; percentage: number }>
  topAgents: Array<{ name: string; orders: number; revenue: number }>
  recentActivity: Array<{ date: string; description: string; type: string }>
}

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalOrders: 0,
    totalRevenue: 0,
    totalAgents: 0,
    ordersByStatus: [],
    topAgents: [],
    recentActivity: [],
  })
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadAnalytics = async () => {
    try {
      setIsLoading(true)
      setError(null)

      // Fetch orders
      const { data: orders, error: ordersError } = await supabase.from("orders").select("*")
      if (ordersError) throw ordersError

      // Fetch agents
      const { data: agents, error: agentsError } = await supabase.from("users").select("*").eq("role", "agent")
      if (agentsError) throw agentsError

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
      const topAgents =
        agents
          ?.map((agent) => {
            const agentOrders = orders?.filter((order) => order.user_id === agent.id) || []
            return {
              name: agent.name,
              orders: agentOrders.length,
              revenue: agentOrders.reduce((sum, order) => sum + (order.price || 0), 0),
            }
          })
          .sort((a, b) => b.orders - a.orders)
          .slice(0, 5) || []

      // Recent activity
      const recentActivity =
        orders?.slice(0, 10).map((order) => ({
          date: order.created_at,
          description: `Order ${order.id.substring(0, 8)} - ${order.product_name}`,
          type: order.status,
        })) || []

      setAnalytics({
        totalOrders,
        totalRevenue,
        totalAgents,
        ordersByStatus,
        topAgents,
        recentActivity,
      })
    } catch (error: any) {
      console.error("Failed to load analytics:", error)
      setError("Failed to load analytics data")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadAnalytics()
  }, [])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="text-center text-red-500">{error}</div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Analytics Dashboard</h1>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalOrders}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">GHS {analytics.totalRevenue.toFixed(2)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Agents</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalAgents}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Orders by Status */}
        <Card>
          <CardHeader>
            <CardTitle>Orders by Status</CardTitle>
            <CardDescription>Distribution of order statuses</CardDescription>
          </CardHeader>
          <CardContent>
            {analytics.ordersByStatus.length > 0 ? (
              <div className="space-y-3">
                {analytics.ordersByStatus.map((item) => (
                  <div key={item.status} className="flex items-center justify-between">
                    <span className="capitalize">{item.status}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">{item.count}</span>
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${item.percentage}%` }}></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No order data available</p>
            )}
          </CardContent>
        </Card>

        {/* Top Agents */}
        <Card>
          <CardHeader>
            <CardTitle>Top Agents</CardTitle>
            <CardDescription>Agents with most orders</CardDescription>
          </CardHeader>
          <CardContent>
            {analytics.topAgents.length > 0 ? (
              <div className="space-y-3">
                {analytics.topAgents.map((agent, index) => (
                  <div key={agent.name} className="flex items-center justify-between">
                    <div>
                      <span className="font-medium">
                        #{index + 1} {agent.name}
                      </span>
                      <p className="text-sm text-muted-foreground">GHS {agent.revenue.toFixed(2)} revenue</p>
                    </div>
                    <span className="text-sm font-medium">{agent.orders} orders</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No agent data available</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Latest order activities</CardDescription>
        </CardHeader>
        <CardContent>
          {analytics.recentActivity.length > 0 ? (
            <div className="space-y-3">
              {analytics.recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center justify-between border-b pb-2">
                  <div>
                    <p className="font-medium">{activity.description}</p>
                    <p className="text-sm text-muted-foreground">{new Date(activity.date).toLocaleDateString()}</p>
                  </div>
                  <span
                    className={`px-2 py-1 rounded text-xs ${
                      activity.type === "completed"
                        ? "bg-green-100 text-green-800"
                        : activity.type === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {activity.type}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No recent activity</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
