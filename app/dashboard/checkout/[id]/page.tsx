import CheckoutClientPage from "./CheckoutClientPage"

// Generate static params for all product IDs
export async function generateStaticParams() {
  const { products } = await import("@/lib/data")

  return products.map((product) => ({
    id: product.id,
  }))
}

export default function CheckoutPage() {
  return <CheckoutClientPage />
}
