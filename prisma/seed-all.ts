import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'
import 'dotenv/config'
import bcrypt from 'bcryptjs'

const pool = new Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

// Extended mock users
const mockUsers = [
  { name: 'Rajesh Kumar', email: 'rajesh@example.com', password: 'password123', bio: 'Bike enthusiast from Bangalore. Love exploring new routes!', location: 'Koramangala', bikeModel: 'Royal Enfield Classic 350', experience: 'advanced' },
  { name: 'Priya Sharma', email: 'priya@example.com', password: 'password123', bio: 'Weekend rider exploring Bangalore on my scooter', location: 'Indiranagar', bikeModel: 'Honda Activa', experience: 'intermediate' },
  { name: 'Arjun Menon', email: 'arjun@example.com', password: 'password123', bio: 'Adventure biker. Always up for long rides!', location: 'Whitefield', bikeModel: 'KTM Duke 390', experience: 'advanced' },
  { name: 'Sneha Reddy', email: 'sneha@example.com', password: 'password123', bio: 'New to biking but loving every ride!', location: 'HSR Layout', bikeModel: 'Yamaha FZ', experience: 'beginner' },
  { name: 'Vikram Singh', email: 'vikram@example.com', password: 'password123', bio: 'Bike mechanic and rider. Know Bangalore roads like the back of my hand.', location: 'Malleshwaram', bikeModel: 'Bajaj Pulsar 220', experience: 'advanced' },
  { name: 'Ananya Patel', email: 'ananya@example.com', password: 'password123', bio: 'Foodie biker. Love combining rides with good food spots!', location: 'JP Nagar', bikeModel: 'TVS Apache', experience: 'intermediate' },
  { name: 'Rohit Nair', email: 'rohit@example.com', password: 'password123', bio: 'Photography + Biking = Perfect combo', location: 'Electronic City', bikeModel: 'Royal Enfield Himalayan', experience: 'intermediate' },
  { name: 'Meera Iyer', email: 'meera@example.com', password: 'password123', bio: 'Early morning rider. Best time to explore the city!', location: 'Basavanagudi', bikeModel: 'Honda CB Shine', experience: 'beginner' },
  { name: 'Karthik Rao', email: 'karthik@example.com', password: 'password123', bio: 'Long distance touring enthusiast', location: 'Marathahalli', bikeModel: 'Royal Enfield Interceptor', experience: 'advanced' },
  { name: 'Divya Menon', email: 'divya@example.com', password: 'password123', bio: 'City commuter and weekend explorer', location: 'BTM Layout', bikeModel: 'Honda Activa', experience: 'intermediate' },
  { name: 'Suresh Kumar', email: 'suresh@example.com', password: 'password123', bio: 'Bike collector and vintage enthusiast', location: 'Rajajinagar', bikeModel: 'Royal Enfield Bullet', experience: 'advanced' },
  { name: 'Lakshmi Nair', email: 'lakshmi@example.com', password: 'password123', bio: 'Safety first! Always wear gear', location: 'Jayanagar', bikeModel: 'Yamaha R15', experience: 'intermediate' },
]

// Extended mock posts
const mockPosts = [
  {
    title: 'Best breakfast spots after early morning rides?',
    content: 'Looking for recommendations for good breakfast places that are open early (before 8 AM) and have parking for bikes. Preferably around the Outer Ring Road area. Any suggestions?',
    communityType: 'questions',
    authorEmail: 'rajesh@example.com',
  },
  {
    title: 'Nandi Hills ride this weekend - anyone interested?',
    content: 'Planning a ride to Nandi Hills this Saturday morning. Starting from Hebbal at 6 AM. Route: Hebbal → Devanahalli → Nandi Hills. Moderate pace, stops for photos. DM if interested!',
    communityType: 'rides',
    authorEmail: 'arjun@example.com',
  },
  {
    title: 'Traffic rules question: Can we ride on the service road?',
    content: 'I see many bikers using the service road on Outer Ring Road. Is this legal? I want to avoid getting fined but also want to avoid heavy traffic. What are the rules?',
    communityType: 'questions',
    authorEmail: 'sneha@example.com',
  },
  {
    title: 'Selling my KTM Duke 390 - 2022 model',
    content: 'Selling my KTM Duke 390, 2022 model, 15k km done. Well maintained, all service records available. Price: ₹2.8L negotiable. Contact for more details.',
    communityType: 'marketplace',
    authorEmail: 'arjun@example.com',
  },
  {
    title: 'Amazing sunset ride to Bannerghatta National Park',
    content: 'Just completed an amazing evening ride to Bannerghatta. The roads are great and the sunset views are spectacular! Highly recommend this route. Took about 2 hours from Koramangala.',
    communityType: 'general',
    authorEmail: 'rajesh@example.com',
  },
  {
    title: 'Looking for riding gear recommendations',
    content: 'New to biking and need advice on good quality but affordable riding gear. Helmet, gloves, and jacket recommendations please. Budget around ₹15k for all.',
    communityType: 'questions',
    authorEmail: 'meera@example.com',
  },
  {
    title: 'Group ride to Mysore - Next Sunday',
    content: 'Organizing a group ride to Mysore next Sunday. Meeting point: Silk Board at 7 AM. We\'ll take the Mysore Road route, stop for breakfast, and return by evening. All skill levels welcome!',
    communityType: 'rides',
    authorEmail: 'vikram@example.com',
  },
  {
    title: 'Best bike service center in Bangalore?',
    content: 'Looking for recommendations for a reliable and reasonably priced service center. My Royal Enfield needs servicing. Preferably around Indiranagar/Koramangala area.',
    communityType: 'questions',
    authorEmail: 'priya@example.com',
  },
  {
    title: 'Riding tips for Bangalore traffic',
    content: 'As someone who\'s been riding in Bangalore for 5+ years, here are my top tips: 1) Always wear helmet (obviously), 2) Use indicators religiously, 3) Keep distance from buses and trucks, 4) Watch out for potholes during monsoon, 5) Use Google Maps but trust your instincts too. Stay safe!',
    communityType: 'general',
    authorEmail: 'vikram@example.com',
  },
  {
    title: 'Monsoon riding safety - share your experiences',
    content: 'Monsoon is here! How do you all handle riding in heavy rain? Any specific gear or techniques? I\'m a bit nervous about riding in the rain. Would love to hear your experiences and tips.',
    communityType: 'questions',
    authorEmail: 'sneha@example.com',
  },
  {
    title: 'Weekend ride to Chikmagalur - anyone joining?',
    content: 'Planning a 2-day trip to Chikmagalur this weekend. Leaving Saturday morning, returning Sunday evening. Route: Bangalore → Hassan → Chikmagalur. Looking for 2-3 more riders to join. Accommodation will be shared.',
    communityType: 'rides',
    authorEmail: 'arjun@example.com',
  },
  {
    title: 'Best time to ride in Bangalore?',
    content: 'When do you all prefer to ride? I find early mornings (6-8 AM) are the best - less traffic, cool weather, and great views. What\'s your favorite time?',
    communityType: 'general',
    authorEmail: 'meera@example.com',
  },
  {
    title: 'Looking to buy a second-hand Royal Enfield',
    content: 'Looking for a second-hand Royal Enfield Classic or Bullet. Budget: ₹1.5-2L. Prefer models from 2018-2020. If anyone is selling or knows someone, please reach out!',
    communityType: 'marketplace',
    authorEmail: 'rohit@example.com',
  },
  {
    title: 'Coffee and bikes meetup this Saturday',
    content: 'Organizing a casual meetup this Saturday at 9 AM at Third Wave Coffee, Koramangala. Just come, chat about bikes, share experiences, and enjoy good coffee. All welcome!',
    communityType: 'general',
    authorEmail: 'ananya@example.com',
  },
  {
    title: 'Pothole alert: Outer Ring Road near Marathahalli',
    content: 'Heads up riders! There are some really bad potholes on Outer Ring Road near Marathahalli bridge. Be careful, especially during evening hours when visibility is low. Ride safe!',
    communityType: 'general',
    authorEmail: 'priya@example.com',
  },
  {
    title: 'Best routes for beginners in Bangalore?',
    content: 'New rider here! Looking for easy, less traffic routes to practice. Any suggestions for good practice routes? Preferably in South Bangalore area.',
    communityType: 'questions',
    authorEmail: 'sneha@example.com',
  },
  {
    title: 'Selling bike accessories - helmet, gloves, saddle bags',
    content: 'Selling: 1) Vega helmet (size M, used 6 months), 2) Rynox gloves, 3) Saddle bags for Royal Enfield. All in good condition. Selling because upgrading. DM for prices.',
    communityType: 'marketplace',
    authorEmail: 'rajesh@example.com',
  },
  {
    title: 'Night ride safety tips',
    content: 'Planning to do some night rides. What are the essential safety tips? I\'ve heard visibility is a major concern. What lights/reflectors do you recommend?',
    communityType: 'questions',
    authorEmail: 'rohit@example.com',
  },
  {
    title: 'Ride to Coorg - amazing experience!',
    content: 'Just got back from a weekend ride to Coorg. The roads are fantastic, the scenery is breathtaking, and the weather was perfect. If you haven\'t done this route, highly recommend it! Route details in comments.',
    communityType: 'general',
    authorEmail: 'arjun@example.com',
  },
  {
    title: 'Looking for riding buddies in Whitefield area',
    content: 'New to Whitefield and looking for people to ride with on weekends. I usually do short rides around the area. Anyone interested in joining?',
    communityType: 'general',
    authorEmail: 'ananya@example.com',
  },
  {
    title: 'Hosur route - best time to avoid traffic?',
    content: 'Planning to ride to Hosur this weekend. What\'s the best time to avoid heavy traffic? Early morning or late evening?',
    communityType: 'questions',
    authorEmail: 'karthik@example.com',
  },
  {
    title: 'Buying my first bike - need advice',
    content: 'Looking to buy my first bike. Budget is ₹2L. Considering Royal Enfield Classic 350 or KTM Duke 200. Which one would you recommend for a beginner?',
    communityType: 'questions',
    authorEmail: 'divya@example.com',
  },
  {
    title: 'Weekend ride to Ooty - 3 days trip',
    content: 'Planning a 3-day ride to Ooty. Route: Bangalore → Mysore → Ooty → Coonoor → Bangalore. Looking for 2-3 more riders. Dates: Next Friday to Sunday.',
    communityType: 'rides',
    authorEmail: 'karthik@example.com',
  },
]

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

// Mock comments
const mockComments = [
  { content: 'Great post! I totally agree with your points.', authorEmail: 'priya@example.com' },
  { content: 'Thanks for sharing this. Very helpful!', authorEmail: 'sneha@example.com' },
  { content: 'I\'ve been looking for this information. Thanks!', authorEmail: 'vikram@example.com' },
  { content: 'Count me in! Sounds like a great ride.', authorEmail: 'rohit@example.com' },
  { content: 'I\'m interested. What time are we meeting?', authorEmail: 'meera@example.com' },
  { content: 'This is exactly what I needed to know. Thanks!', authorEmail: 'ananya@example.com' },
  { content: 'I\'ll be there! Looking forward to it.', authorEmail: 'karthik@example.com' },
  { content: 'Great tips! I\'ll keep these in mind.', authorEmail: 'divya@example.com' },
  { content: 'Can beginners join this ride?', authorEmail: 'sneha@example.com' },
  { content: 'What\'s the estimated duration?', authorEmail: 'priya@example.com' },
]

// Mock chat messages
const mockChatMessages = [
  'Hey! Are you joining the ride this weekend?',
  'Yes, I\'m in! What time are we meeting?',
  'Let\'s meet at 6 AM at the starting point.',
  'Perfect! See you there.',
  'Don\'t forget to bring your helmet and water bottle.',
  'Got it! Thanks for the reminder.',
  'Anyone else joining from Koramangala?',
  'I am! We can ride together.',
  'Great! Let\'s coordinate.',
  'Looking forward to the ride!',
]

async function main() {
  console.log('🌱 Starting comprehensive seeding...\n')

  // Create or get users
  console.log('👥 Creating users...')
  const users = []
  for (const userData of mockUsers) {
    const hashedPassword = await bcrypt.hash(userData.password, 10)
    
    const user = await prisma.user.upsert({
      where: { email: userData.email },
      update: {},
      create: {
        ...userData,
        password: hashedPassword,
        reputation: Math.floor(Math.random() * 100),
      },
    })
    
    users.push(user)
    console.log(`  ✓ ${user.name}`)
  }
  console.log(`✅ Created ${users.length} users\n`)

  // Create posts
  console.log('📝 Creating posts...')
  const posts = []
  for (const postData of mockPosts) {
    const author = users.find(u => u.email === postData.authorEmail)
    if (!author) continue

    const post = await prisma.post.create({
      data: {
        title: postData.title,
        content: postData.content,
        communityType: postData.communityType,
        authorId: author.id,
        upvotes: Math.floor(Math.random() * 30),
        downvotes: Math.floor(Math.random() * 5),
        createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000), // Random date in last 30 days
      },
    })
    
    posts.push(post)
  }
  console.log(`✅ Created ${posts.length} posts\n`)

  // Create comments on random posts
  console.log('💬 Creating comments...')
  let commentCount = 0
  for (let i = 0; i < posts.length; i++) {
    const post = posts[i]
    const numComments = Math.floor(Math.random() * 5) + 1 // 1-5 comments per post
    
    for (let j = 0; j < numComments; j++) {
      const randomUser = users[Math.floor(Math.random() * users.length)]
      const randomComment = mockComments[Math.floor(Math.random() * mockComments.length)]
      
      await prisma.comment.create({
        data: {
          content: randomComment.content,
          postId: post.id,
          authorId: randomUser.id,
          createdAt: new Date(post.createdAt.getTime() + Math.random() * 7 * 24 * 60 * 60 * 1000),
        },
      })
      commentCount++
    }
  }
  console.log(`✅ Created ${commentCount} comments\n`)

  // Create rides
  console.log('🚴 Creating rides...')
  const rides = []
  for (const rideData of mockRides) {
    const host = users.find(u => u.email === rideData.hostEmail)
    if (!host) continue

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
    
    rides.push(ride)
    
    // Add random participants
    const numParticipants = Math.floor(Math.random() * (rideData.maxParticipants - 1)) + 1
    const shuffledUsers = [...users].filter(u => u.id !== host.id).sort(() => 0.5 - Math.random())
    
    for (let i = 0; i < Math.min(numParticipants, shuffledUsers.length); i++) {
      await prisma.rideParticipant.create({
        data: {
          rideId: ride.id,
          userId: shuffledUsers[i].id,
          status: 'confirmed',
        },
      })
    }
  }
  console.log(`✅ Created ${rides.length} rides with participants\n`)

  // Create conversations and messages
  console.log('💬 Creating conversations and messages...')
  let conversationCount = 0
  let messageCount = 0
  
  // Create some 1-on-1 conversations
  for (let i = 0; i < Math.min(10, users.length - 1); i++) {
    const user1 = users[i]
    const user2 = users[(i + 1) % users.length]
    
    const conversation = await prisma.conversation.create({
      data: {
        isGroup: false,
      },
    })
    
    await prisma.conversationParticipant.createMany({
      data: [
        { conversationId: conversation.id, userId: user1.id },
        { conversationId: conversation.id, userId: user2.id },
      ],
    })
    
    // Add some messages
    const numMessages = Math.floor(Math.random() * 10) + 3
    for (let j = 0; j < numMessages; j++) {
      const sender = j % 2 === 0 ? user1 : user2
      const message = mockChatMessages[Math.floor(Math.random() * mockChatMessages.length)]
      
      await prisma.message.create({
        data: {
          conversationId: conversation.id,
          senderId: sender.id,
          content: message,
          timestamp: new Date(Date.now() - (numMessages - j) * 60 * 60 * 1000),
        },
      })
      messageCount++
    }
    
    conversationCount++
  }
  
  // Create a group conversation
  const groupConversation = await prisma.conversation.create({
    data: {
      isGroup: true,
      name: 'BLR Riders Group',
    },
  })
  
  const groupParticipants = users.slice(0, 6)
  await prisma.conversationParticipant.createMany({
    data: groupParticipants.map(user => ({
      conversationId: groupConversation.id,
      userId: user.id,
    })),
  })
  
  // Add messages to group
  for (let i = 0; i < 15; i++) {
    const sender = groupParticipants[Math.floor(Math.random() * groupParticipants.length)]
    const message = mockChatMessages[Math.floor(Math.random() * mockChatMessages.length)]
    
    await prisma.message.create({
      data: {
        conversationId: groupConversation.id,
        senderId: sender.id,
        content: message,
        timestamp: new Date(Date.now() - (15 - i) * 30 * 60 * 1000),
      },
    })
    messageCount++
  }
  conversationCount++
  
  console.log(`✅ Created ${conversationCount} conversations with ${messageCount} messages\n`)

  // Create votes
  console.log('👍 Creating votes...')
  let voteCount = 0
  for (const post of posts) {
    const numVoters = Math.floor(Math.random() * users.length)
    const shuffledUsers = [...users].sort(() => 0.5 - Math.random()).slice(0, numVoters)
    
    for (const user of shuffledUsers) {
      const voteType = Math.random() > 0.1 ? 'upvote' : 'downvote' // 90% upvotes
      await prisma.vote.create({
        data: {
          userId: user.id,
          postId: post.id,
          type: voteType,
        },
      })
      voteCount++
    }
  }
  console.log(`✅ Created ${voteCount} votes\n`)

  // Create follows
  console.log('👥 Creating follows...')
  let followCount = 0
  for (let i = 0; i < users.length; i++) {
    const follower = users[i]
    const numFollowing = Math.floor(Math.random() * 5) + 1
    const shuffledUsers = [...users].filter(u => u.id !== follower.id).sort(() => 0.5 - Math.random()).slice(0, numFollowing)
    
    for (const following of shuffledUsers) {
      await prisma.follow.create({
        data: {
          followerId: follower.id,
          followingId: following.id,
        },
      })
      followCount++
    }
  }
  console.log(`✅ Created ${followCount} follows\n`)

  // Create bookmarks
  console.log('🔖 Creating bookmarks...')
  let bookmarkCount = 0
  for (const user of users) {
    const numBookmarks = Math.floor(Math.random() * 5)
    const shuffledPosts = [...posts].sort(() => 0.5 - Math.random()).slice(0, numBookmarks)
    
    for (const post of shuffledPosts) {
      await prisma.bookmark.create({
        data: {
          userId: user.id,
          postId: post.id,
        },
      })
      bookmarkCount++
    }
  }
  console.log(`✅ Created ${bookmarkCount} bookmarks\n`)

  // Create notifications
  console.log('🔔 Creating notifications...')
  let notificationCount = 0
  for (const user of users) {
    const numNotifications = Math.floor(Math.random() * 5) + 2
    const types = ['ride_invite', 'comment', 'mention', 'ride_reminder']
    
    for (let i = 0; i < numNotifications; i++) {
      const type = types[Math.floor(Math.random() * types.length)]
      const contents = {
        ride_invite: 'You\'ve been invited to join a ride!',
        comment: 'Someone commented on your post',
        mention: 'You were mentioned in a post',
        ride_reminder: 'Your ride is starting soon!',
      }
      
      await prisma.notification.create({
        data: {
          userId: user.id,
          type: type,
          content: contents[type as keyof typeof contents],
          read: Math.random() > 0.5,
          link: '/rides/1',
          createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
        },
      })
      notificationCount++
    }
  }
  console.log(`✅ Created ${notificationCount} notifications\n`)

  console.log('🎉 Seeding completed successfully!')
  console.log(`\nSummary:`)
  console.log(`  👥 Users: ${users.length}`)
  console.log(`  📝 Posts: ${posts.length}`)
  console.log(`  💬 Comments: ${commentCount}`)
  console.log(`  🚴 Rides: ${rides.length}`)
  console.log(`  💬 Conversations: ${conversationCount}`)
  console.log(`  💬 Messages: ${messageCount}`)
  console.log(`  👍 Votes: ${voteCount}`)
  console.log(`  👥 Follows: ${followCount}`)
  console.log(`  🔖 Bookmarks: ${bookmarkCount}`)
  console.log(`  🔔 Notifications: ${notificationCount}`)
}

main()
  .catch((e) => {
    console.error('❌ Error seeding:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

