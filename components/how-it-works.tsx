export default function HowItWorks() {
  const steps = [
    {
      number: "01",
      title: "Register as an Agent",
      description: "Create your account to get started with DataFlex Ghana.",
    },
    {
      number: "02",
      title: "Browse Data Bundles",
      description: "Explore our wide range of data bundles from all networks.",
    },
    {
      number: "03",
      title: "Place an Order",
      description: "Select the data bundle you want to purchase for your customer.",
    },
    {
      number: "04",
      title: "Make Payment",
      description: "Pay via Mobile Money and send proof of payment.",
    },
    {
      number: "05",
      title: "Receive Confirmation",
      description: "Get confirmation once your data bundle is activated.",
    },
  ]

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
        <div className="space-y-8 md:space-y-0 md:grid md:grid-cols-5 md:gap-8">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-xl font-bold text-primary">{step.number}</span>
              </div>
              <h3 className="text-xl font-semibold text-center mb-2">{step.title}</h3>
              <p className="text-gray-600 text-center">{step.description}</p>
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-gray-200 -translate-x-1/2 transform"></div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
