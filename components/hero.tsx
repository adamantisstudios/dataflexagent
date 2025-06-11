import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function Hero() {
  return (
    <section
      className="relative py-20 bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: "linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('/images/ad2-placeholder.jpg')",
      }}
    >
      <div className="container mx-auto px-4 text-center text-white">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">DataFlex Ghana</h1>
        <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
          Your trusted partner for data bundle sales and distribution across Ghana. Fast, reliable, and affordable data
          bundles for all networks.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/register">
            <Button
              size="lg"
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 text-lg font-semibold shadow-lg transition-all duration-300 hover:shadow-xl"
            >
              Become an Agent
            </Button>
          </Link>
          <Link href="/login">
            <Button
              size="lg"
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 text-lg font-semibold shadow-lg transition-all duration-300 hover:shadow-xl"
            >
              Agent Login
            </Button>
          </Link>
        </div>
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
            <h3 className="text-2xl font-bold mb-2">500+</h3>
            <p className="text-lg">Active Agents</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
            <h3 className="text-2xl font-bold mb-2">10,000+</h3>
            <p className="text-lg">Orders Completed</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
            <h3 className="text-2xl font-bold mb-2">24/7</h3>
            <p className="text-lg">Customer Support</p>
          </div>
        </div>
      </div>
    </section>
  )
}
