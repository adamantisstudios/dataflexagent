"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, CreditCard, Phone, MapPin } from "lucide-react"
import { toast } from "@/hooks/use-toast"

// Static product data
const products = [
  { id: "mtn-1gb", name: "MTN 1GB", description: "1GB data bundle valid for 30 days", price: 5, category: "MTN" },
  { id: "mtn-2gb", name: "MTN 2GB", description: "2GB data bundle valid for 30 days", price: 9, category: "MTN" },
  { id: "mtn-5gb", name: "MTN 5GB", description: "5GB data bundle valid for 30 days", price: 20, category: "MTN" },
  { id: "mtn-10gb", name: "MTN 10GB", description: "10GB data bundle valid for 30 days", price: 35, category: "MTN" },
  { id: "mtn-20gb", name: "MTN 20GB", description: "20GB data bundle valid for 30 days", price: 65, category: "MTN" },
  {
    id: "vodafone-1gb",
    name: "Vodafone 1GB",
    description: "1GB data bundle valid for 30 days",
    price: 5,
    category: "Vodafone",
  },
  {
    id: "vodafone-2gb",
    name: "Vodafone 2GB",
    description: "2GB data bundle valid for 30 days",
    price: 9,
    category: "Vodafone",
  },
  {
    id: "vodafone-5gb",
    name: "Vodafone 5GB",
    description: "5GB data bundle valid for 30 days",
    price: 20,
    category: "Vodafone",
  },
  {
    id: "at-1gb",
    name: "AirtelTigo 1GB",
    description: "1GB data bundle valid for 30 days",
    price: 5,
    category: "AirtelTigo",
  },
  {
    id: "at-2gb",
    name: "AirtelTigo 2GB",
    description: "2GB data bundle valid for 30 days",
    price: 9,
    category: "AirtelTigo",
  },
  {
    id: "at-50gb",
    name: "AirtelTigo 50GB",
    description: "50GB data bundle valid for 30 days",
    price: 120,
    category: "AirtelTigo",
  },
]

export default function CheckoutClientPage() {
  const params = useParams()
  const [isLoading, setIsLoading] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [formData, setFormData] = useState({
    customerName: "",
    customerPhone: "",
    customerAddress: "",
    agentCode: "",
    notes: "",
  })

  useEffect(() => {
    setMounted(true)
  }, [])

  const product = products.find((p) => p.id === params?.id)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleBack = () => {
    if (typeof window !== "undefined") {
      window.history.back()
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!mounted) return

    setIsLoading(true)

    try {
      if (!formData.customerName || !formData.customerPhone || !formData.agentCode) {
        toast({
          title: "Missing Information",
          description: "Please fill in all required fields.",
          variant: "destructive",
        })
        return
      }

      if (!product) {
        toast({
          title: "Product Not Found",
          description: "The selected product could not be found.",
          variant: "destructive",
        })
        return
      }

      const orderData = {
        id: `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        productId: product.id,
        productName: product.name,
        productPrice: product.price,
        customerName: formData.customerName,
        customerPhone: formData.customerPhone,
        customerAddress: formData.customerAddress,
        agentCode: formData.agentCode,
        notes: formData.notes,
        status: "pending",
        createdAt: new Date().toISOString(),
      }

      if (typeof window !== "undefined") {
        const existingOrders = JSON.parse(localStorage.getItem("orders") || "[]")
        existingOrders.push(orderData)
        localStorage.setItem("orders", JSON.stringify(existingOrders))
      }

      toast({
        title: "Order Placed Successfully!",
        description: `Your order for ${product.name} has been submitted.`,
      })

      setTimeout(() => {
        if (typeof window !== "undefined") {
          window.location.href = "/dashboard"
        }
      }, 1500)
    } catch (error) {
      console.error("Error placing order:", error)
      toast({
        title: "Error",
        description: "Failed to place order. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (!mounted) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="h-96 bg-gray-200 rounded"></div>
            <div className="h-96 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
          <p className="text-gray-600 mb-6">The product you're looking for doesn't exist.</p>
          <Button onClick={handleBack}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Button variant="ghost" onClick={handleBack} className="mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Button>

      <div className="grid md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Order Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-lg">{product.name}</h3>
                <p className="text-gray-600">{product.description}</p>
              </div>
              <Badge variant="secondary">{product.category}</Badge>
            </div>

            <div className="border-t pt-4">
              <div className="flex justify-between items-center text-lg font-semibold">
                <span>Total:</span>
                <span className="text-primary">GH₵{product.price}</span>
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">What happens next?</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Your order will be processed within 24 hours</li>
                <li>• You'll receive a confirmation call</li>
                <li>• Data will be delivered to your number</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Customer Information</CardTitle>
            <CardDescription>Please provide the customer details for this order</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="customerName">Customer Name *</Label>
                <Input
                  id="customerName"
                  name="customerName"
                  value={formData.customerName}
                  onChange={handleInputChange}
                  placeholder="Enter customer's full name"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="customerPhone">Customer Phone *</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="customerPhone"
                    name="customerPhone"
                    type="tel"
                    value={formData.customerPhone}
                    onChange={handleInputChange}
                    placeholder="0XX XXX XXXX"
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="customerAddress">Customer Address</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="customerAddress"
                    name="customerAddress"
                    value={formData.customerAddress}
                    onChange={handleInputChange}
                    placeholder="Enter customer's address"
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="agentCode">Agent Code *</Label>
                <Input
                  id="agentCode"
                  name="agentCode"
                  value={formData.agentCode}
                  onChange={handleInputChange}
                  placeholder="Enter your agent code"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Additional Notes</Label>
                <Textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  placeholder="Any special instructions or notes..."
                  rows={3}
                />
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Processing..." : `Place Order - GH₵${product.price}`}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
