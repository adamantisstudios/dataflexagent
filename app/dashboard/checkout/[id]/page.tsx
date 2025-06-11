"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { useRouter, useParams } from "next/navigation"
import { getProductById } from "@/lib/data"
import { createOrder } from "@/lib/database"
import type { Product } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, CheckCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function CheckoutPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const params = useParams()
  const [product, setProduct] = useState<Product | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [orderPlaced, setOrderPlaced] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login")
    }
  }, [user, loading, router])

  useEffect(() => {
    const loadProduct = async () => {
      try {
        if (params.id) {
          const data = await getProductById(params.id as string)
          setProduct(data)
        }
      } catch (error) {
        console.error("Failed to load product:", error)
        setError("Product not found")
      } finally {
        setIsLoading(false)
      }
    }

    loadProduct()
  }, [params.id])

  const handlePlaceOrder = async () => {
    try {
      if (product && user) {
        await createOrder({
          product_id: product.id,
          product_name: product.name,
          user_id: user.id,
          user_name: user.name,
          price: product.price,
        })
        setOrderPlaced(true)
      }
    } catch (error) {
      console.error("Failed to place order:", error)
      setError("Failed to place order. Please try again.")
    }
  }

  if (loading || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!user) return null

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <div className="mt-4">
          <Button onClick={() => router.push("/dashboard/products")}>Back to Products</Button>
        </div>
      </div>
    )
  }

  if (orderPlaced) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Order Placed Successfully!</CardTitle>
            <CardDescription>Your order has been placed and is awaiting payment confirmation.</CardDescription>
          </CardHeader>
          <CardContent>
            <Alert className="bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertTitle>Payment Instructions</AlertTitle>
              <AlertDescription className="mt-2">
                <p>
                  Please send payment to: <strong>0551999901</strong> via Mobile Money.
                </p>
                <p className="mt-2">Include your Agent ID ({user.id.substring(0, 8)}) in the payment description.</p>
                <p className="mt-2">After payment, check your order status from time to time.</p>
                <p className="mt-2 font-medium">Processing time: 1-40 minutes after payment confirmation.</p>
              </AlertDescription>
            </Alert>
          </CardContent>
          <CardFooter>
            <Button onClick={() => router.push("/dashboard/orders")} className="w-full">
              View My Orders
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  if (!product) return null

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>
      <Card>
        <CardHeader>
          <CardTitle>{product.name}</CardTitle>
          <CardDescription>{product.shortDescription}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center border-b pb-2">
              <span>Price:</span>
              <span className="font-bold">GHS {product.price.toFixed(2)}</span>
            </div>
            <div className="border p-4 rounded-md bg-gray-50">
              <h3 className="font-medium mb-2">Payment Instructions:</h3>
              <p>{product.description}</p>
            </div>
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Important</AlertTitle>
              <AlertDescription>
                Your Agent ID is <strong>{user.id.substring(0, 8)}</strong>. Please include this in your payment
                reference.
              </AlertDescription>
            </Alert>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handlePlaceOrder} className="w-full">
            Place Order
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
