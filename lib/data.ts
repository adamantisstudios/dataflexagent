import type { Product } from "./types"

export const products: Product[] = [
  {
    id: "1",
    name: "MTN 1GB Data Bundle",
    shortDescription: "1GB data valid for 30 days",
    description:
      "Payment Instructions:\nAfter checkout, pay to 0551999901 via Mobile Money. Use your agent Unique ID during checkout.",
    price: 5.5,
    category: "MTN",
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: "2",
    name: "MTN 2GB Data Bundle",
    shortDescription: "2GB data valid for 30 days",
    description:
      "Payment Instructions:\nAfter checkout, pay to 0551999901 via Mobile Money. Use your agent Unique ID during checkout.",
    price: 10.0,
    category: "MTN",
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: "3",
    name: "Vodafone 1GB Data Bundle",
    shortDescription: "1GB data valid for 30 days",
    description:
      "Payment Instructions:\nAfter checkout, pay to 0551999901 via Mobile Money. Use your agent Unique ID during checkout.",
    price: 5.5,
    category: "Vodafone",
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: "4",
    name: "Vodafone 2GB Data Bundle",
    shortDescription: "2GB data valid for 30 days",
    description:
      "Payment Instructions:\nAfter checkout, pay to 0551999901 via Mobile Money. Use your agent Unique ID during checkout.",
    price: 10.0,
    category: "Vodafone",
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: "5",
    name: "AirtelTigo 1GB Data Bundle",
    shortDescription: "1GB data valid for 30 days",
    description:
      "Payment Instructions:\nAfter checkout, pay to 0551999901 via Mobile Money. Use your agent Unique ID during checkout.",
    price: 5.5,
    category: "AirtelTigo",
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: "6",
    name: "AirtelTigo 2GB Data Bundle",
    shortDescription: "2GB data valid for 30 days",
    description:
      "Payment Instructions:\nAfter checkout, pay to 0551999901 via Mobile Money. Use your agent Unique ID during checkout.",
    price: 10.0,
    category: "AirtelTigo",
    image: "/placeholder.svg?height=200&width=300",
  },
]

export async function getProducts(): Promise<Product[]> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 100))
  return products
}

export async function getProductById(id: string): Promise<Product | null> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 100))
  return products.find((product) => product.id === id) || null
}

export async function getProductsByCategory(category: string): Promise<Product[]> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 100))
  return products.filter((product) => product.category === category)
}

// Add the missing functions needed for the admin dashboard
export async function getOrders(userId?: string) {
  // Mock orders data
  const orders = [
    {
      id: "order1",
      productId: "1",
      productName: "MTN 1GB Data Bundle",
      userId: userId || "user1",
      userName: "John Doe",
      status: "pending",
      price: 5.5,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "order2",
      productId: "2",
      productName: "MTN 2GB Data Bundle",
      userId: userId || "user1",
      userName: "John Doe",
      status: "completed",
      price: 10.0,
      createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
      updatedAt: new Date(Date.now() - 86400000).toISOString(),
    },
  ]

  return orders
}

export async function getAllOrders() {
  // Mock all orders data
  return [
    {
      id: "order1",
      productId: "1",
      productName: "MTN 1GB Data Bundle",
      userId: "user1",
      userName: "John Doe",
      status: "pending",
      price: 5.5,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "order2",
      productId: "2",
      productName: "MTN 2GB Data Bundle",
      userId: "user1",
      userName: "John Doe",
      status: "completed",
      price: 10.0,
      createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
      updatedAt: new Date(Date.now() - 86400000).toISOString(),
    },
    {
      id: "order3",
      productId: "3",
      productName: "Vodafone 1GB Data Bundle",
      userId: "user2",
      userName: "Jane Smith",
      status: "processing",
      price: 5.5,
      createdAt: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
      updatedAt: new Date(Date.now() - 172800000).toISOString(),
    },
  ]
}

export async function updateOrderStatus(orderId: string, newStatus: string) {
  // Mock update order status
  console.log(`Updating order ${orderId} to status ${newStatus}`)
  return true
}

export async function getAdminStats() {
  // Mock admin stats
  return {
    totalOrders: 156,
    pendingOrders: 32,
    completedOrders: 98,
    totalAgents: 24,
  }
}

export async function getRecentOrders(userId: string) {
  // Mock recent orders for a user
  return [
    {
      id: "order1",
      productId: "1",
      productName: "MTN 1GB Data Bundle",
      userId: userId,
      userName: "John Doe",
      status: "pending",
      price: 5.5,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "order2",
      productId: "2",
      productName: "MTN 2GB Data Bundle",
      userId: userId,
      userName: "John Doe",
      status: "completed",
      price: 10.0,
      createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
      updatedAt: new Date(Date.now() - 86400000).toISOString(),
    },
  ]
}

export async function getStats(userId: string) {
  // Mock user stats
  return {
    totalOrders: 12,
    pendingOrders: 3,
    completedOrders: 9,
  }
}
