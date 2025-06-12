import { Suspense } from "react"
import CheckoutClientPage from "./CheckoutClientPage"

// Remove generateStaticParams to avoid build-time issues
export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="h-96 bg-gray-200 rounded"></div>
              <div className="h-96 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      }
    >
      <CheckoutClientPage />
    </Suspense>
  )
}
