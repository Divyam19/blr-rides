import { prisma } from "@/lib/prisma"
import OpenAI from "openai"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function getRideRecommendations(userId: string) {
  try {
    // Get user's past rides and preferences
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        rideParticipants: {
          include: {
            ride: true,
          },
          take: 10,
        },
        preferences: true,
      },
    })

    if (!user) return []

    // Get upcoming rides
    const upcomingRides = await prisma.ride.findMany({
      where: {
        status: "upcoming",
        date: {
          gte: new Date(),
        },
        participants: {
          none: {
            userId: userId,
          },
        },
      },
      include: {
        host: true,
        participants: true,
      },
      take: 20,
    })

    // Analyze user preferences
    const userDifficulty = user.rideParticipants
      .map((rp) => rp.ride.difficulty)
      .reduce((acc, diff) => {
        acc[diff] = (acc[diff] || 0) + 1
        return acc
      }, {} as Record<string, number>)

    const preferredDifficulty = Object.keys(userDifficulty).reduce((a, b) =>
      userDifficulty[a] > userDifficulty[b] ? a : b
    ) || "medium"

    // Score rides based on user preferences
    const scoredRides = upcomingRides.map((ride) => {
      let score = 0

      // Difficulty match
      if (ride.difficulty === preferredDifficulty) {
        score += 10
      }

      // Location similarity (simple check)
      const userLocations = user.rideParticipants.map((rp) => [
        rp.ride.startLocation,
        rp.ride.endLocation,
      ]).flat()
      if (
        userLocations.some(
          (loc) =>
            ride.startLocation.includes(loc) || ride.endLocation.includes(loc)
        )
      ) {
        score += 5
      }

      // Popular rides (more participants)
      score += ride.participants.length

      // Recent rides get priority
      const daysUntil = Math.floor(
        (ride.date.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
      )
      if (daysUntil <= 7) score += 5

      return { ride, score }
    })

    // Sort by score and return top 5
    return scoredRides
      .sort((a, b) => b.score - a.score)
      .slice(0, 5)
      .map((item) => item.ride)
  } catch (error) {
    console.error("Error getting ride recommendations:", error)
    return []
  }
}

export async function generateAIRide() {
  try {
    const prompt = `Generate a bike ride suggestion for Bangalore, India. 
Return a JSON object with:
- title: A catchy title for the ride
- description: A detailed description of the route, meeting point, and highlights
- startLocation: Starting location in Bangalore
- endLocation: Destination in Bangalore
- difficulty: one of "easy", "medium", or "hard"
- suggestedDate: A date in the next 7 days in ISO format

Make it interesting and suitable for bike riders. Popular routes include Nandi Hills, Mysore Road, Bannerghatta, etc.`

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "You are a helpful assistant that suggests bike rides in Bangalore. Always return valid JSON.",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.8,
    })

    const response = completion.choices[0]?.message?.content
    if (!response) return null

    // Parse JSON response
    const jsonMatch = response.match(/\{[\s\S]*\}/)
    if (!jsonMatch) return null

    const rideData = JSON.parse(jsonMatch[0])
    return rideData
  } catch (error) {
    console.error("Error generating AI ride:", error)
    return null
  }
}

