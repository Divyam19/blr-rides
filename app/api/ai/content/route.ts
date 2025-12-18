import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { generatePostContent, generateRideDescription, improveText } from "@/lib/ai/content"
import { z } from "zod"

export const runtime = 'nodejs'

const generatePostSchema = z.object({
  type: z.enum(["post", "ride", "improve"]),
  topic: z.string().optional(),
  communityType: z.enum(["general", "rides", "questions", "marketplace"]).optional(),
  title: z.string().optional(),
  startLocation: z.string().optional(),
  endLocation: z.string().optional(),
  difficulty: z.string().optional(),
  existingContent: z.string().optional(),
  text: z.string().optional(),
  context: z.string().optional(),
})

export async function POST(request: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const data = generatePostSchema.parse(body)

    try {
      let result: string

      if (data.type === "post") {
        if (!data.topic || !data.communityType) {
          return NextResponse.json(
            { error: "Topic and communityType are required for post generation" },
            { status: 400 }
          )
        }
        result = await generatePostContent(
          data.topic,
          data.communityType,
          data.existingContent
        )
      } else if (data.type === "ride") {
        if (!data.title || !data.startLocation || !data.endLocation || !data.difficulty) {
          return NextResponse.json(
            { error: "Title, startLocation, endLocation, and difficulty are required for ride description" },
            { status: 400 }
          )
        }
        result = await generateRideDescription(
          data.title,
          data.startLocation,
          data.endLocation,
          data.difficulty,
          data.existingContent
        )
      } else if (data.type === "improve") {
        if (!data.text) {
          return NextResponse.json(
            { error: "Text is required for improvement" },
            { status: 400 }
          )
        }
        result = await improveText(data.text, data.context)
      } else {
        return NextResponse.json(
          { error: "Invalid type" },
          { status: 400 }
        )
      }

      return NextResponse.json({ content: result })
    } catch (error: any) {
      if (error.message?.includes("API key")) {
        return NextResponse.json(
          { error: "AI features are not configured. Please set up your OpenAI API key." },
          { status: 503 }
        )
      }
      throw error
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input", details: error.errors },
        { status: 400 }
      )
    }

    console.error("Error in AI content generation:", error)
    return NextResponse.json(
      { error: "Failed to generate content. Please try again later." },
      { status: 500 }
    )
  }
}

