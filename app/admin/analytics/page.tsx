"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { getAnalytics, clearAllOrders } from "@/lib/data"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CalendarDays, Users, Package, DollarSign, Clock, AlertCircle, AlertTriangle, Trash2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

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
  const [isClearingOrders, setIsClearingOrders] = useState(false)
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

  const handleClearAllOrders = async () => {
    try {
      setIsClearingOrders(true)
      await clearAllOrders()
      await loadAnalytics() // Reload analytics after clearing
    } catch (error) {
      console.error("Failed to clear orders:", error)
      setError("Failed to clear orders. Please try again.")
    } finally {
      setIsClearingOrders(false)
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
        <Button onClick={loadAnalytics}>Retry</Button>
      </div>
    )
  }

  if (!analytics) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-muted-foreground">No analytics data available</p>
          <Button onClick={loadAnalytics} className="mt-4">
            Load Analytics
          </Button>
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
        <div className="flex items-center gap-4">
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

          <Dialog>
            <DialogTrigger asChild>
              <Button variant="destructive" size="sm" className="flex items-center gap-2">
                <Trash2 className="h-4 w-4" />
                Clear All Orders
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-red-500" />
                  Clear All Orders
                </DialogTitle>
                <DialogDescription>
                  This action will permanently delete all orders from the database. This cannot be undone. User accounts
                  will be preserved.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline" disabled={isClearingOrders}>
                  Cancel
                </Button>
                <Button variant="destructive" onClick={handleClearAllOrders} disabled={isClearingOrders}>
                  {isClearingOrders ? "Clearing..." : "Yes, Clear All Orders"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
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
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
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
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analytics.ordersByStatus.find((s) => s.status === "pending")?.count || 0}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Orders by Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Orders by Status</CardTitle>
            <CardDescription>Distribution of orders by their current status</CardDescription>
          </CardHeader>
          <CardContent>
            {analytics.ordersByStatus.length > 0 ? (
              <div className="space-y-4">
                {analytics.ordersByStatus.map((status) => (
                  <div key={status.status} className="flex items-center">
                    <div className="w-36 font-medium capitalize">{status.status}</div>
                    <div className="flex-1">
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div
                          className={`h-2.5 rounded-full ${
                            status.status === "completed"
                              ? "bg-green-500"
                              : status.status === "pending"
                                ? "bg-yellow-500"
                                : status.status === "processing"
                                  ? "bg-blue-500"
                                  : "bg-gray-500"
                          }`}
                          style={{ width: `${status.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="w-16 text-right">{status.count}</div>
                    <div className="w-16 text-right text-muted-foreground">{status.percentage.toFixed(1)}%</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No order status data available</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Top Agents */}
        <Card>
          <CardHeader>
            <CardTitle>Top Agents</CardTitle>
            <CardDescription>Agents with the most orders</CardDescription>
          </CardHeader>
          <CardContent>
            {analytics.topAgents.length > 0 ? (
              <div className="space-y-4">
                {analytics.topAgents.slice(0, 5).map((agent, index) => (
                  <div key={index} className="flex items-center">
                    <div className="w-36 font-medium truncate">{agent.name}</div>
                    <div className="flex-1">
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div
                          className="bg-primary h-2.5 rounded-full"
                          style={{
                            width: `${
                              analytics.topAgents[0].orders > 0
                                ? (agent.orders / analytics.topAgents[0].orders) * 100
                                : 0
                            }%`,
                          }}
                        ></div>
                      </div>
                    </div>
                    <div className="w-16 text-right">{agent.orders}</div>
                    <div className="w-24 text-right text-muted-foreground">GHS {agent.revenue.toFixed(2)}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No agent data available</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Time-based Data */}
      <Card className="mb-8">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>
              {timeRange === "daily" ? "Daily Orders" : timeRange === "weekly" ? "Weekly Orders" : "Monthly Orders"}
            </CardTitle>
            <CardDescription>
              {timeRange === "daily"
                ? "Order volume for the past 7 days"
                : timeRange === "weekly"
                  ? "Order volume by week"
                  : "Order volume by month"}
            </CardDescription>
          </div>
          <CalendarDays className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {getCurrentData().length > 0 ? (
            <div className="h-[300px] relative">
              <div className="absolute inset-0 flex items-end">
                {getCurrentData().map((item, index) => {
                  const maxCount = Math.max(...getCurrentData().map((i) => i.count))
                  const height = maxCount > 0 ? (item.count / maxCount) * 100 : 0

                  return (
                    <div key={index} className="flex-1 flex flex-col items-center justify-end h-full">
                      <div className="w-full max-w-[50px] bg-primary rounded-t" style={{ height: `${height}%` }}></div>
                      <div className="mt-2 text-xs text-center">
                        {timeRange === "daily"
                          ? new Date(item.date).toLocaleDateString(undefined, { weekday: "short" })
                          : item.date}
                      </div>
                      <div className="text-xs text-muted-foreground">{item.count}</div>
                    </div>
                  )
                })}
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No time-based data available</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Latest actions and events</CardDescription>
        </CardHeader>
        <CardContent>
          {analytics.recentActivity.length > 0 ? (
            <div className="space-y-4">
              {analytics.recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start pb-4 border-b last:border-0 last:pb-0">
                  <div
                    className={`w-2 h-2 mt-2 rounded-full mr-3 ${
                      activity.type === "completed"
                        ? "bg-green-500"
                        : activity.type === "pending"
                          ? "bg-yellow-500"
                          : activity.type === "processing"
                            ? "bg-blue-500"
                            : "bg-gray-500"
                    }`}
                  ></div>
                  <div className="flex-1">
                    <p className="font-medium">{activity.description}</p>
                    <p className="text-sm text-muted-foreground">{new Date(activity.date).toLocaleString()}</p>
                  </div>
                  <Badge
                    className={
                      activity.type === "completed"
                        ? "bg-green-100 text-green-800 hover:bg-green-100"
                        : activity.type === "pending"
                          ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
                          : activity.type === "processing"
                            ? "bg-blue-100 text-blue-800 hover:bg-blue-100"
                            : "bg-gray-100 text-gray-800 hover:bg-gray-100"
                    }
                  >
                    {activity.type.charAt(0).toUpperCase() + activity.type.slice(1)}
                  </Badge>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No recent activity</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
