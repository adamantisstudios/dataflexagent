"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { mtnBundles, airtelTigoBundles, telecelBundles } from "@/lib/data"

export default function ProductsPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("mtn")

  const handleBuyBundle = (product: any) => {
    if (!user) {
      router.push("/login")
      return
    }
    router.push(`/dashboard/checkout/${product.id}`)
  }

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Data Bundles</h1>

      <Tabs defaultValue="mtn" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="mtn">MTN</TabsTrigger>
          <TabsTrigger value="airteltigo">AirtelTigo</TabsTrigger>
          <TabsTrigger value="telecel">Telecel</TabsTrigger>
        </TabsList>

        <TabsContent value="mtn">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mtnBundles.map((bundle) => (
              <Card key={bundle.id}>
                <CardHeader>
                  <CardTitle className="text-2xl">{bundle.name}</CardTitle>
                  <CardDescription>Valid for {bundle.validity}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">₵{bundle.price.toFixed(2)}</p>
                </CardContent>
                <CardFooter>
                  <Button onClick={() => handleBuyBundle(bundle)} className="w-full">
                    Buy Now
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="airteltigo">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {airtelTigoBundles.map((bundle) => (
              <Card key={bundle.id}>
                <CardHeader>
                  <CardTitle className="text-2xl">{bundle.name}</CardTitle>
                  <CardDescription>Valid for {bundle.validity}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">₵{bundle.price.toFixed(2)}</p>
                </CardContent>
                <CardFooter>
                  <Button onClick={() => handleBuyBundle(bundle)} className="w-full">
                    Buy Now
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="telecel">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {telecelBundles.map((bundle) => (
              <Card key={bundle.id}>
                <CardHeader>
                  <CardTitle className="text-2xl">{bundle.name}</CardTitle>
                  <CardDescription>Valid for {bundle.validity}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">₵{bundle.price.toFixed(2)}</p>
                </CardContent>
                <CardFooter>
                  <Button onClick={() => handleBuyBundle(bundle)} className="w-full">
                    Buy Now
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
