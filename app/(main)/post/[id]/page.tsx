"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { formatDistanceToNow } from "date-fns"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ArrowUp, ArrowDown, MessageCircle, Trash2 } from "lucide-react"
import { CommentSection } from "@/components/CommentSection"

interface Post {
  id: string
  title: string
  content: string
  author: {
    id: string
    name: string
    avatar: string | null
    reputation: number
  }
  upvotes: number
  downvotes: number
  communityType: string
  createdAt: Date
  comments: Comment[]
  _count: {
    comments: number
  }
}

interface Comment {
  id: string
  content: string
  author: {
    id: string
    name: string
    avatar: string | null
  }
  createdAt: Date
  replies: Comment[]
}

export default function PostDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [post, setPost] = useState<Post | null>(null)
  const [loading, setLoading] = useState(true)
  const [upvotes, setUpvotes] = useState(0)
  const [downvotes, setDownvotes] = useState(0)
  const [currentVote, setCurrentVote] = useState<"upvote" | "downvote" | null>(null)
  const [isVoting, setIsVoting] = useState(false)

  useEffect(() => {
    fetchPost()
  }, [params.id])

  const fetchPost = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/posts/${params.id}`)
      const data = await response.json()
      if (data.post) {
        setPost(data.post)
        setUpvotes(data.post.upvotes)
        setDownvotes(data.post.downvotes)
      }
    } catch (error) {
      console.error("Error fetching post:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleVote = async (type: "upvote" | "downvote") => {
    if (isVoting) return

    setIsVoting(true)
    const previousVote = currentVote
    const previousUpvotes = upvotes
    const previousDownvotes = downvotes

    // Optimistic update
    if (previousVote === type) {
      setCurrentVote(null)
      if (type === "upvote") setUpvotes(upvotes - 1)
      else setDownvotes(downvotes - 1)
    } else {
      setCurrentVote(type)
      if (type === "upvote") {
        setUpvotes(upvotes + (previousVote === "downvote" ? 2 : 1))
        if (previousVote === "downvote") setDownvotes(downvotes - 1)
      } else {
        setDownvotes(downvotes + (previousVote === "upvote" ? 2 : 1))
        if (previousVote === "upvote") setUpvotes(upvotes - 1)
      }
    }

    try {
      const response = await fetch(`/api/posts/${params.id}/vote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type }),
      })

      if (!response.ok) {
        setCurrentVote(previousVote)
        setUpvotes(previousUpvotes)
        setDownvotes(previousDownvotes)
      } else {
        const data = await response.json()
        setUpvotes(data.post.upvotes)
        setDownvotes(data.post.downvotes)
        setCurrentVote(data.userVote)
      }
    } catch (error) {
      setCurrentVote(previousVote)
      setUpvotes(previousUpvotes)
      setDownvotes(previousDownvotes)
    } finally {
      setIsVoting(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this post?")) return

    try {
      const response = await fetch(`/api/posts/${params.id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        router.push("/feed")
      }
    } catch (error) {
      console.error("Error deleting post:", error)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Card className="animate-pulse">
          <CardContent className="p-6">
            <div className="h-8 bg-muted rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-muted rounded w-full mb-2"></div>
            <div className="h-4 bg-muted rounded w-5/6"></div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-muted-foreground">Post not found</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const score = upvotes - downvotes

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs px-2 py-1 rounded-full bg-secondary text-secondary-foreground">
                  {post.communityType}
                </span>
                <span className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                </span>
              </div>
              <h1 className="text-3xl font-bold mb-2">{post.title}</h1>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>by {post.author.name}</span>
                <span>•</span>
                <span>{post.author.reputation} reputation</span>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="prose max-w-none mb-6">
            <p className="whitespace-pre-wrap">{post.content}</p>
          </div>
          <div className="flex items-center justify-between border-t pt-4">
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleVote("upvote")}
                disabled={isVoting}
                className={`h-8 px-2 ${currentVote === "upvote" ? "text-primary" : ""}`}
              >
                <ArrowUp className="h-4 w-4" />
              </Button>
              <span className="text-sm font-medium min-w-[2ch] text-center">
                {score}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleVote("downvote")}
                disabled={isVoting}
                className={`h-8 px-2 ${currentVote === "downvote" ? "text-primary" : ""}`}
              >
                <ArrowDown className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <MessageCircle className="h-4 w-4" />
              <span className="text-sm">{post._count.comments} comments</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <CommentSection postId={params.id as string} />
    </div>
  )
}

