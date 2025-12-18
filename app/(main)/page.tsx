"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PostCard } from "@/components/PostCard"
import { RideCard } from "@/components/RideCard"
import { ArrowRight, Sparkles, MessageSquare, Bike, Bot } from "lucide-react"

interface Post {
  id: string
  title: string
  content: string
  author: {
    id: string
    name: string
    avatar: string | null
  }
  upvotes: number
  downvotes: number
  communityType: string
  createdAt: Date
  _count: {
    comments: number
  }
}

interface Ride {
  id: string
  title: string
  description: string
  host: {
    id: string
    name: string
    avatar: string | null
  }
  startLocation: string
  endLocation: string
  date: Date
  difficulty: string
  maxParticipants: number
  participants: { id: string }[]
  isAIGenerated: boolean
}

export default function HomePage() {
  const [recentPosts, setRecentPosts] = useState<Post[]>([])
  const [upcomingRides, setUpcomingRides] = useState<Ride[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchHomeData()
  }, [])

  const fetchHomeData = async () => {
    setLoading(true)
    try {
      const [postsRes, ridesRes] = await Promise.all([
        fetch("/api/posts?limit=3").catch(() => ({ ok: false, json: () => ({ posts: [] }) })),
        fetch("/api/rides?limit=3").catch(() => ({ ok: false, json: () => ({ rides: [] }) })),
      ])

      const postsData = postsRes.ok ? await postsRes.json() : { posts: [] }
      const ridesData = ridesRes.ok ? await ridesRes.json() : { rides: [] }

      setRecentPosts(postsData.posts || [])
      setUpcomingRides(ridesData.rides || [])
    } catch (error) {
      console.error("Error fetching home data:", error)
      // Set empty arrays on error so page still renders
      setRecentPosts([])
      setUpcomingRides([])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16 relative fade-in">
          <div className="mb-8 flex justify-center">
            <div className="relative w-full max-w-3xl h-64 md:h-80 rounded-2xl overflow-hidden shadow-2xl border border-border/50 group">
              <img 
                src="https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=800&q=80" 
                alt="Bikers on road"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/20 to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h1 className="text-4xl md:text-6xl font-bold mb-3 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                  Welcome to BLR Riders
                </h1>
                <p className="text-lg md:text-xl text-foreground/90 max-w-2xl mx-auto font-medium">
                  Connect with fellow riders, discover amazing routes, and join exciting bike rides across Bangalore
                </p>
              </div>
            </div>
          </div>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/rides">
              <Button size="lg" className="btn-modern shadow-lg bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600">
                <Bike className="h-5 w-5 mr-2" />
                Browse Rides
              </Button>
            </Link>
            <Link href="/feed">
              <Button size="lg" variant="outline" className="btn-modern border-2">
                <MessageSquare className="h-5 w-5 mr-2" />
                View Community
              </Button>
            </Link>
          </div>
        </div>

      {/* Features Grid */}
      <div className="grid md:grid-cols-3 gap-6 mb-16">
        <Card className="card-modern stagger-item hover:scale-105 transition-transform">
          <CardHeader>
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center mb-4">
              <MessageSquare className="h-6 w-6 text-white" />
            </div>
            <CardTitle className="text-xl mb-2">Community Feed</CardTitle>
            <CardDescription className="text-base">
              Share experiences, ask questions, and connect with other riders
            </CardDescription>
          </CardHeader>
        </Card>
        <Card className="card-modern stagger-item hover:scale-105 transition-transform">
          <CardHeader>
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center mb-4">
              <Bike className="h-6 w-6 text-white" />
            </div>
            <CardTitle className="text-xl mb-2">Host & Join Rides</CardTitle>
            <CardDescription className="text-base">
              Create your own rides or join others for amazing biking adventures
            </CardDescription>
          </CardHeader>
        </Card>
        <Card className="card-modern stagger-item hover:scale-105 transition-transform">
          <CardHeader>
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mb-4">
              <Bot className="h-6 w-6 text-white" />
            </div>
            <CardTitle className="text-xl mb-2">AI Assistant</CardTitle>
            <CardDescription className="text-base">
              Get instant answers about traffic rules, safety, and best practices
            </CardDescription>
          </CardHeader>
        </Card>
      </div>

      {/* Recent Posts */}
      <div className="mb-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold mb-2">Recent Community Posts</h2>
            <p className="text-muted-foreground">Latest discussions from the community</p>
          </div>
          <Link href="/feed">
            <Button variant="outline" size="lg" className="btn-modern">
              View All
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </Link>
        </div>
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="card-modern">
                <CardContent className="p-6">
                  <div className="skeleton h-6 rounded w-3/4 mb-4"></div>
                  <div className="skeleton h-4 rounded w-full mb-2"></div>
                  <div className="skeleton h-4 rounded w-5/6"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : recentPosts.length === 0 ? (
          <Card className="card-modern">
            <CardContent className="empty-state">
              <MessageSquare className="empty-state-icon" />
              <h3 className="text-xl font-semibold mb-2">No posts yet</h3>
              <p className="text-muted-foreground mb-6">Be the first to share something!</p>
              <Link href="/post/create">
                <Button size="lg" className="btn-modern">Create First Post</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {recentPosts.map((post, index) => (
              <div key={post.id} className="stagger-item">
                <PostCard post={post} />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Upcoming Rides */}
      <div className="mb-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold mb-2">Upcoming Rides</h2>
            <p className="text-muted-foreground">Join exciting biking adventures</p>
          </div>
          <div className="flex gap-2">
            <Link href="/rides/recommended">
              <Button variant="outline" size="lg" className="btn-modern">
                <Sparkles className="h-4 w-4 mr-2" />
                Recommended
              </Button>
            </Link>
            <Link href="/rides">
              <Button variant="outline" size="lg" className="btn-modern">
                View All
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="card-modern">
                <CardContent className="p-6">
                  <div className="skeleton h-6 rounded w-3/4 mb-4"></div>
                  <div className="skeleton h-4 rounded w-full mb-2"></div>
                  <div className="skeleton h-4 rounded w-5/6"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : upcomingRides.length === 0 ? (
          <Card className="card-modern">
            <CardContent className="empty-state">
              <Bike className="empty-state-icon" />
              <h3 className="text-xl font-semibold mb-2">No upcoming rides</h3>
              <p className="text-muted-foreground mb-6">Host the first ride and start an adventure!</p>
              <Link href="/rides/create">
                <Button size="lg" className="btn-modern bg-gradient-to-r from-green-500 to-emerald-500">Host First Ride</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingRides.map((ride, index) => (
              <div key={ride.id} className="stagger-item">
                <RideCard ride={ride} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

