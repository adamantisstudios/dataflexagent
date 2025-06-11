"use client"

import { useState } from "react"
import Link from "next/link"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"

export default function Header() {
  const { user, logout } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link href="/" className="text-2xl font-bold text-primary">
            DataFlex Ghana
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/" className="text-gray-600 hover:text-primary">
              Home
            </Link>
            {user ? (
              <>
                {user.role === "admin" ? (
                  <>
                    <Link href="/admin/dashboard" className="text-gray-600 hover:text-primary">
                      Admin Dashboard
                    </Link>
                    <Link href="/admin/orders" className="text-gray-600 hover:text-primary">
                      Orders
                    </Link>
                    <Link href="/admin/agents" className="text-gray-600 hover:text-primary">
                      Agents
                    </Link>
                  </>
                ) : (
                  <>
                    <Link href="/dashboard" className="text-gray-600 hover:text-primary">
                      Dashboard
                    </Link>
                    <Link href="/dashboard/products" className="text-gray-600 hover:text-primary">
                      Products
                    </Link>
                    <Link href="/dashboard/orders" className="text-gray-600 hover:text-primary">
                      Orders
                    </Link>
                    <Link href="/dashboard/settings" className="text-gray-600 hover:text-primary">
                      Settings
                    </Link>
                  </>
                )}
                <Button variant="ghost" onClick={logout}>
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link href="/login" className="text-gray-600 hover:text-primary">
                  Login
                </Link>
                <Link href="/register" passHref>
                  <Button>Register</Button>
                </Link>
              </>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="md:hidden py-4 space-y-3">
            <Link href="/" className="block text-gray-600 hover:text-primary" onClick={() => setMobileMenuOpen(false)}>
              Home
            </Link>
            {user ? (
              <>
                {user.role === "admin" ? (
                  <>
                    <Link
                      href="/admin/dashboard"
                      className="block text-gray-600 hover:text-primary"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Admin Dashboard
                    </Link>
                    <Link
                      href="/admin/orders"
                      className="block text-gray-600 hover:text-primary"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Orders
                    </Link>
                    <Link
                      href="/admin/agents"
                      className="block text-gray-600 hover:text-primary"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Agents
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      href="/dashboard"
                      className="block text-gray-600 hover:text-primary"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <Link
                      href="/dashboard/products"
                      className="block text-gray-600 hover:text-primary"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Products
                    </Link>
                    <Link
                      href="/dashboard/orders"
                      className="block text-gray-600 hover:text-primary"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Orders
                    </Link>
                    <Link
                      href="/dashboard/settings"
                      className="block text-gray-600 hover:text-primary"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Settings
                    </Link>
                  </>
                )}
                <Button
                  variant="ghost"
                  onClick={() => {
                    logout()
                    setMobileMenuOpen(false)
                  }}
                  className="w-full justify-start px-0"
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="block text-gray-600 hover:text-primary"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Login
                </Link>
                <Link href="/register" onClick={() => setMobileMenuOpen(false)} className="block">
                  <Button className="w-full">Register</Button>
                </Link>
              </>
            )}
          </nav>
        )}
      </div>
    </header>
  )
}
