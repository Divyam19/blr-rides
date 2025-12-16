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
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
          Welcome to BLR Riders
        </h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Connect with fellow riders, discover amazing routes, and join exciting bike rides across Bangalore
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Link href="/rides">
            <Button size="lg">
              <Bike className="h-5 w-5 mr-2" />
              Browse Rides
            </Button>
          </Link>
          <Link href="/feed">
            <Button size="lg" variant="outline">
              <MessageSquare className="h-5 w-5 mr-2" />
              View Community
            </Button>
          </Link>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid md:grid-cols-3 gap-6 mb-12">
        <Card>
          <CardHeader>
            <MessageSquare className="h-8 w-8 text-primary mb-2" />
            <CardTitle>Community Feed</CardTitle>
            <CardDescription>
              Share experiences, ask questions, and connect with other riders
            </CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <Bike className="h-8 w-8 text-primary mb-2" />
            <CardTitle>Host & Join Rides</CardTitle>
            <CardDescription>
              Create your own rides or join others for amazing biking adventures
            </CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <Bot className="h-8 w-8 text-primary mb-2" />
            <CardTitle>AI Assistant</CardTitle>
            <CardDescription>
              Get instant answers about traffic rules, safety, and best practices
            </CardDescription>
          </CardHeader>
        </Card>
      </div>

      {/* Recent Posts */}
      <div className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Recent Community Posts</h2>
          <Link href="/feed">
            <Button variant="ghost" size="sm">
              View All
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </Link>
        </div>
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="h-4 bg-muted rounded w-3/4 mb-4"></div>
                  <div className="h-4 bg-muted rounded w-full mb-2"></div>
                  <div className="h-4 bg-muted rounded w-5/6"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : recentPosts.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <p className="text-muted-foreground mb-4">No posts yet</p>
              <Link href="/post/create">
                <Button>Create First Post</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {recentPosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </div>

      {/* Upcoming Rides */}
      <div className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Upcoming Rides</h2>
          <div className="flex gap-2">
            <Link href="/rides/recommended">
              <Button variant="ghost" size="sm">
                <Sparkles className="h-4 w-4 mr-2" />
                Recommended
              </Button>
            </Link>
            <Link href="/rides">
              <Button variant="ghost" size="sm">
                View All
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="h-4 bg-muted rounded w-3/4 mb-4"></div>
                  <div className="h-4 bg-muted rounded w-full mb-2"></div>
                  <div className="h-4 bg-muted rounded w-5/6"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : upcomingRides.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <p className="text-muted-foreground mb-4">No upcoming rides</p>
              <Link href="/rides/create">
                <Button>Host First Ride</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {upcomingRides.map((ride) => (
              <RideCard key={ride.id} ride={ride} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

