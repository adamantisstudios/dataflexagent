"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { getProductById } from "@/lib/data"
import { createOrder } from "@/lib/database"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertCircle, CheckCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import type { Product } from "@/lib/types"

export default function CheckoutPage() {
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [orderPlaced, setOrderPlaced] = useState(false)
  const [error, setError] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const productId = params.id as string

  useEffect(() => {
    if (!user) {
      router.push("/login")
      return
    }

    const loadProduct = async () => {
      try {
        const productData = await getProductById(productId)
        if (!productData) {
          setError("Product not found")
        } else {
          setProduct(productData)
        }
      } catch (error) {
        console.error("Failed to load product:", error)
        setError("Failed to load product details")
      } finally {
        setLoading(false)
      }
    }

    loadProduct()
  }, [productId, user, router])

  const handlePlaceOrder = async () => {
    if (!user || !product) return

    setIsProcessing(true)
    setError("")

    try {
      await createOrder({
        product_id: product.id,
        product_name: product.name,
        user_id: user.id,
        user_name: user.name,
        price: product.price,
      })
      setOrderPlaced(true)
    } catch (error) {
      console.error("Failed to place order:", error)
      setError("Failed to place order. Please try again.")
    } finally {
      setIsProcessing(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (error && !product) {
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
          </CardHeader>
          <CardContent>
            <Alert className="mb-4 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertTitle className="text-green-600">Success</AlertTitle>
              <AlertDescription>
                Your order for {product?.name} has been placed successfully. Please make payment to complete your order.
              </AlertDescription>
            </Alert>

            <div className="border rounded-lg p-4 mb-4">
              <h3 className="font-medium mb-2">Payment Instructions</h3>
              <ol className="list-decimal list-inside space-y-2 text-sm">
                <li>
                  Send GHS {product?.price.toFixed(2)} to <strong>0551999901</strong> via Mobile Money
                </li>
                <li>
                  Use your Agent ID <strong>{user?.id}</strong> as the reference
                </li>
                <li>Your order will be processed once payment is confirmed</li>
              </ol>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => router.push("/dashboard/products")}>
              Order More
            </Button>
            <Button onClick={() => router.push("/dashboard/orders")}>View My Orders</Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>

      {product && (
        <Card>
          <CardHeader>
            <CardTitle>{product.name}</CardTitle>
            <CardDescription>{product.shortDescription}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium">Price</h3>
                <p className="text-2xl font-bold">GHS {product.price.toFixed(2)}</p>
              </div>

              <div>
                <h3 className="font-medium">Description</h3>
                <p className="text-sm text-muted-foreground">{product.description}</p>
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Payment Information</AlertTitle>
                <AlertDescription>
                  After placing your order, send payment to <strong>0551999901</strong> via Mobile Money. Use your Agent
                  ID <strong>{user?.id}</strong> as reference.
                </AlertDescription>
              </Alert>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => router.push("/dashboard/products")}>
              Back
            </Button>
            <Button onClick={handlePlaceOrder} disabled={isProcessing}>
              {isProcessing ? "Processing..." : "Place Order"}
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  )
}
