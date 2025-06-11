"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { getAllAgents, createUser, deleteUser } from "@/lib/database"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { toast } from "@/hooks/use-toast"
import { Search, Plus, Trash2, User, Phone, Mail, Calendar } from "lucide-react"
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

  useEffect(() => {
    if (!loading && (!user || user.role !== "admin")) {
      router.push("/admin")
    }
  }, [user, loading, router])

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

  if (loading || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!user || user.role !== "admin") return null

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Agent Management</h1>
        <Button onClick={() => setIsCreateDialogOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Create New Agent
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Registered Agents ({filteredAgents.length})
          </CardTitle>
          <div className="flex items-center gap-2 mt-4">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search agents by name, email, phone, or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>
        </CardHeader>
        <CardContent>
          {filteredAgents.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Agent ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead>Orders</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAgents.map((agent) => (
                    <TableRow key={agent.id}>
                      <TableCell className="font-medium">{agent.id.substring(0, 8)}</TableCell>
                      <TableCell className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        {agent.name}
                      </TableCell>
                      <TableCell className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        {agent.email}
                      </TableCell>
                      <TableCell>
                        {agent.phone ? (
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-muted-foreground" />
                            {agent.phone}
                          </div>
                        ) : (
                          "N/A"
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-green-50 text-green-700">
                          Active
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          {new Date(agent.created_at).toLocaleDateString()}
                        </div>
                      </TableCell>
                      <TableCell>{agent.orderCount || 0}</TableCell>
                      <TableCell>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => {
                            setSelectedAgent(agent)
                            setIsDeleteDialogOpen(true)
                          }}
                          className="gap-1"
                        >
                          <Trash2 className="h-3 w-3" />
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-8">
              <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                {searchTerm ? "No agents found matching your search." : "No agents registered yet."}
              </p>
              {!searchTerm && (
                <Button onClick={() => setIsCreateDialogOpen(true)} className="mt-4 gap-2">
                  <Plus className="h-4 w-4" />
                  Create First Agent
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create Agent Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Agent</DialogTitle>
            <DialogDescription>Add a new agent to the system. They will receive login credentials.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                placeholder="Enter agent's full name"
                value={newAgent.name}
                onChange={(e) => setNewAgent({ ...newAgent, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter agent's email"
                value={newAgent.email}
                onChange={(e) => setNewAgent({ ...newAgent, email: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                placeholder="Enter agent's phone number"
                value={newAgent.phone}
                onChange={(e) => setNewAgent({ ...newAgent, phone: e.target.value })}
              />
            </div>
            <div className="text-sm text-muted-foreground">
              * Required fields. Default password will be "password" - agent can change it later.
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateAgent}>Create Agent</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Agent Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Agent</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete agent "{selectedAgent?.name}"? This action cannot be undone and will also
              delete all their orders.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteAgent}>
              Delete Agent
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
