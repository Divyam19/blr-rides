"use client"

import { useEffect, useState } from "react"
import { PostCard } from "@/components/PostCard"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { Plus } from "lucide-react"

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
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Community Feed</h1>
        <Link href="/post/create">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create Post
          </Button>
        </Link>
      </div>

      <div className="flex gap-2 mb-6 flex-wrap">
        {communityTypes.map((type) => (
          <Button
            key={type.value || "all"}
            variant={selectedType === type.value ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedType(type.value)}
          >
            {type.label}
          </Button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-muted rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-muted rounded w-full mb-2"></div>
                <div className="h-4 bg-muted rounded w-5/6"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : posts.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-muted-foreground mb-4">No posts yet</p>
            <Link href="/post/create">
              <Button>Create the first post</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  )
}

