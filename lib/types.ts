export interface User {
  id: string
  name: string
  email: string
  role: "admin" | "agent"
  phone?: string
  agent_code?: string
}
