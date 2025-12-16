import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export const runtime = 'nodejs'

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
      include: {
        participants: {
          where: {
            status: "confirmed",
          },
        },
      },
    })

    if (!ride) {
      return NextResponse.json({ error: "Ride not found" }, { status: 404 })
    }

    if (ride.status !== "upcoming") {
      return NextResponse.json(
        { error: "Cannot join this ride" },
        { status: 400 }
      )
    }

    if (ride.participants.length >= ride.maxParticipants) {
      return NextResponse.json(
        { error: "Ride is full" },
        { status: 400 }
      )
    }

    // Check if user already joined
    const existingParticipant = await prisma.rideParticipant.findUnique({
      where: {
        rideId_userId: {
          rideId: id,
          userId: session.user.id,
        },
      },
    })

    if (existingParticipant) {
      if (existingParticipant.status === "confirmed") {
        return NextResponse.json(
          { error: "You are already part of this ride" },
          { status: 400 }
        )
      }
      // Update status if pending/declined
      const participant = await prisma.rideParticipant.update({
        where: {
          rideId_userId: {
            rideId: id,
            userId: session.user.id,
          },
        },
        data: {
          status: "confirmed",
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
      return NextResponse.json({ participant })
    }

    const participant = await prisma.rideParticipant.create({
      data: {
        rideId: id,
        userId: session.user.id,
        status: "confirmed",
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

    return NextResponse.json({ participant }, { status: 201 })
  } catch (error) {
    console.error("Error joining ride:", error)
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

    const participant = await prisma.rideParticipant.findUnique({
      where: {
        rideId_userId: {
          rideId: id,
          userId: session.user.id,
        },
      },
    })

    if (!participant) {
      return NextResponse.json(
        { error: "Not part of this ride" },
        { status: 404 }
      )
    }

    await prisma.rideParticipant.delete({
      where: {
        rideId_userId: {
          rideId: id,
          userId: session.user.id,
        },
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error leaving ride:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

