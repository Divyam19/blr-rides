import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

export const runtime = 'nodejs'

const voteSchema = z.object({
  type: z.enum(["upvote", "downvote"]),
})

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

    const body = await request.json()
    const { type } = voteSchema.parse(body)

    const post = await prisma.post.findUnique({
      where: { id },
    })

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 })
    }

    // Check if user already voted
    const existingVote = await prisma.vote.findUnique({
      where: {
        userId_postId: {
          userId: session.user.id,
          postId: id,
        },
      },
    })

    let voteDelta = 0
    let newVoteType = type

    if (existingVote) {
      if (existingVote.type === type) {
        // Remove vote if clicking same type
        await prisma.vote.delete({
          where: {
            userId_postId: {
              userId: session.user.id,
              postId: id,
            },
          },
        })
        voteDelta = type === "upvote" ? -1 : 1
        newVoteType = null
      } else {
        // Change vote type
        await prisma.vote.update({
          where: {
            userId_postId: {
              userId: session.user.id,
              postId: id,
            },
          },
          data: { type },
        })
        voteDelta = type === "upvote" ? 2 : -2
      }
    } else {
      // Create new vote
      await prisma.vote.create({
        data: {
          userId: session.user.id,
          postId: id,
          type,
        },
      })
      voteDelta = type === "upvote" ? 1 : -1
    }

    // Update post vote counts
    const updatedPost = await prisma.post.update({
      where: { id },
      data: {
        upvotes: {
          increment: type === "upvote" ? (existingVote ? (existingVote.type === "downvote" ? 2 : 0) : 1) : (existingVote && existingVote.type === "upvote" ? -1 : 0),
        },
        downvotes: {
          increment: type === "downvote" ? (existingVote ? (existingVote.type === "upvote" ? 2 : 0) : 1) : (existingVote && existingVote.type === "downvote" ? -1 : 0),
        },
      },
    })

    return NextResponse.json({
      success: true,
      post: updatedPost,
      userVote: newVoteType,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input", details: error.errors },
        { status: 400 }
      )
    }

    console.error("Error voting on post:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

