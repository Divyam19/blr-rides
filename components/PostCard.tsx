"use client"

import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowUp, ArrowDown, MessageCircle } from "lucide-react"
import { useState } from "react"

interface PostCardProps {
  post: {
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
  userVote?: "upvote" | "downvote" | null
}

export function PostCard({ post, userVote }: PostCardProps) {
  const [upvotes, setUpvotes] = useState(post.upvotes)
  const [downvotes, setDownvotes] = useState(post.downvotes)
  const [currentVote, setCurrentVote] = useState<"upvote" | "downvote" | null>(userVote || null)
  const [isVoting, setIsVoting] = useState(false)

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
      const response = await fetch(`/api/posts/${post.id}/vote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type }),
      })

      if (!response.ok) {
        // Revert on error
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
      // Revert on error
      setCurrentVote(previousVote)
      setUpvotes(previousUpvotes)
      setDownvotes(previousDownvotes)
    } finally {
      setIsVoting(false)
    }
  }

  const score = upvotes - downvotes

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
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
            <Link href={`/post/${post.id}`}>
              <h3 className="text-lg font-semibold hover:text-primary transition-colors">
                {post.title}
              </h3>
            </Link>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
          {post.content}
        </p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
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
            <Link href={`/post/${post.id}`}>
              <Button variant="ghost" size="sm" className="h-8">
                <MessageCircle className="h-4 w-4 mr-1" />
                {post._count.comments}
              </Button>
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              by {post.author.name}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

