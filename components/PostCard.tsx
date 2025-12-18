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

  const communityTypeColors = {
    general: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
    rides: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
    questions: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
    marketplace: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
  }

  return (
    <Card className="card-modern fade-in group">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-3 flex-wrap">
              <span className={`badge-modern ${communityTypeColors[post.communityType as keyof typeof communityTypeColors] || "bg-secondary text-secondary-foreground"}`}>
                {post.communityType}
              </span>
              <span className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
              </span>
            </div>
            <Link href={`/post/${post.id}`}>
              <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors line-clamp-2">
                {post.title}
              </h3>
            </Link>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
          {post.content}
        </p>
        <div className="flex items-center justify-between pt-3 border-t border-border/50">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 bg-muted/50 rounded-lg p-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleVote("upvote")}
                disabled={isVoting}
                className={`h-7 px-2 rounded-md transition-all ${
                  currentVote === "upvote" 
                    ? "text-primary bg-primary/10" 
                    : "hover:bg-background"
                }`}
              >
                <ArrowUp className="h-4 w-4" />
              </Button>
              <span className={`text-sm font-semibold min-w-[2ch] text-center px-1 ${
                score > 0 ? "text-green-600 dark:text-green-400" :
                score < 0 ? "text-red-600 dark:text-red-400" :
                "text-muted-foreground"
              }`}>
                {score}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleVote("downvote")}
                disabled={isVoting}
                className={`h-7 px-2 rounded-md transition-all ${
                  currentVote === "downvote" 
                    ? "text-red-600 bg-red-500/10" 
                    : "hover:bg-background"
                }`}
              >
                <ArrowDown className="h-4 w-4" />
              </Button>
            </div>
            <Link href={`/post/${post.id}`}>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-7 gap-1.5 hover:bg-primary/10 hover:text-primary transition-all"
              >
                <MessageCircle className="h-4 w-4" />
                <span className="text-sm font-medium">{post._count.comments}</span>
              </Button>
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-semibold text-xs">
              {post.author.name.charAt(0).toUpperCase()}
            </div>
            <span className="text-sm font-medium text-muted-foreground hidden sm:inline">
              {post.author.name}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

