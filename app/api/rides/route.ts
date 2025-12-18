import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

export const runtime = 'nodejs'

const createRideSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().min(1),
  startLocation: z.string().min(1),
  endLocation: z.string().min(1),
  startLat: z.number().optional().nullable(),
  startLng: z.number().optional().nullable(),
  endLat: z.number().optional().nullable(),
  endLng: z.number().optional().nullable(),
  routePolyline: z.string().optional().nullable(),
  date: z.string().datetime(),
  difficulty: z.enum(["easy", "medium", "hard"]),
  maxParticipants: z.number().int().min(2).max(100).default(20),
})

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const difficulty = searchParams.get("difficulty")
    const location = searchParams.get("location")
    const date = searchParams.get("date")
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "20")
    const skip = (page - 1) * limit

    const where: any = {
      status: "upcoming",
    }

    if (difficulty) {
      where.difficulty = difficulty
    }

    if (location) {
      where.OR = [
        { startLocation: { contains: location, mode: "insensitive" } },
        { endLocation: { contains: location, mode: "insensitive" } },
      ]
    }

    if (date) {
      const dateObj = new Date(date)
      where.date = {
        gte: dateObj,
      }
    }

    const [rides, total] = await Promise.all([
      prisma.ride.findMany({
        where,
        include: {
          host: {
            select: {
              id: true,
              name: true,
              avatar: true,
            },
          },
          participants: {
            where: {
              status: "confirmed",
            },
            select: {
              id: true,
            },
          },
          _count: {
            select: {
              participants: true,
            },
          },
        },
        orderBy: {
          date: "asc",
        },
        skip,
        take: limit,
      }),
      prisma.ride.count({ where }),
    ])

    return NextResponse.json({
      rides,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Error fetching rides:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const data = createRideSchema.parse(body)

    const ride = await prisma.ride.create({
      data: {
        title: data.title,
        description: data.description,
        startLocation: data.startLocation,
        endLocation: data.endLocation,
        startLat: data.startLat ?? null,
        startLng: data.startLng ?? null,
        endLat: data.endLat ?? null,
        endLng: data.endLng ?? null,
        routePolyline: data.routePolyline ?? null,
        date: new Date(data.date),
        difficulty: data.difficulty,
        maxParticipants: data.maxParticipants,
        hostId: session.user.id,
      },
      include: {
        host: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
      },
    })

    return NextResponse.json({ ride }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input", details: error.errors },
        { status: 400 }
      )
    }

    console.error("Error creating ride:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

