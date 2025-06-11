"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { getAnalytics } from "@/lib/database"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CalendarDays, TrendingUp, Users, Package, DollarSign, Clock, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface AnalyticsData {
  totalOrders: number
  totalRevenue: number
  totalAgents: number
  dailyOrders: Array<{ date: string; count: number; revenue: number }>
  weeklyOrders: Array<{ week: string; count: number; revenue: number }>
  monthlyOrders: Array<{ month: string; count: number; revenue: number }>
  ordersByStatus: Array<{ status: string; count: number; percentage: number }>
  topAgents: Array<{ name: string; orders: number; revenue: number }>
  recentActivity: Array<{ date: string; description: string; type: string }>
}

export default function AdminAnalyticsPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [timeRange, setTimeRange] = useState<"daily" | "weekly" | "monthly">("daily")

  useEffect(() => {
    if (!loading && (!user || user.role !== "admin")) {
      router.push("/admin")
    }
  }, [user, loading, router])

  useEffect(() => {
    if (user && user.role === "admin") {
      loadAnalytics()
    }
  }, [user])

  const loadAnalytics = async () => {
    try {
      setIsLoading(true)
      setError(null)
      console.log("Loading analytics...")

      const data = await getAnalytics()
      console.log("Analytics loaded:", data)

      setAnalytics(data)
    } catch (error) {
      console.error("Failed to load analytics:", error)
      setError("Failed to load analytics data. Please check your database connection.")
    } finally {
      setIsLoading(false)
    }
  }

  if (loading || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!user || user.role !== "admin") return null

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <button
          onClick={loadAnalytics}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
        >
          Retry
        </button>
      </div>
    )
  }

  if (!analytics) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-muted-foreground">No analytics data available</p>
          <button
            onClick={loadAnalytics}
            className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          >
            Load Analytics
          </button>
        </div>
      </div>
    )
  }

  const getCurrentData = () => {
    switch (timeRange) {
      case "weekly":
        return analytics.weeklyOrders
      case "monthly":
        return analytics.monthlyOrders
      default:
        return analytics.dailyOrders
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
        <div className="flex gap-2">
          {["daily", "weekly", "monthly"].map((range) => (
            <Badge
              key={range}
              variant={timeRange === range ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => setTimeRange(range as any)}
            >
              {range.charAt(0).toUpperCase() + range.slice(1)}
            </Badge>
          ))}
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalOrders}</div>
            <p className="text-xs text-muted-foreground mt-1">All time orders</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">GHS {analytics.totalRevenue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground mt-1">All time revenue</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Agents</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalAgents}</div>
            <p className="text-xs text-muted-foreground mt-1">Registered agents</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Avg. Processing Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">15 min</div>
            <p className="text-xs text-muted-foreground mt-1">Average completion</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Orders by Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Orders by Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.ordersByStatus.length > 0 ? (
                analytics.ordersByStatus.map((status) => (
                  <div key={status.status} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge
                        className={
                          status.status === "completed"
                            ? "bg-green-100 text-green-800"
                            : status.status === "pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : status.status === "processing"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-red-100 text-red-800"
                        }
                      >
                        {status.status.charAt(0).toUpperCase() + status.status.slice(1)}
                      </Badge>
                      <span className="text-sm">{status.count} orders</span>
                    </div>
                    <span className="text-sm font-medium">{status.percentage.toFixed(1)}%</span>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground text-center py-4">No order data available</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Top Performing Agents */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Top Performing Agents
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.topAgents.length > 0 ? (
                analytics.topAgents.slice(0, 5).map((agent, index) => (
                  <div key={agent.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">#{index + 1}</Badge>
                      <span className="font-medium">{agent.name}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">{agent.orders} orders</div>
                      <div className="text-xs text-muted-foreground">GHS {agent.revenue.toFixed(2)}</div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground text-center py-4">No agent data available</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Time-based Analytics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarDays className="h-5 w-5" />
            {timeRange.charAt(0).toUpperCase() + timeRange.slice(1)} Performance
          </CardTitle>
          <CardDescription>Orders and revenue over time</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {getCurrentData().length > 0 ? (
              getCurrentData()
                .slice(-7)
                .map((item) => (
                  <div
                    key={item.date || item.week || item.month}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div>
                      <div className="font-medium">{item.date || item.week || item.month}</div>
                      <div className="text-sm text-muted-foreground">{item.count} orders</div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">GHS {item.revenue.toFixed(2)}</div>
                      <div className="text-sm text-muted-foreground">Revenue</div>
                    </div>
                  </div>
                ))
            ) : (
              <p className="text-muted-foreground text-center py-4">No performance data available</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
