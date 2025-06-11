"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { MessageCircle, X, Send } from "lucide-react"

const WHATSAPP_NUMBER = "+233242799990"

const PREDEFINED_MESSAGES = [
  {
    title: "Order Support",
    message: "Hello! I need help with my data bundle order. Can you please assist me?",
  },
  {
    title: "Payment Issue",
    message: "Hi! I made a payment but my order status hasn't updated. Please help me resolve this.",
  },
  {
    title: "Account Problem",
    message: "Hello! I'm having trouble with my agent account. Can you please help me?",
  },
  {
    title: "General Inquiry",
    message: "Hi! I have a question about DataFlex Ghana services. Can you provide more information?",
  },
]

export default function WhatsAppWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [customMessage, setCustomMessage] = useState("")

  const sendWhatsAppMessage = (message: string) => {
    const encodedMessage = encodeURIComponent(message)
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER.replace("+", "")}?text=${encodedMessage}`
    window.open(whatsappUrl, "_blank")
    setIsOpen(false)
    setCustomMessage("")
  }

  const handleCustomMessage = () => {
    if (customMessage.trim()) {
      sendWhatsAppMessage(customMessage)
    }
  }

  return (
    <>
      {/* WhatsApp Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsOpen(!isOpen)}
          className="h-14 w-14 rounded-full bg-green-500 hover:bg-green-600 shadow-lg"
          size="icon"
        >
          {isOpen ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
        </Button>
      </div>

      {/* WhatsApp Widget */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-80 max-w-[calc(100vw-3rem)]">
          <Card className="shadow-xl border-green-200">
            <CardHeader className="bg-green-500 text-white rounded-t-lg">
              <CardTitle className="text-lg flex items-center gap-2">
                <MessageCircle className="h-5 w-5" />
                WhatsApp Support
              </CardTitle>
              <CardDescription className="text-green-100">Get help with your orders and account</CardDescription>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              {/* Predefined Messages */}
              <div className="space-y-2">
                <h4 className="font-medium text-sm">Quick Messages:</h4>
                {PREDEFINED_MESSAGES.map((msg, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    className="w-full justify-start text-left h-auto p-3"
                    onClick={() => sendWhatsAppMessage(msg.message)}
                  >
                    <div>
                      <div className="font-medium text-xs">{msg.title}</div>
                      <div className="text-xs text-muted-foreground mt-1 line-clamp-2">{msg.message}</div>
                    </div>
                  </Button>
                ))}
              </div>

              {/* Custom Message */}
              <div className="space-y-2">
                <h4 className="font-medium text-sm">Custom Message:</h4>
                <Textarea
                  placeholder="Type your message here..."
                  value={customMessage}
                  onChange={(e) => setCustomMessage(e.target.value)}
                  className="min-h-[80px] resize-none"
                />
                <Button
                  onClick={handleCustomMessage}
                  disabled={!customMessage.trim()}
                  className="w-full bg-green-500 hover:bg-green-600 gap-2"
                >
                  <Send className="h-4 w-4" />
                  Send Message
                </Button>
              </div>

              {/* Contact Info */}
              <div className="text-center text-xs text-muted-foreground border-t pt-3">
                <p>WhatsApp: {WHATSAPP_NUMBER}</p>
                <p>Response time: Usually within 30 minutes</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  )
}
