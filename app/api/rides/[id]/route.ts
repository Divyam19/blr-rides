import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export const runtime = 'nodejs'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const ride = await prisma.ride.findUnique({
      where: { id },
      select: {
        id: true,
        title: true,
        description: true,
        startLocation: true,
        endLocation: true,
        startLat: true,
        startLng: true,
        endLat: true,
        endLng: true,
        routePolyline: true,
        date: true,
        difficulty: true,
        maxParticipants: true,
        isAIGenerated: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        host: {
          select: {
            id: true,
            name: true,
            avatar: true,
            reputation: true,
          },
        },
        participants: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                avatar: true,
              },
            },
          },
        },
      },
    })

    if (!ride) {
      return NextResponse.json({ error: "Ride not found" }, { status: 404 })
    }

    return NextResponse.json({ ride })
  } catch (error) {
    console.error("Error fetching ride:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function DELETE(
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
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    await prisma.ride.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting ride:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

