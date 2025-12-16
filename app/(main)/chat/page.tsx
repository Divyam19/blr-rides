"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send, Plus, Users } from "lucide-react"
import { ChatBox } from "@/components/ChatBox"

interface Conversation {
  id: string
  isGroup: boolean
  name: string | null
  participants: {
    user: {
      id: string
      name: string
      avatar: string | null
    }
  }[]
  messages: {
    id: string
    content: string
    sender: {
      id: string
      name: string
    }
    timestamp: Date
  }[]
}

export default function ChatPage() {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)

  useEffect(() => {
    fetchConversations()
    fetch("/api/auth/session")
      .then((res) => res.json())
      .then((data) => {
        if (data.user) {
          setCurrentUserId(data.user.id)
        }
      })
  }, [])

  const fetchConversations = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/chat/conversations")
      const data = await response.json()
      setConversations(data.conversations || [])
    } catch (error) {
      console.error("Error fetching conversations:", error)
    } finally {
      setLoading(false)
    }
  }

  const getConversationName = (conversation: Conversation) => {
    if (conversation.isGroup) {
      return conversation.name || "Group Chat"
    }
    // For 1-on-1, show the other user's name
    const otherUser = conversation.participants.find(
      (p) => p.user.id !== currentUserId
    )
    return otherUser?.user.name || "Chat"
  }

  const getLastMessage = (conversation: Conversation) => {
    if (conversation.messages.length === 0) return "No messages yet"
    const lastMsg = conversation.messages[0]
    return `${lastMsg.sender.name}: ${lastMsg.content.substring(0, 50)}${lastMsg.content.length > 50 ? "..." : ""}`
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl h-[calc(100vh-8rem)]">
      <div className="flex gap-4 h-full">
        {/* Conversations List */}
        <Card className="w-80 flex-shrink-0">
          <CardContent className="p-0 h-full flex flex-col">
            <div className="p-4 border-b flex items-center justify-between">
              <h2 className="text-lg font-semibold">Messages</h2>
              <Button size="sm" variant="ghost">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex-1 overflow-y-auto">
              {loading ? (
                <div className="p-4 space-y-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="animate-pulse">
                      <div className="h-16 bg-muted rounded"></div>
                    </div>
                  ))}
                </div>
              ) : conversations.length === 0 ? (
                <div className="p-4 text-center text-muted-foreground">
                  <Users className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>No conversations yet</p>
                </div>
              ) : (
                <div className="divide-y">
                  {conversations.map((conversation) => (
                    <button
                      key={conversation.id}
                      onClick={() => setSelectedConversation(conversation.id)}
                      className={`w-full p-4 text-left hover:bg-accent transition-colors ${
                        selectedConversation === conversation.id ? "bg-accent" : ""
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          {conversation.isGroup ? (
                            <Users className="h-5 w-5 text-primary" />
                          ) : (
                            <span className="text-sm font-medium text-primary">
                              {getConversationName(conversation).charAt(0).toUpperCase()}
                            </span>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">
                            {getConversationName(conversation)}
                          </p>
                          <p className="text-sm text-muted-foreground truncate">
                            {getLastMessage(conversation)}
                          </p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Chat Box */}
        <div className="flex-1">
          {selectedConversation ? (
            <ChatBox conversationId={selectedConversation} />
          ) : (
            <Card className="h-full flex items-center justify-center">
              <CardContent className="text-center">
                <Users className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                <p className="text-muted-foreground">Select a conversation to start chatting</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

