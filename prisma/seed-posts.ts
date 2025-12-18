import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'
import 'dotenv/config'
import bcrypt from 'bcryptjs'

const pool = new Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

const mockUsers = [
  { name: 'Rajesh Kumar', email: 'rajesh@example.com', password: 'password123', bio: 'Bike enthusiast from Bangalore. Love exploring new routes!', location: 'Koramangala', bikeModel: 'Royal Enfield Classic 350', experience: 'advanced' },
  { name: 'Priya Sharma', email: 'priya@example.com', password: 'password123', bio: 'Weekend rider exploring Bangalore on my scooter', location: 'Indiranagar', bikeModel: 'Honda Activa', experience: 'intermediate' },
  { name: 'Arjun Menon', email: 'arjun@example.com', password: 'password123', bio: 'Adventure biker. Always up for long rides!', location: 'Whitefield', bikeModel: 'KTM Duke 390', experience: 'advanced' },
  { name: 'Sneha Reddy', email: 'sneha@example.com', password: 'password123', bio: 'New to biking but loving every ride!', location: 'HSR Layout', bikeModel: 'Yamaha FZ', experience: 'beginner' },
  { name: 'Vikram Singh', email: 'vikram@example.com', password: 'password123', bio: 'Bike mechanic and rider. Know Bangalore roads like the back of my hand.', location: 'Malleshwaram', bikeModel: 'Bajaj Pulsar 220', experience: 'advanced' },
  { name: 'Ananya Patel', email: 'ananya@example.com', password: 'password123', bio: 'Foodie biker. Love combining rides with good food spots!', location: 'JP Nagar', bikeModel: 'TVS Apache', experience: 'intermediate' },
  { name: 'Rohit Nair', email: 'rohit@example.com', password: 'password123', bio: 'Photography + Biking = Perfect combo', location: 'Electronic City', bikeModel: 'Royal Enfield Himalayan', experience: 'intermediate' },
  { name: 'Meera Iyer', email: 'meera@example.com', password: 'password123', bio: 'Early morning rider. Best time to explore the city!', location: 'Basavanagudi', bikeModel: 'Honda CB Shine', experience: 'beginner' },
]

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
]

async function main() {
  console.log('🌱 Seeding mock users and posts...')

  // Create or get users
  const users = []
  for (const userData of mockUsers) {
    const hashedPassword = await bcrypt.hash(userData.password, 10)
    
    const user = await prisma.user.upsert({
      where: { email: userData.email },
      update: {},
      create: {
        ...userData,
        password: hashedPassword,
      },
    })
    
    users.push(user)
    console.log(`✓ User: ${user.name}`)
  }

  // Create posts
  let postCount = 0
  for (const postData of mockPosts) {
    const author = users.find(u => u.email === postData.authorEmail)
    if (!author) {
      console.warn(`⚠ Author not found for email: ${postData.authorEmail}`)
      continue
    }

    await prisma.post.create({
      data: {
        title: postData.title,
        content: postData.content,
        communityType: postData.communityType,
        authorId: author.id,
        upvotes: Math.floor(Math.random() * 20), // Random upvotes 0-19
        downvotes: Math.floor(Math.random() * 5), // Random downvotes 0-4
      },
    })
    
    postCount++
    console.log(`✓ Post ${postCount}: ${postData.title.substring(0, 50)}...`)
  }

  console.log(`\n✅ Successfully seeded ${users.length} users and ${postCount} posts!`)
}

main()
  .catch((e) => {
    console.error('❌ Error seeding:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })


