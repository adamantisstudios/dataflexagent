"use client"

import type { Product, Order, User } from "./types"

// Parse CSV data
const parseCSV = async (): Promise<Product[]> => {
  try {
    const response = await fetch(
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/data_bundle_products-t3lkxOGPefM3bBQxsKec5aj9Znu7ZA.csv",
    )
    const text = await response.text()

    // Skip header row and parse CSV
    const rows = text.split("\n").slice(1)

    return rows
      .filter((row) => row.trim())
      .map((row, index) => {
        const columns = row.split(",")

        // Handle cases where commas are inside quoted fields
        const processedColumns = []
        let currentColumn = ""
        let insideQuotes = false

        for (let i = 0; i < columns.length; i++) {
          const col = columns[i]

          if (insideQuotes) {
            currentColumn += "," + col
            if (col.includes('"') && !col.endsWith('\\"')) {
              insideQuotes = false
              processedColumns.push(currentColumn.replace(/"/g, ""))
              currentColumn = ""
            }
          } else {
            if (col.startsWith('"') && !col.endsWith('"')) {
              insideQuotes = true
              currentColumn = col
            } else {
              processedColumns.push(col.replace(/"/g, ""))
            }
          }
        }

        if (currentColumn) {
          processedColumns.push(currentColumn.replace(/"/g, ""))
        }

        // Ensure we have enough columns
        while (processedColumns.length < 6) {
          processedColumns.push("")
        }

        return {
          id: `product-${index + 1}`,
          name: processedColumns[0],
          price: Number.parseFloat(processedColumns[1]) || 0,
          category: processedColumns[2],
          description: processedColumns[4],
          shortDescription: processedColumns[5],
        }
      })
  } catch (error) {
    console.error("Error parsing CSV:", error)
    // Return fallback data
    return [
      {
        id: "product-1",
        name: "MTN - 1GB",
        price: 5.0,
        category: "MTN Data Bundles",
        description: "After checkout, pay to 0551999901 via Mobile Money. Send proof on WhatsApp.",
        shortDescription: "Manual delivery after payment confirmation.",
      },
      {
        id: "product-2",
        name: "Vodafone - 2GB",
        price: 10.0,
        category: "Vodafone Data Bundles",
        description: "After checkout, pay to 0551999901 via Mobile Money. Send proof on WhatsApp.",
        shortDescription: "Manual delivery after payment confirmation.",
      },
    ]
  }
}

// Mock data storage using localStorage
export const getProducts = async (): Promise<Product[]> => {
  return await parseCSV()
}

export const getProductById = async (id: string): Promise<Product | null> => {
  const products = await getProducts()
  return products.find((product) => product.id === id) || null
}

export const getOrders = async (userId?: string): Promise<Order[]> => {
  const orders = JSON.parse(localStorage.getItem("orders") || "[]")
  if (userId) {
    return orders.filter((order: Order) => order.userId === userId)
  }
  return orders
}

export const getAllOrders = async (): Promise<Order[]> => {
  const orders = JSON.parse(localStorage.getItem("orders") || "[]")
  const users = JSON.parse(localStorage.getItem("users") || "[]")
  const products = await getProducts()

  return orders.map((order: Order) => {
    const user = users.find((u: any) => u.id === order.userId) || { name: "Unknown User" }
    const product = products.find((p) => p.id === order.productId)

    return {
      ...order,
      userName: user.name,
      productName: product?.name || "Unknown Product",
    }
  })
}

export const getAllAgents = async (): Promise<User[]> => {
  const users = JSON.parse(localStorage.getItem("users") || "[]")
  const orders = JSON.parse(localStorage.getItem("orders") || "[]")

  // Filter only agent users and add order count
  return users
    .filter((user: User) => user.role === "agent")
    .map((user: User) => {
      const userOrders = orders.filter((order: Order) => order.userId === user.id)
      return {
        ...user,
        orderCount: userOrders.length,
      }
    })
}

export const getRecentOrders = async (userId: string): Promise<Order[]> => {
  const orders = await getOrders(userId)
  const products = await getProducts()

  return orders
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5)
    .map((order) => {
      const product = products.find((p) => p.id === order.productId)
      return {
        ...order,
        productName: product?.name || "Unknown Product",
      }
    })
}

export const createOrder = async (order: Omit<Order, "id">): Promise<Order> => {
  const orders = JSON.parse(localStorage.getItem("orders") || "[]")
  const products = await getProducts()
  const product = products.find((p) => p.id === order.productId)

  const newOrder: Order = {
    ...order,
    id: `order-${Date.now()}`,
    productName: product?.name || "Unknown Product",
  }

  orders.push(newOrder)
  localStorage.setItem("orders", JSON.stringify(orders))

  return newOrder
}

export const updateOrderStatus = async (orderId: string, status: string, note?: string): Promise<void> => {
  const orders = JSON.parse(localStorage.getItem("orders") || "[]")
  const updatedOrders = orders.map((order: Order) => {
    if (order.id === orderId) {
      return {
        ...order,
        status,
        processingNote: note || order.processingNote,
        updatedAt: new Date().toISOString(),
      }
    }
    return order
  })
  localStorage.setItem("orders", JSON.stringify(updatedOrders))
}

export const getStats = async (userId: string) => {
  const orders = await getOrders(userId)

  return {
    totalOrders: orders.length,
    pendingOrders: orders.filter((order) => order.status === "pending").length,
    completedOrders: orders.filter((order) => order.status === "completed").length,
  }
}

export const getAdminStats = async () => {
  const orders = await getAllOrders()
  const users = JSON.parse(localStorage.getItem("users") || "[]")

  return {
    totalOrders: orders.length,
    pendingOrders: orders.filter((order) => order.status === "pending").length,
    completedOrders: orders.filter((order) => order.status === "completed").length,
    totalAgents: users.filter((user: any) => user.role === "agent").length,
  }
}
