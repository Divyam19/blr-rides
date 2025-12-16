import { prisma } from "@/lib/prisma"
import { generateAIRide } from "@/lib/ai/recommendations"

export async function autoGenerateRides() {
  try {
    console.log("Starting auto-ride generation...")

    // Check if we should generate rides (e.g., once per day)
    const lastGenerated = await prisma.ride.findFirst({
      where: {
        isAIGenerated: true,
        createdAt: {
          gte: new Date(Date.now() - 24 * 60 * 60 * 1000), // Last 24 hours
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    if (lastGenerated) {
      console.log("Rides already generated today")
      return
    }

    // Generate 2-3 AI rides
    const ridesToGenerate = 2
    const generatedRides = []

    for (let i = 0; i < ridesToGenerate; i++) {
      const rideData = await generateAIRide()
      if (!rideData) continue

      // Find a system user or create one for AI rides
      let systemUser = await prisma.user.findFirst({
        where: { email: "ai@blrriders.com" },
      })

      if (!systemUser) {
        systemUser = await prisma.user.create({
          data: {
            email: "ai@blrriders.com",
            password: "system", // This won't be used for login
            name: "AI Assistant",
          },
        })
      }

      // Create the ride
      const ride = await prisma.ride.create({
        data: {
          title: rideData.title,
          description: rideData.description,
          startLocation: rideData.startLocation,
          endLocation: rideData.endLocation,
          date: new Date(rideData.suggestedDate),
          difficulty: rideData.difficulty,
          maxParticipants: 20,
          hostId: systemUser.id,
          isAIGenerated: true,
        },
      })

      generatedRides.push(ride)
      console.log(`Generated ride: ${ride.title}`)
    }

    console.log(`Successfully generated ${generatedRides.length} rides`)
    return generatedRides
  } catch (error) {
    console.error("Error in auto-generate rides:", error)
  }
}

