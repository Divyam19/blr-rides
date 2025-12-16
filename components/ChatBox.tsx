"use client"

import { useEffect, useState, useRef } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

interface Message {
  id: string
  content: string
  sender: {
    id: string
    name: string
    avatar: string | null
  }
  timestamp: Date
}

interface ChatBoxProps {
  conversationId: string
}

export function ChatBox({ conversationId }: ChatBoxProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [content, setContent] = useState("")
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetchCurrentUser()
    fetchMessages()
    // Poll for new messages every 2 seconds
    const interval = setInterval(fetchMessages, 2000)
    return () => clearInterval(interval)
  }, [conversationId])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const fetchCurrentUser = async () => {
    try {
      const response = await fetch("/api/auth/session")
      const data = await response.json()
      if (data.user) {
        setCurrentUserId(data.user.id)
      }
    } catch (error) {
      console.error("Error fetching user:", error)
    }
  }

  const fetchMessages = async () => {
    try {
      const response = await fetch(`/api/chat/conversations/${conversationId}/messages`)
      const data = await response.json()
      setMessages(data.messages || [])
    } catch (error) {
      console.error("Error fetching messages:", error)
    } finally {
      setLoading(false)
    }
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim() || isSubmitting) return

    const messageContent = content
    setContent("")
    setIsSubmitting(true)

    // Optimistic update
    const tempMessage: Message = {
      id: `temp-${Date.now()}`,
      content: messageContent,
      sender: {
        id: currentUserId || "",
        name: "You",
        avatar: null,
      },
      timestamp: new Date(),
    }
    setMessages([...messages, tempMessage])

    try {
      const response = await fetch(`/api/chat/conversations/${conversationId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: messageContent }),
      })

      if (response.ok) {
        fetchMessages()
      } else {
        // Remove optimistic message on error
        setMessages(messages)
        alert("Failed to send message")
      }
    } catch (error) {
      console.error("Error sending message:", error)
      setMessages(messages)
      alert("Something went wrong")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="border-b">
        <h3 className="text-lg font-semibold">Chat</h3>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col p-0">
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {loading ? (
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-12 bg-muted rounded"></div>
                </div>
              ))}
            </div>
          ) : messages.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              No messages yet. Start the conversation!
            </div>
          ) : (
            messages.map((message) => {
              const isOwn = message.sender.id === currentUserId
              return (
                <div
                  key={message.id}
                  className={`flex ${isOwn ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[70%] rounded-lg p-3 ${
                      isOwn
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    }`}
                  >
                    {!isOwn && (
                      <p className="text-xs font-medium mb-1 opacity-80">
                        {message.sender.name}
                      </p>
                    )}
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    <p className={`text-xs mt-1 ${isOwn ? "opacity-80" : "text-muted-foreground"}`}>
                      {formatDistanceToNow(new Date(message.timestamp), { addSuffix: true })}
                    </p>
                  </div>
                </div>
              )
            })
          )}
          <div ref={messagesEndRef} />
        </div>
        <form onSubmit={handleSubmit} className="border-t p-4">
          <div className="flex gap-2">
            <Input
              placeholder="Type a message..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              disabled={isSubmitting}
            />
            <Button type="submit" disabled={isSubmitting || !content.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

