"use client"

import { useState } from "react"
import { Button } from "./ui/button"
import { Sparkles, Loader2, Check, X } from "lucide-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card"

interface AIWritingAssistantProps {
  onContentGenerated: (content: string) => void
  onContentImproved: (content: string) => void
  generateContent: (prompt: string, existingContent?: string) => Promise<string>
  improveContent: (content: string) => Promise<string>
  currentContent?: string
  placeholder?: string
  context?: string
}

export function AIWritingAssistant({
  onContentGenerated,
  onContentImproved,
  generateContent,
  improveContent,
  currentContent,
  placeholder = "Enter a topic or brief description...",
  context,
}: AIWritingAssistantProps) {
  const [prompt, setPrompt] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [isImproving, setIsImproving] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)

  const handleGenerate = async () => {
    if (!prompt.trim() && !currentContent) return

    setIsGenerating(true)
    try {
      const content = await generateContent(prompt || placeholder, currentContent)
      onContentGenerated(content)
      setPrompt("")
      setShowSuggestions(false)
    } catch (error) {
      console.error("Error generating content:", error)
      alert("Failed to generate content. Please try again.")
    } finally {
      setIsGenerating(false)
    }
  }

  const handleImprove = async () => {
    if (!currentContent || currentContent.trim().length < 10) {
      alert("Please enter some content first to improve it.")
      return
    }

    setIsImproving(true)
    try {
      const improved = await improveContent(currentContent)
      onContentImproved(improved)
      setShowSuggestions(false)
    } catch (error) {
      console.error("Error improving content:", error)
      alert("Failed to improve content. Please try again.")
    } finally {
      setIsImproving(false)
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <div className="flex-1 flex gap-2">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder={placeholder}
            className="flex-1 px-3 py-2 text-sm border rounded-md bg-background"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !isGenerating) {
                handleGenerate()
              }
            }}
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleGenerate}
            disabled={isGenerating || (!prompt.trim() && !currentContent)}
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                Generate
              </>
            )}
          </Button>
        </div>
        {currentContent && currentContent.trim().length > 10 && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleImprove}
            disabled={isImproving}
          >
            {isImproving ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Improving...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                Improve
              </>
            )}
          </Button>
        )}
      </div>
      {showSuggestions && (
        <Card className="mt-2">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm">AI Suggestions</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowSuggestions(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              AI features are available. Use the buttons above to generate or improve content.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

