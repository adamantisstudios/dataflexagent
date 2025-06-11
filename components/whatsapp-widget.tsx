"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { MessageCircle, X, Send } from "lucide-react"

const WHATSAPP_NUMBER = "+233242799990"

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
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={() => setIsOpen(!isOpen)}
          className="h-12 w-12 rounded-full bg-green-500 hover:bg-green-600 shadow-lg"
          size="icon"
        >
          {isOpen ? <X className="h-5 w-5" /> : <MessageCircle className="h-5 w-5" />}
        </Button>
      </div>

      {/* WhatsApp Widget */}
      {isOpen && (
        <div className="fixed bottom-20 right-4 z-50 w-72 max-w-[calc(100vw-2rem)]">
          <Card className="shadow-xl border-green-200">
            <CardHeader className="bg-green-500 text-white rounded-t-lg p-3">
              <CardTitle className="text-base flex items-center gap-2">
                <MessageCircle className="h-4 w-4" />
                WhatsApp Support
              </CardTitle>
              <CardDescription className="text-green-100 text-sm">Send us a message</CardDescription>
            </CardHeader>
            <CardContent className="p-3 space-y-3">
              {/* Custom Message */}
              <div className="space-y-2">
                <Textarea
                  placeholder="Type your message here..."
                  value={customMessage}
                  onChange={(e) => setCustomMessage(e.target.value)}
                  className="min-h-[60px] resize-none text-sm"
                />
                <Button
                  onClick={handleCustomMessage}
                  disabled={!customMessage.trim()}
                  className="w-full bg-green-500 hover:bg-green-600 gap-2 text-sm"
                >
                  <Send className="h-3 w-3" />
                  Send Message
                </Button>
              </div>

              {/* Contact Info */}
              <div className="text-center text-xs text-muted-foreground border-t pt-2">
                <p>WhatsApp: {WHATSAPP_NUMBER}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  )
}
