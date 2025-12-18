import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

export const runtime = 'nodejs'

const locationUpdateSchema = z.object({
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
})

// POST - Update user's location for a ride
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

    // Verify user is a participant of the ride
    const participant = await prisma.rideParticipant.findUnique({
      where: {
        rideId_userId: {
          rideId: id,
          userId: session.user.id,
        },
      },
      include: {
        ride: true,
      },
    })

    if (!participant || participant.status !== "confirmed") {
      return NextResponse.json(
        { error: "You must be a confirmed participant to track location" },
        { status: 403 }
      )
    }

    if (participant.ride.status !== "ongoing") {
      return NextResponse.json(
        { error: "Ride must be ongoing to track location" },
        { status: 400 }
      )
    }

    const body = await request.json()
    const data = locationUpdateSchema.parse(body)

    const locationUpdate = await prisma.rideLocationUpdate.create({
      data: {
        rideId: id,
        userId: session.user.id,
        latitude: data.latitude,
        longitude: data.longitude,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
      },
    })

    return NextResponse.json({ locationUpdate }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input", details: error.errors },
        { status: 400 }
      )
    }

    console.error("Error updating location:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

// GET - Get all location updates for a ride
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Verify user is a participant of the ride
    const participant = await prisma.rideParticipant.findUnique({
      where: {
        rideId_userId: {
          rideId: id,
          userId: session.user.id,
        },
      },
    })

    if (!participant || participant.status !== "confirmed") {
      return NextResponse.json(
        { error: "You must be a confirmed participant to view tracking" },
        { status: 403 }
      )
    }

    // Get the latest location for each participant
    const locationUpdates = await prisma.rideLocationUpdate.findMany({
      where: {
        rideId: id,
        timestamp: {
          gte: new Date(Date.now() - 5 * 60 * 1000), // Last 5 minutes
        },
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
      },
      orderBy: {
        timestamp: "desc",
      },
    })

    // Group by user and get latest location for each
    const latestLocations = locationUpdates.reduce((acc, update) => {
      if (!acc[update.userId] || acc[update.userId].timestamp < update.timestamp) {
        acc[update.userId] = update
      }
      return acc
    }, {} as Record<string, typeof locationUpdates[0]>)

    return NextResponse.json({
      locations: Object.values(latestLocations).map((loc) => ({
        lat: loc.latitude,
        lng: loc.longitude,
        userId: loc.user.id,
        userName: loc.user.name,
        timestamp: loc.timestamp,
      })),
    })
  } catch (error) {
    console.error("Error fetching locations:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

