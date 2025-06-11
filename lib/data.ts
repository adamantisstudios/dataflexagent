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
