import Hero from "@/components/hero"
import Features from "@/components/features"
import HowItWorks from "@/components/how-it-works"
import ContactSection from "@/components/contact-section"

export default function Home() {
  return (
    <div className="container mx-auto px-4">
      <Hero />
      <Features />
      <HowItWorks />
      <ContactSection />
    </div>
  )
}
