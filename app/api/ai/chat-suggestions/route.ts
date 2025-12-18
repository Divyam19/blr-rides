import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { generateChatSuggestions } from "@/lib/ai/content"
import { z } from "zod"

export const runtime = 'nodejs'

const suggestionsSchema = z.object({
  conversationContext: z.array(z.string()).optional().default([]),
  lastMessage: z.string().optional(),
})

export async function POST(request: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const data = suggestionsSchema.parse(body)

    try {
      const suggestions = await generateChatSuggestions(
        data.conversationContext || [],
        data.lastMessage
      )

      return NextResponse.json({ suggestions })
    } catch (error: any) {
      // Return default suggestions if AI fails
      return NextResponse.json({
        suggestions: [
          "What's your favorite route in Bangalore?",
          "Any tips for beginner riders?",
          "Looking for riding buddies!",
        ],
      })
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input", details: error.errors },
        { status: 400 }
      )
    }

    console.error("Error generating chat suggestions:", error)
    return NextResponse.json(
      { error: "Failed to generate suggestions" },
      { status: 500 }
    )
  }
}

