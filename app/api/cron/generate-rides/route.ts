import { NextResponse } from "next/server"
import { autoGenerateRides } from "@/lib/cron/auto-generate-rides"

export const runtime = 'nodejs'

// This endpoint can be called by a cron job service or manually
export async function GET(request: Request) {
  try {
    // Simple auth check - in production, use proper API key
    const authHeader = request.headers.get("authorization")
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const rides = await autoGenerateRides()

    return NextResponse.json({
      success: true,
      ridesGenerated: rides?.length || 0,
    })
  } catch (error) {
    console.error("Error in cron job:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

