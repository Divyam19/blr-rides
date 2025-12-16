"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { format } from "date-fns"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MapPin, Calendar, Users, Trash2, User } from "lucide-react"

interface Ride {
  id: string
  title: string
  description: string
  host: {
    id: string
    name: string
    avatar: string | null
    reputation: number
  }
  startLocation: string
  endLocation: string
  date: Date
  difficulty: string
  maxParticipants: number
  status: string
  isAIGenerated: boolean
  participants: {
    id: string
    user: {
      id: string
      name: string
      avatar: string | null
    }
    status: string
  }[]
}

export default function RideDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [ride, setRide] = useState<Ride | null>(null)
  const [loading, setLoading] = useState(true)
  const [isJoining, setIsJoining] = useState(false)
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)

  useEffect(() => {
    fetchRide()
    fetchCurrentUser()
  }, [params.id])

  const fetchCurrentUser = async () => {
    try {
      const response = await fetch("/api/auth/session")
      const data = await response.json()
      if (data.user) {
        setCurrentUserId(data.user.id)
      }
    } catch (error) {
      console.error("Error fetching user:", error)
    }
  }

  const fetchRide = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/rides/${params.id}`)
      const data = await response.json()
      if (data.ride) {
        setRide(data.ride)
      }
    } catch (error) {
      console.error("Error fetching ride:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleJoin = async () => {
    setIsJoining(true)
    try {
      const response = await fetch(`/api/rides/${params.id}/join`, {
        method: "POST",
      })

      if (response.ok) {
        fetchRide()
      } else {
        const data = await response.json()
        alert(data.error || "Failed to join ride")
      }
    } catch (error) {
      console.error("Error joining ride:", error)
      alert("Something went wrong")
    } finally {
      setIsJoining(false)
    }
  }

  const handleLeave = async () => {
    if (!confirm("Are you sure you want to leave this ride?")) return

    setIsJoining(true)
    try {
      const response = await fetch(`/api/rides/${params.id}/join`, {
        method: "DELETE",
      })

      if (response.ok) {
        fetchRide()
      }
    } catch (error) {
      console.error("Error leaving ride:", error)
    } finally {
      setIsJoining(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this ride?")) return

    try {
      const response = await fetch(`/api/rides/${params.id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        router.push("/rides")
      }
    } catch (error) {
      console.error("Error deleting ride:", error)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Card className="animate-pulse">
          <CardContent className="p-6">
            <div className="h-8 bg-muted rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-muted rounded w-full mb-2"></div>
            <div className="h-4 bg-muted rounded w-5/6"></div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!ride) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-muted-foreground">Ride not found</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const confirmedParticipants = ride.participants.filter((p) => p.status === "confirmed")
  const spotsLeft = ride.maxParticipants - confirmedParticipants.length
  const isHost = currentUserId === ride.host.id
  const isParticipant = confirmedParticipants.some((p) => p.user.id === currentUserId)
  const difficultyColors = {
    easy: "bg-green-100 text-green-800",
    medium: "bg-yellow-100 text-yellow-800",
    hard: "bg-red-100 text-red-800",
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                {ride.isAIGenerated && (
                  <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">
                    AI Suggested
                  </span>
                )}
                <span
                  className={`text-xs px-2 py-1 rounded-full ${
                    difficultyColors[ride.difficulty as keyof typeof difficultyColors] || "bg-gray-100 text-gray-800"
                  }`}
                >
                  {ride.difficulty}
                </span>
                <span className="text-xs px-2 py-1 rounded-full bg-secondary text-secondary-foreground">
                  {ride.status}
                </span>
              </div>
              <h1 className="text-3xl font-bold mb-2">{ride.title}</h1>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>Hosted by {ride.host.name}</span>
                <span>•</span>
                <span>{ride.host.reputation} reputation</span>
              </div>
            </div>
            {isHost && (
              <Button variant="destructive" size="sm" onClick={handleDelete}>
                <Trash2 className="h-4 w-4 mr-1" />
                Delete
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="prose max-w-none mb-6">
            <p className="whitespace-pre-wrap">{ride.description}</p>
          </div>

          <div className="space-y-3 mb-6">
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-muted-foreground" />
              <div>
                <span className="text-sm text-muted-foreground">Start: </span>
                <span className="font-medium">{ride.startLocation}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-muted-foreground" />
              <div>
                <span className="text-sm text-muted-foreground">End: </span>
                <span className="font-medium">{ride.endLocation}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <span>{format(new Date(ride.date), "PPP 'at' p")}</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-muted-foreground" />
              <span>
                {confirmedParticipants.length}/{ride.maxParticipants} riders
                {spotsLeft > 0 && ` (${spotsLeft} spots left)`}
              </span>
            </div>
          </div>

          {ride.status === "upcoming" && !isHost && (
            <div className="mb-6">
              {isParticipant ? (
                <Button variant="outline" onClick={handleLeave} disabled={isJoining}>
                  Leave Ride
                </Button>
              ) : (
                <Button onClick={handleJoin} disabled={isJoining || spotsLeft === 0}>
                  {isJoining ? "Joining..." : spotsLeft === 0 ? "Ride Full" : "Join Ride"}
                </Button>
              )}
            </div>
          )}

          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold mb-4">Participants</h3>
            {confirmedParticipants.length === 0 ? (
              <p className="text-muted-foreground">No participants yet</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {confirmedParticipants.map((participant) => (
                  <div
                    key={participant.id}
                    className="flex items-center gap-3 p-3 rounded-lg border"
                  >
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{participant.user.name}</p>
                      {participant.user.id === ride.host.id && (
                        <p className="text-xs text-muted-foreground">Host</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

