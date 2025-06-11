export interface User {
  id: string
  name: string
  email: string
  role: "admin" | "agent"
  phone?: string
  orderCount?: number
}

export interface Product {
  id: string
  name: string
  price: number
  category: string
  description: string
  shortDescription: string
}

export interface Order {
  id: string
  productId: string
  productName: string
  userId: string
  userName?: string
  status: "pending" | "processing" | "completed" | "cancelled"
  price: number
  createdAt: string
  updatedAt?: string
  processingNote?: string
}
