import { Wifi, ShieldCheck, Clock, CreditCard } from "lucide-react"

export default function Features() {
  const features = [
    {
      icon: <Wifi className="h-10 w-10 text-primary" />,
      title: "All Networks",
      description:
        "Sell data bundles for all major networks in Ghana including MTN, Vodafone, AirtelTigo, and Telecel.",
    },
    {
      icon: <ShieldCheck className="h-10 w-10 text-primary" />,
      title: "Secure Platform",
      description: "Our platform ensures secure transactions and protects your account information.",
    },
    {
      icon: <Clock className="h-10 w-10 text-primary" />,
      title: "Quick Delivery",
      description: "Fast delivery of data bundles to customers after payment confirmation.",
    },
    {
      icon: <CreditCard className="h-10 w-10 text-primary" />,
      title: "Easy Payments",
      description: "Simple payment process via Mobile Money for your convenience.",
    },
  ]

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Why Choose DataFlex Ghana</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-sm text-center">
              <div className="flex justify-center mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
