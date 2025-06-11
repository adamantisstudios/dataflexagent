"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { getProducts } from "@/lib/database"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { Product } from "@/lib/types"

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("all")
  const router = useRouter()
  const { user } = useAuth()

  useEffect(() => {
    if (!user) {
      router.push("/login")
      return
    }

    const loadProducts = async () => {
      try {
        const allProducts = await getProducts()
        setProducts(allProducts)
      } catch (error) {
        console.error("Failed to load products:", error)
      } finally {
        setLoading(false)
      }
    }

    loadProducts()
  }, [user, router])

  const filteredProducts = activeTab === "all" ? products : products.filter((product) => product.category === activeTab)

  const handleCheckout = (productId: string) => {
    router.push(`/dashboard/checkout/${productId}`)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  const categories = ["all", ...new Set(products.map((product) => product.category))]

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Data Bundles</h1>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
        <TabsList className="mb-4">
          {categories.map((category) => (
            <TabsTrigger key={category} value={category} className="capitalize">
              {category}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
          <Card key={product.id} className="overflow-hidden">
            <CardHeader>
              <CardTitle>{product.name}</CardTitle>
              <CardDescription>{product.shortDescription}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold mb-2">GHS {product.price.toFixed(2)}</div>
              <p className="text-sm text-muted-foreground">{product.description}</p>
            </CardContent>
            <CardFooter>
              <Button onClick={() => handleCheckout(product.id)} className="w-full">
                Buy Now
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No data bundles available in this category.</p>
        </div>
      )}
    </div>
  )
}
