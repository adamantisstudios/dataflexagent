"use client"

import type React from "react"

import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Shield, AlertCircle, ArrowLeft } from "lucide-react"

export default function AdminLoginPage() {
  const { adminLogin, user } = useAuth()
  const router = useRouter()
  const [email, setEmail] = useState("admin@dataflexghana.com")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      await adminLogin(email, password)
      router.push("/admin/dashboard")
    } catch (error) {
      setError("Invalid admin credentials. Use password: admin123")
    } finally {
      setIsLoading(false)
    }
  }

  const handleBackToHome = () => {
    router.push("/")
  }

  // If already logged in as admin, redirect
  if (user && user.role === "admin") {
    router.push("/admin/dashboard")
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p>Redirecting to admin dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Back to Home Button */}
        <div className="text-left">
          <Button
            variant="outline"
            onClick={handleBackToHome}
            className="flex items-center gap-2 bg-white hover:bg-gray-50"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Button>
        </div>

        {/* Header */}
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-blue-600 rounded-full flex items-center justify-center mb-4">
            <Shield className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900">Admin Login</h2>
          <p className="mt-2 text-sm text-gray-600">Access the DataFlex Ghana admin dashboard</p>
        </div>

        {/* Login Form */}
        <Card className="shadow-xl">
          <CardHeader className="text-center">
            <CardTitle className="text-xl">Welcome Back, Admin</CardTitle>
            <CardDescription>Enter your credentials to access the admin panel</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  Admin Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-11"
                  placeholder="admin@dataflexghana.com"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-11"
                  placeholder="Enter admin password"
                  required
                />
                <p className="text-xs text-gray-500">Default password: admin123</p>
              </div>

              <Button type="submit" className="w-full h-11 bg-blue-600 hover:bg-blue-700" disabled={isLoading}>
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Signing in...
                  </div>
                ) : (
                  "Sign In to Admin Panel"
                )}
              </Button>
            </form>

            <div className="mt-6 text-center border-t pt-4">
              <p className="text-sm text-gray-600">
                Need help?{" "}
                <button onClick={handleBackToHome} className="font-medium text-blue-600 hover:text-blue-500 underline">
                  Return to main site
                </button>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Info Card */}
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="pt-6">
            <div className="text-center text-sm text-blue-800">
              <p className="font-medium">Admin Access Only</p>
              <p className="mt-1">This area is restricted to authorized administrators</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
