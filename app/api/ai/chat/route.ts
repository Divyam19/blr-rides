import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { getAIResponse } from "@/lib/openai"
import { z } from "zod"

export const runtime = 'nodejs'

const chatSchema = z.object({
  message: z.string().min(1),
})

export async function POST(request: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { message } = chatSchema.parse(body)

    // Search knowledge base for relevant context
    const searchTerms = message.toLowerCase().split(/\s+/)
    
    const relevantKnowledge = await prisma.rulesKnowledgeBase.findMany({
      where: {
        OR: [
          { question: { contains: message, mode: "insensitive" } },
          { answer: { contains: message, mode: "insensitive" } },
          { tags: { hasSome: searchTerms } },
        ],
      },
      take: 5,
    })

    const context = relevantKnowledge.map(
      (kb) => `Q: ${kb.question}\nA: ${kb.answer}`
    )

    // Get AI response with context
    let aiResponse: string
    try {
      aiResponse = await getAIResponse(message, context)
    } catch (error: any) {
      // If AI fails, provide a fallback response from knowledge base
      if (relevantKnowledge.length > 0) {
        aiResponse = `Based on our knowledge base:\n\n${relevantKnowledge[0].answer}\n\n(Note: Enhanced AI features are currently unavailable. This is a direct answer from our knowledge base.)`
      } else {
        aiResponse = "I'm sorry, I couldn't find relevant information in our knowledge base, and the AI service is currently unavailable. Please try asking about traffic rules, safety guidelines, or bike maintenance."
      }
    }

    return NextResponse.json({
      response: aiResponse,
      sources: relevantKnowledge.map((kb) => ({
        category: kb.category,
        question: kb.question,
      })),
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input", details: error.errors },
        { status: 400 }
      )
    }

    console.error("Error in AI chat:", error)
    return NextResponse.json(
      { error: "Failed to get AI response. Please try again later." },
      { status: 500 }
    )
  }
}

