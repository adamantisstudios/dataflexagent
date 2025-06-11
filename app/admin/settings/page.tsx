"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { updateUserPassword, updateUserProfile } from "@/lib/database"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/hooks/use-toast"
import { Settings, Lock, User, Save } from "lucide-react"

export default function AdminSettingsPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
  })
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  useEffect(() => {
    if (!loading && (!user || user.role !== "admin")) {
      router.push("/admin")
    }
  }, [user, loading, router])

  useEffect(() => {
    if (user) {
      setProfile({
        name: user.name,
        email: user.email,
        phone: user.phone || "",
      })
    }
  }, [user])

  const handleUpdateProfile = async () => {
    try {
      setIsLoading(true)
      if (!user) return

      await updateUserProfile(user.id, {
        name: profile.name,
        phone: profile.phone,
      })

      toast({
        title: "Success",
        description: "Profile updated successfully",
      })
    } catch (error) {
      console.error("Failed to update profile:", error)
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleChangePassword = async () => {
    try {
      if (!user) return

      if (passwords.newPassword !== passwords.confirmPassword) {
        toast({
          title: "Error",
          description: "New passwords do not match",
          variant: "destructive",
        })
        return
      }

      if (passwords.newPassword.length < 6) {
        toast({
          title: "Error",
          description: "Password must be at least 6 characters long",
          variant: "destructive",
        })
        return
      }

      setIsLoading(true)

      await updateUserPassword(user.id, passwords.currentPassword, passwords.newPassword)

      toast({
        title: "Success",
        description: "Password changed successfully",
      })

      setPasswords({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      })
    } catch (error) {
      console.error("Failed to change password:", error)
      toast({
        title: "Error",
        description: "Failed to change password. Check your current password.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!user || user.role !== "admin") return null

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-2 mb-6">
        <Settings className="h-8 w-8" />
        <h1 className="text-3xl font-bold">Admin Settings</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Profile Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Profile Information
            </CardTitle>
            <CardDescription>Update your personal information and contact details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                placeholder="Enter your full name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={profile.email}
                disabled
                className="bg-muted"
                placeholder="Email cannot be changed"
              />
              <p className="text-xs text-muted-foreground">Email address cannot be modified</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                value={profile.phone}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                placeholder="Enter your phone number"
              />
            </div>

            <Button onClick={handleUpdateProfile} disabled={isLoading} className="w-full gap-2">
              <Save className="h-4 w-4" />
              {isLoading ? "Updating..." : "Update Profile"}
            </Button>
          </CardContent>
        </Card>

        {/* Password Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5" />
              Change Password
            </CardTitle>
            <CardDescription>Update your password to keep your account secure</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Current Password</Label>
              <Input
                id="currentPassword"
                type="password"
                value={passwords.currentPassword}
                onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })}
                placeholder="Enter current password"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <Input
                id="newPassword"
                type="password"
                value={passwords.newPassword}
                onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                placeholder="Enter new password"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={passwords.confirmPassword}
                onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
                placeholder="Confirm new password"
              />
            </div>

            <Button
              onClick={handleChangePassword}
              disabled={isLoading || !passwords.currentPassword || !passwords.newPassword}
              className="w-full gap-2"
            >
              <Lock className="h-4 w-4" />
              {isLoading ? "Changing..." : "Change Password"}
            </Button>
          </CardContent>
        </Card>

        {/* System Settings */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>System Information</CardTitle>
            <CardDescription>Current system configuration and settings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Payment Number:</span>
                  <span className="font-medium">0551999901</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">WhatsApp Support:</span>
                  <span className="font-medium">+233242799990</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Processing Time:</span>
                  <span className="font-medium">1-30 minutes</span>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Admin Role:</span>
                  <span className="font-medium">Administrator</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Account Status:</span>
                  <span className="font-medium text-green-600">Active</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Last Login:</span>
                  <span className="font-medium">{new Date().toLocaleString()}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
