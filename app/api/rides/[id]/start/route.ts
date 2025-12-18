import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export const runtime = 'nodejs'

// POST - Start a ride (change status to ongoing)
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const ride = await prisma.ride.findUnique({
      where: { id },
    })

    if (!ride) {
      return NextResponse.json({ error: "Ride not found" }, { status: 404 })
    }

    if (ride.hostId !== session.user.id) {
      return NextResponse.json(
        { error: "Only the host can start the ride" },
        { status: 403 }
      )
    }

    if (ride.status !== "upcoming") {
      return NextResponse.json(
        { error: "Ride can only be started if it's upcoming" },
        { status: 400 }
      )
    }

    const updatedRide = await prisma.ride.update({
      where: { id },
      data: {
        status: "ongoing",
      },
    })

    return NextResponse.json({ ride: updatedRide })
  } catch (error) {
    console.error("Error starting ride:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

