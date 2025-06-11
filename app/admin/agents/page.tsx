"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { getAllAgents, createUser, deleteUser } from "@/lib/database"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/hooks/use-toast"
import type { DatabaseUser } from "@/lib/supabase"

export default function AdminAgentsPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [agents, setAgents] = useState<DatabaseUser[]>([])
  const [filteredAgents, setFilteredAgents] = useState<DatabaseUser[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedAgent, setSelectedAgent] = useState<DatabaseUser | null>(null)
  const [newAgent, setNewAgent] = useState({
    name: "",
    email: "",
    phone: "",
  })
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted && !loading && (!user || user.role !== "admin")) {
      router.push("/admin")
    }
  }, [user, loading, router, mounted])

  useEffect(() => {
    loadAgents()
  }, [user])

  useEffect(() => {
    const filtered = agents.filter(
      (agent) =>
        agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        agent.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        agent.phone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        agent.id.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    setFilteredAgents(filtered)
  }, [agents, searchTerm])

  const loadAgents = async () => {
    try {
      const data = await getAllAgents()
      setAgents(data)
      setFilteredAgents(data)
    } catch (error) {
      console.error("Failed to load agents:", error)
      toast({
        title: "Error",
        description: "Failed to load agents",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateAgent = async () => {
    try {
      if (!newAgent.name || !newAgent.email) {
        toast({
          title: "Error",
          description: "Name and email are required",
          variant: "destructive",
        })
        return
      }

      await createUser({
        name: newAgent.name,
        email: newAgent.email,
        role: "agent",
        phone: newAgent.phone,
      })

      toast({
        title: "Success",
        description: "Agent created successfully",
      })

      setNewAgent({ name: "", email: "", phone: "" })
      setIsCreateDialogOpen(false)
      loadAgents()
    } catch (error) {
      console.error("Failed to create agent:", error)
      toast({
        title: "Error",
        description: "Failed to create agent. Email might already exist.",
        variant: "destructive",
      })
    }
  }

  const handleDeleteAgent = async () => {
    try {
      if (!selectedAgent) return

      await deleteUser(selectedAgent.id)

      toast({
        title: "Success",
        description: "Agent deleted successfully",
      })

      setIsDeleteDialogOpen(false)
      setSelectedAgent(null)
      loadAgents()
    } catch (error) {
      console.error("Failed to delete agent:", error)
      toast({
        title: "Error",
        description: "Failed to delete agent",
        variant: "destructive",
      })
    }
  }

  if (!mounted || loading) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!user || user.role !== "admin") {
    return null
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Agents Management</h1>

      <Card>
        <CardHeader>
          <CardTitle>All Agents</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Agents management functionality will be loaded here.</p>
        </CardContent>
      </Card>
    </div>
  )
}
