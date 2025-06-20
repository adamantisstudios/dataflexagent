"use client"

export default function Footer() {
  const handleAdminClick = () => {
    window.location.href = "/admin"
  }

  return (
    <footer className="bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-bold mb-4">DataFlex Ghana</h3>
            <p className="text-gray-600">Your trusted partner for data bundle sales and distribution.</p>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-4">Contact</h3>
            <p className="text-gray-600">Phone: 0551999901</p>
            <p className="text-gray-600">WhatsApp: 0551999901</p>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a href="/" className="text-gray-600 hover:text-primary transition-colors">
                  Home
                </a>
              </li>
              <li>
                <a href="/login" className="text-gray-600 hover:text-primary transition-colors">
                  Agent Login
                </a>
              </li>
              <li>
                <a href="/register" className="text-gray-600 hover:text-primary transition-colors">
                  Register
                </a>
              </li>
              {/* Removed admin login link */}
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-200 mt-8 pt-6 text-center text-gray-500">
          <p>&copy; {new Date().getFullYear()} DataFlex Ghana. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
