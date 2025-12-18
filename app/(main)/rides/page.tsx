"use client"

import { useEffect, useState } from "react"
import { RideCard } from "@/components/RideCard"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { Plus, Search, Bike, MapPin, Filter } from "lucide-react"

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
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                <Bike className="h-7 w-7 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold">Upcoming Rides</h1>
                <p className="text-muted-foreground mt-1">Discover and join amazing biking adventures</p>
              </div>
            </div>
            <Link href="/rides/create">
              <Button size="lg" className="btn-modern bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600">
                <Plus className="h-5 w-5 mr-2" />
                Host a Ride
              </Button>
            </Link>
          </div>

          {/* Search and Filters */}
          <div className="flex gap-4 flex-wrap items-end">
            <div className="flex gap-2 flex-1 min-w-[250px] form-field-modern">
              <div className="relative flex-1">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by location..."
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  className="pl-10 h-11"
                />
              </div>
              <Button onClick={handleSearch} size="lg" className="px-6">
                <Search className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <div className="flex gap-2">
                {difficulties.map((diff, index) => (
                  <Button
                    key={diff.value || "all"}
                    variant={difficulty === diff.value ? "default" : "outline"}
                    size="sm"
                    onClick={() => setDifficulty(diff.value)}
                    className={`badge-modern transition-all ${
                      difficulty === diff.value
                        ? "bg-gradient-to-r from-primary to-accent text-white border-0 shadow-md scale-105"
                        : "hover:scale-105"
                    }`}
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    {diff.label}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="card-modern">
                <CardContent className="p-6">
                  <div className="skeleton h-6 rounded w-3/4 mb-4"></div>
                  <div className="skeleton h-4 rounded w-full mb-2"></div>
                  <div className="skeleton h-4 rounded w-5/6"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : rides.length === 0 ? (
          <Card className="card-modern">
            <CardContent className="empty-state">
              <div className="empty-state-icon">
                <Bike className="h-full w-full" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No rides found</h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                {searchLocation || difficulty
                  ? "Try adjusting your filters or search terms to find more rides."
                  : "Be the first to host a ride! Create an amazing biking adventure for the community."}
              </p>
              <Link href="/rides/create">
                <Button size="lg" className="btn-modern bg-gradient-to-r from-green-500 to-emerald-500">
                  <Plus className="h-5 w-5 mr-2" />
                  Host First Ride
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rides.map((ride, index) => (
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

