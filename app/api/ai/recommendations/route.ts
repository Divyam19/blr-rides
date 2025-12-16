import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { getRideRecommendations } from "@/lib/ai/recommendations"

export const runtime = 'nodejs'

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const recommendations = await getRideRecommendations(session.user.id)

    return NextResponse.json({ recommendations })
  } catch (error) {
    console.error("Error getting recommendations:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

