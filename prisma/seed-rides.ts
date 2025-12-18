import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'
import 'dotenv/config'

const pool = new Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

// Mock rides
const mockRides = [
  {
    title: 'Early Morning Ride to Nandi Hills',
    description: 'Join us for an amazing sunrise ride to Nandi Hills! We\'ll start early at 5:30 AM from Hebbal, ride through Devanahalli, and reach Nandi Hills by 7 AM. Perfect weather, great roads, and amazing views await! Breakfast at the top. All skill levels welcome.',
    startLocation: 'Hebbal, Bangalore',
    endLocation: 'Nandi Hills',
    startLat: 13.0358,
    startLng: 77.5970,
    endLat: 13.3702,
    endLng: 77.6836,
    date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
    difficulty: 'medium',
    maxParticipants: 15,
    isAIGenerated: false,
    hostEmail: 'arjun@example.com',
  },
  {
    title: 'Weekend Ride to Mysore',
    description: 'A relaxed weekend ride to Mysore. We\'ll take the scenic Mysore Road, stop for breakfast at Maddur, and explore Mysore city. Return by evening. Perfect for riders who want a comfortable long-distance ride.',
    startLocation: 'Silk Board, Bangalore',
    endLocation: 'Mysore Palace, Mysore',
    startLat: 12.9172,
    startLng: 77.6226,
    endLat: 12.3051,
    endLng: 76.6552,
    date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
    difficulty: 'easy',
    maxParticipants: 20,
    isAIGenerated: true,
    hostEmail: 'vikram@example.com',
  },
  {
    title: 'Challenging Ride to Coorg',
    description: 'For experienced riders! A challenging 2-day ride to Coorg through winding mountain roads. We\'ll stay overnight and return the next day. This is not for beginners - expect steep climbs and sharp turns.',
    startLocation: 'Bangalore',
    endLocation: 'Madikeri, Coorg',
    startLat: 12.9716,
    startLng: 77.5946,
    endLat: 12.4204,
    endLng: 75.7397,
    date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 days from now
    difficulty: 'hard',
    maxParticipants: 10,
    isAIGenerated: false,
    hostEmail: 'karthik@example.com',
  },
  {
    title: 'City Exploration Ride',
    description: 'A casual city ride exploring different neighborhoods of Bangalore. We\'ll visit Cubbon Park, Lalbagh, and end at a nice cafe. Perfect for beginners and those new to Bangalore.',
    startLocation: 'Cubbon Park, Bangalore',
    endLocation: 'Lalbagh Botanical Garden',
    startLat: 12.9716,
    startLng: 77.5946,
    endLat: 12.9507,
    endLng: 77.5848,
    date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
    difficulty: 'easy',
    maxParticipants: 25,
    isAIGenerated: false,
    hostEmail: 'priya@example.com',
  },
  {
    title: 'Sunset Ride to Bannerghatta',
    description: 'Evening ride to Bannerghatta National Park to catch the sunset. We\'ll start at 4 PM, ride through the scenic route, and return by 7 PM. Great for photography enthusiasts!',
    startLocation: 'Koramangala, Bangalore',
    endLocation: 'Bannerghatta National Park',
    startLat: 12.9352,
    startLng: 77.6245,
    endLat: 12.8000,
    endLng: 77.5778,
    date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
    difficulty: 'medium',
    maxParticipants: 18,
    isAIGenerated: true,
    hostEmail: 'rajesh@example.com',
  },
  {
    title: 'Food Trail Ride',
    description: 'Combine biking with food! We\'ll ride to different food spots across Bangalore - from famous dosa joints to hidden gems. Perfect for foodie bikers!',
    startLocation: 'Indiranagar, Bangalore',
    endLocation: 'Malleshwaram, Bangalore',
    startLat: 12.9784,
    startLng: 77.6408,
    endLat: 12.9991,
    endLng: 77.5703,
    date: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000), // 6 days from now
    difficulty: 'easy',
    maxParticipants: 15,
    isAIGenerated: false,
    hostEmail: 'ananya@example.com',
  },
]

async function main() {
  console.log('🚴 Seeding rides...\n')

  // Get all users
  const users = await prisma.user.findMany()
  if (users.length === 0) {
    console.error('❌ No users found. Please run db:seed-all first to create users.')
    return
  }

  let createdCount = 0
  let skippedCount = 0

  for (const rideData of mockRides) {
    const host = users.find(u => u.email === rideData.hostEmail)
    if (!host) {
      console.warn(`⚠ Host not found: ${rideData.hostEmail}`)
      skippedCount++
      continue
    }

    try {
      // Check if ride already exists
      const existingRide = await prisma.ride.findFirst({
        where: {
          title: rideData.title,
          hostId: host.id,
        },
      })

      if (existingRide) {
        console.log(`⏭ Skipping duplicate ride: ${rideData.title}`)
        skippedCount++
        continue
      }

      const ride = await prisma.ride.create({
        data: {
          title: rideData.title,
          description: rideData.description,
          startLocation: rideData.startLocation,
          endLocation: rideData.endLocation,
          startLat: rideData.startLat,
          startLng: rideData.startLng,
          endLat: rideData.endLat,
          endLng: rideData.endLng,
          date: rideData.date,
          difficulty: rideData.difficulty,
          maxParticipants: rideData.maxParticipants,
          isAIGenerated: rideData.isAIGenerated,
          hostId: host.id,
          status: 'upcoming',
        },
      })

      // Add random participants
      const numParticipants = Math.floor(Math.random() * (rideData.maxParticipants - 1)) + 1
      const shuffledUsers = [...users].filter(u => u.id !== host.id).sort(() => 0.5 - Math.random())

      for (let i = 0; i < Math.min(numParticipants, shuffledUsers.length); i++) {
        try {
          await prisma.rideParticipant.create({
            data: {
              rideId: ride.id,
              userId: shuffledUsers[i].id,
              status: 'confirmed',
            },
          })
        } catch (error) {
          // Skip if participant already exists
        }
      }

      createdCount++
      console.log(`  ✓ Created: ${rideData.title}`)
    } catch (error: any) {
      console.error(`  ✗ Error creating ride "${rideData.title}":`, error.message)
      skippedCount++
    }
  }

  console.log(`\n✅ Seeding complete!`)
  console.log(`   Created: ${createdCount} rides`)
  console.log(`   Skipped: ${skippedCount} rides`)
}

main()
  .catch((e) => {
    console.error('❌ Error seeding rides:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

