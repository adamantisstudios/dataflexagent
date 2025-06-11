import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Hero() {
  return (
    <div className="py-16 md:py-24 text-center">
      <h1 className="text-4xl md:text-6xl font-bold mb-6">DataFlex Ghana</h1>
      <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
        The premier platform for agents to sell data bundles across all networks in Ghana
      </p>
      <div className="flex flex-col sm:flex-row justify-center gap-4">
        <Link href="/register" passHref>
          <Button size="lg">Become an Agent</Button>
        </Link>
        <Link href="/login" passHref>
          <Button variant="outline" size="lg">
            Agent Login
          </Button>
        </Link>
      </div>
    </div>
  )
}
