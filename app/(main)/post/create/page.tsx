"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { AIWritingAssistant } from "@/components/AIWritingAssistant"
import { Sparkles } from "lucide-react"

const createPostSchema = z.object({
  title: z.string().min(1).max(200),
  content: z.string().min(1),
  communityType: z.enum(["general", "rides", "questions", "marketplace"]),
})

type CreatePostForm = z.infer<typeof createPostSchema>

export default function CreatePostPage() {
  const router = useRouter()
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CreatePostForm>({
    resolver: zodResolver(createPostSchema),
    defaultValues: {
      communityType: "general",
    },
  })

  const communityType = watch("communityType")
  const title = watch("title")
  const content = watch("content")

  const generatePostContent = async (prompt: string, existingContent?: string) => {
    const response = await fetch("/api/ai/content", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "post",
        topic: prompt || title || "general post",
        communityType: communityType,
        existingContent: existingContent,
      }),
    })

    if (!response.ok) {
      const data = await response.json()
      throw new Error(data.error || "Failed to generate content")
    }

    const data = await response.json()
    return data.content
  }

  const improvePostContent = async (text: string) => {
    const response = await fetch("/api/ai/content", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "improve",
        text: text,
        context: `Post in ${communityType} community`,
      }),
    })

    if (!response.ok) {
      const data = await response.json()
      throw new Error(data.error || "Failed to improve content")
    }

    const data = await response.json()
    return data.content
  }

  const handleAIContentGenerated = (generatedContent: string) => {
    setValue("content", generatedContent)
  }

  const handleAIContentImproved = (improvedContent: string) => {
    setValue("content", improvedContent)
  }

  const onSubmit = async (data: CreatePostForm) => {
    setIsLoading(true)
    setError("")

    try {
      const response = await fetch("/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!response.ok) {
        setError(result.error || "Failed to create post")
        return
      }

      router.push(`/post/${result.post.id}`)
    } catch (err) {
      setError("Something went wrong. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>Create a Post</CardTitle>
          <CardDescription>Share something with the community</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            {error && (
              <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                {error}
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="communityType">Community</Label>
              <Select
                value={communityType}
                onValueChange={(value) => setValue("communityType", value as any)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="general">General</SelectItem>
                  <SelectItem value="rides">Rides</SelectItem>
                  <SelectItem value="questions">Questions</SelectItem>
                  <SelectItem value="marketplace">Marketplace</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                placeholder="Enter post title..."
                {...register("title")}
              />
              {errors.title && (
                <p className="text-sm text-destructive">{errors.title.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="content">Content</Label>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Sparkles className="h-3 w-3" />
                  <span>AI Powered</span>
                </div>
              </div>
              <AIWritingAssistant
                onContentGenerated={handleAIContentGenerated}
                onContentImproved={handleAIContentImproved}
                generateContent={generatePostContent}
                improveContent={improvePostContent}
                currentContent={content}
                placeholder="Describe what you want to write about..."
                context={communityType}
              />
              <Textarea
                id="content"
                placeholder="Write your post... or use AI to generate content above"
                rows={10}
                {...register("content")}
              />
              {errors.content && (
                <p className="text-sm text-destructive">{errors.content.message}</p>
              )}
            </div>
            <div className="flex gap-2">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Creating..." : "Create Post"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </form>
      </Card>
    </div>
  )
}

