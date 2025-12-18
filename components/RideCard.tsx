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

  const difficultyStyles = {
    easy: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 border-green-200 dark:border-green-800",
    medium: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800",
    hard: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 border-red-200 dark:border-red-800",
  }

  return (
    <Card className="card-modern fade-in group h-full flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-3 flex-wrap">
              {ride.isAIGenerated && (
                <span className="badge-modern bg-gradient-to-r from-primary/20 to-accent/20 text-primary border border-primary/20 flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  AI Suggested
                </span>
              )}
              <span
                className={`badge-modern border ${
                  difficultyStyles[ride.difficulty as keyof typeof difficultyStyles] || "bg-gray-100 text-gray-800"
                }`}
              >
                {ride.difficulty}
              </span>
            </div>
            <Link href={`/rides/${ride.id}`}>
              <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors line-clamp-2">
                {ride.title}
              </h3>
            </Link>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col space-y-4">
        <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed flex-1">
          {ride.description}
        </p>
        <div className="space-y-2.5 p-3 bg-muted/30 rounded-lg border border-border/50">
          <div className="flex items-start gap-2.5 text-sm">
            <MapPin className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <span className="text-muted-foreground text-xs">From: </span>
              <span className="font-medium">{ride.startLocation}</span>
            </div>
          </div>
          <div className="flex items-start gap-2.5 text-sm">
            <MapPin className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <span className="text-muted-foreground text-xs">To: </span>
              <span className="font-medium">{ride.endLocation}</span>
            </div>
          </div>
          <div className="flex items-center gap-2.5 text-sm">
            <Calendar className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            <span>{format(new Date(ride.date), "PPP 'at' p")}</span>
          </div>
          <div className="flex items-center gap-2.5 text-sm">
            <Users className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            <span className="font-medium">
              {ride.participants.length}/{ride.maxParticipants} riders
            </span>
            {spotsLeft > 0 && (
              <span className="text-xs text-green-600 dark:text-green-400 font-medium">
                ({spotsLeft} spots left)
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center justify-between pt-3 border-t border-border/50">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-semibold text-xs">
              {ride.host.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground">Hosted by</span>
              <span className="text-sm font-medium">{ride.host.name}</span>
            </div>
          </div>
          <Link href={`/rides/${ride.id}`}>
            <Button size="sm" className="btn-modern">
              View Details
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}

