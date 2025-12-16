"use client"

import Link from "next/link"
import { format } from "date-fns"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MapPin, Calendar, Users, TrendingUp } from "lucide-react"

interface RideCardProps {
  ride: {
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
}

export function RideCard({ ride }: RideCardProps) {
  const spotsLeft = ride.maxParticipants - ride.participants.length
  const difficultyColors = {
    easy: "bg-green-100 text-green-800",
    medium: "bg-yellow-100 text-yellow-800",
    hard: "bg-red-100 text-red-800",
  }

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              {ride.isAIGenerated && (
                <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
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
            </div>
            <Link href={`/rides/${ride.id}`}>
              <h3 className="text-lg font-semibold hover:text-primary transition-colors">
                {ride.title}
              </h3>
            </Link>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
          {ride.description}
        </p>
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">From:</span>
            <span>{ride.startLocation}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">To:</span>
            <span>{ride.endLocation}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span>{format(new Date(ride.date), "PPP 'at' p")}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span>
              {ride.participants.length}/{ride.maxParticipants} riders
              {spotsLeft > 0 && ` (${spotsLeft} spots left)`}
            </span>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">
            Hosted by {ride.host.name}
          </span>
          <Link href={`/rides/${ride.id}`}>
            <Button size="sm">View Details</Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}

