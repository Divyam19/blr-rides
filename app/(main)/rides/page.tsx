"use client"

import { useEffect, useState } from "react"
import { RideCard } from "@/components/RideCard"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { Plus, Search } from "lucide-react"

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

export default function RidesPage() {
  const [rides, setRides] = useState<Ride[]>([])
  const [loading, setLoading] = useState(true)
  const [difficulty, setDifficulty] = useState<string | null>(null)
  const [location, setLocation] = useState("")
  const [searchLocation, setSearchLocation] = useState("")

  useEffect(() => {
    fetchRides()
  }, [difficulty])

  const fetchRides = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (difficulty) params.append("difficulty", difficulty)
      if (searchLocation) params.append("location", searchLocation)
      
      const url = `/api/rides?${params.toString()}`
      const response = await fetch(url)
      const data = await response.json()
      setRides(data.rides || [])
    } catch (error) {
      console.error("Error fetching rides:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = () => {
    setSearchLocation(location)
    fetchRides()
  }

  const difficulties = [
    { value: null, label: "All" },
    { value: "easy", label: "Easy" },
    { value: "medium", label: "Medium" },
    { value: "hard", label: "Hard" },
  ]

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Upcoming Rides</h1>
        <Link href="/rides/create">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Host a Ride
          </Button>
        </Link>
      </div>

      <div className="flex gap-4 mb-6 flex-wrap">
        <div className="flex gap-2 flex-1 min-w-[200px]">
          <Input
            placeholder="Search by location..."
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
          <Button onClick={handleSearch}>
            <Search className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex gap-2">
          {difficulties.map((diff) => (
            <Button
              key={diff.value || "all"}
              variant={difficulty === diff.value ? "default" : "outline"}
              size="sm"
              onClick={() => setDifficulty(diff.value)}
            >
              {diff.label}
            </Button>
          ))}
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
            <p className="text-muted-foreground mb-4">No rides found</p>
            <Link href="/rides/create">
              <Button>Host the first ride</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {rides.map((ride) => (
            <RideCard key={ride.id} ride={ride} />
          ))}
        </div>
      )}
    </div>
  )
}

