"use client"

import { useEffect, useState } from "react"
import { PostCard } from "@/components/PostCard"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { Plus, MessageSquare, Filter, Sparkles } from "lucide-react"

interface Post {
  id: string
  title: string
  content: string
  author: {
    id: string
    name: string
    avatar: string | null
  }
  upvotes: number
  downvotes: number
  communityType: string
  createdAt: Date
  _count: {
    comments: number
  }
}

export default function FeedPage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedType, setSelectedType] = useState<string | null>(null)

  useEffect(() => {
    fetchPosts()
  }, [selectedType])

  const fetchPosts = async () => {
    setLoading(true)
    try {
      const url = selectedType
        ? `/api/posts?communityType=${selectedType}`
        : "/api/posts"
      const response = await fetch(url)
      const data = await response.json()
      setPosts(data.posts || [])
    } catch (error) {
      console.error("Error fetching posts:", error)
    } finally {
      setLoading(false)
    }
  }

  const communityTypes = [
    { value: null, label: "All" },
    { value: "general", label: "General" },
    { value: "rides", label: "Rides" },
    { value: "questions", label: "Questions" },
    { value: "marketplace", label: "Marketplace" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <MessageSquare className="h-7 w-7 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold">Community Feed</h1>
                <p className="text-muted-foreground mt-1">Share, discuss, and connect</p>
              </div>
            </div>
            <Link href="/post/create">
              <Button size="lg" className="btn-modern bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90">
                <Plus className="h-5 w-5 mr-2" />
                Create Post
              </Button>
            </Link>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Filter className="h-4 w-4" />
              <span>Filter:</span>
            </div>
            {communityTypes.map((type, index) => (
              <Button
                key={type.value || "all"}
                variant={selectedType === type.value ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedType(type.value)}
                className={`badge-modern transition-all ${
                  selectedType === type.value
                    ? "bg-gradient-to-r from-primary to-accent text-white border-0 shadow-md scale-105"
                    : "hover:scale-105"
                }`}
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                {type.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="card-modern">
                <CardContent className="p-6">
                  <div className="skeleton h-6 rounded w-3/4 mb-4"></div>
                  <div className="skeleton h-4 rounded w-full mb-2"></div>
                  <div className="skeleton h-4 rounded w-5/6"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : posts.length === 0 ? (
          <Card className="card-modern">
            <CardContent className="empty-state">
              <div className="empty-state-icon">
                <MessageSquare className="h-full w-full" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No posts yet</h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Be the first to share something with the community! Start a conversation, ask a question, or share your biking experience.
              </p>
              <Link href="/post/create">
                <Button size="lg" className="btn-modern bg-gradient-to-r from-primary to-accent">
                  <Plus className="h-5 w-5 mr-2" />
                  Create First Post
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {posts.map((post, index) => (
              <div key={post.id} className="stagger-item">
                <PostCard post={post} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

