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
import { Sparkles, PenTool, ArrowLeft, FileText } from "lucide-react"
import Link from "next/link"

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

  const communityTypeOptions = [
    { value: "general", label: "General", icon: "💬", color: "bg-blue-500" },
    { value: "rides", label: "Rides", icon: "🚴", color: "bg-green-500" },
    { value: "questions", label: "Questions", icon: "❓", color: "bg-purple-500" },
    { value: "marketplace", label: "Marketplace", icon: "🛒", color: "bg-orange-500" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <Link href="/feed">
            <Button variant="ghost" size="sm" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Feed
            </Button>
          </Link>
          <div className="flex items-center gap-3 mb-2">
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <PenTool className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Create a Post</h1>
              <p className="text-muted-foreground">Share your thoughts with the community</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Community Type Selection */}
          <Card className="card-modern">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Choose Community
              </CardTitle>
              <CardDescription>Select where you want to share your post</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {communityTypeOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setValue("communityType", option.value as any)}
                    className={`p-4 rounded-xl border-2 transition-all text-left hover:scale-105 ${
                      communityType === option.value
                        ? "border-primary bg-primary/10 shadow-md"
                        : "border-border hover:border-primary/50 bg-card"
                    }`}
                  >
                    <div className="text-2xl mb-2">{option.icon}</div>
                    <div className="font-semibold text-sm">{option.label}</div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Title */}
          <Card className="card-modern">
            <CardContent className="pt-6">
              <Label htmlFor="title" className="text-base font-semibold mb-3 block">
                What's on your mind?
              </Label>
              <Input
                id="title"
                placeholder="Give your post a catchy title..."
                className="text-lg h-14 form-field-modern"
                {...register("title")}
              />
              {errors.title && (
                <p className="text-sm text-destructive mt-2">{errors.title.message}</p>
              )}
            </CardContent>
          </Card>

          {/* Content with AI */}
          <Card className="card-modern">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  Your Story
                </CardTitle>
                <div className="flex items-center gap-1 text-xs text-muted-foreground bg-primary/10 px-2 py-1 rounded-full">
                  <Sparkles className="h-3 w-3" />
                  <span>AI Powered</span>
                </div>
              </div>
              <CardDescription>Write your post or let AI help you craft it</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <AIWritingAssistant
                onContentGenerated={handleAIContentGenerated}
                onContentImproved={handleAIContentImproved}
                generateContent={generatePostContent}
                improveContent={improvePostContent}
                currentContent={content}
                placeholder="Describe what you want to write about..."
                context={communityType}
              />
              <div className="form-field-modern">
                <Textarea
                  id="content"
                  placeholder="Share your thoughts, experiences, or questions... Start typing or use AI assistance above!"
                  rows={12}
                  className="resize-none text-base leading-relaxed"
                  {...register("content")}
                />
                {errors.content && (
                  <p className="text-sm text-destructive mt-2">{errors.content.message}</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Error Message */}
          {error && (
            <Card className="border-destructive/50 bg-destructive/10">
              <CardContent className="pt-6">
                <p className="text-sm text-destructive">{error}</p>
              </CardContent>
            </Card>
          )}

          {/* Actions */}
          <div className="flex gap-3 justify-end sticky bottom-4 bg-background/80 backdrop-blur-sm p-4 rounded-xl border border-border/50 shadow-lg -mx-4">
            <Button
              type="button"
              variant="outline"
              size="lg"
              onClick={() => router.back()}
              className="px-6"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              size="lg"
              className="btn-modern px-8 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Publishing...
                </>
              ) : (
                <>
                  <PenTool className="h-4 w-4 mr-2" />
                  Publish Post
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

