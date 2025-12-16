"use client"

import { useEffect, useState } from "react"
import { RideCard } from "@/components/RideCard"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft, Sparkles } from "lucide-react"

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

export default function RecommendedRidesPage() {
  const [rides, setRides] = useState<Ride[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchRecommendations()
  }, [])

  const fetchRecommendations = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/ai/recommendations")
      const data = await response.json()
      setRides(data.recommendations || [])
    } catch (error) {
      console.error("Error fetching recommendations:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/rides">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </Link>
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          <h1 className="text-3xl font-bold">Recommended Rides for You</h1>
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
      ) : rides.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Sparkles className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
            <p className="text-muted-foreground mb-4">
              No personalized recommendations yet
            </p>
            <p className="text-sm text-muted-foreground mb-4">
              Join some rides to get personalized recommendations based on your preferences!
            </p>
            <Link href="/rides">
              <Button>Browse All Rides</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <>
          <p className="text-muted-foreground mb-6">
            Based on your riding history and preferences, here are rides we think you'll enjoy:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {rides.map((ride) => (
              <RideCard key={ride.id} ride={ride} />
            ))}
          </div>
        </>
      )}
    </div>
  )
}

