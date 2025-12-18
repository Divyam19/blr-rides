"use client"

import { useEffect, useState, useRef } from "react"
import { RideMap } from "./RideMap"
import { Button } from "./ui/button"
import { Play, Square } from "lucide-react"

interface LiveTrackingProps {
  rideId: string
  startLat?: number | null
  startLng?: number | null
  endLat?: number | null
  endLng?: number | null
  routePolyline?: string | null
  isHost: boolean
  isParticipant: boolean
}

interface LocationData {
  lat: number
  lng: number
  userId: string
  userName: string
  timestamp: string
}

export function LiveTracking({
  rideId,
  startLat,
  startLng,
  endLat,
  endLng,
  routePolyline,
  isHost,
  isParticipant,
}: LiveTrackingProps) {
  const [locations, setLocations] = useState<LocationData[]>([])
  const [isTracking, setIsTracking] = useState(false)
  const [error, setError] = useState("")
  const watchIdRef = useRef<number | null>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (isTracking && (isHost || isParticipant)) {
      startLocationTracking()
    } else {
      stopLocationTracking()
    }

    return () => {
      stopLocationTracking()
    }
  }, [isTracking, isHost, isParticipant])

  useEffect(() => {
    // Poll for location updates from other participants
    if (isHost || isParticipant) {
      fetchLocations()
      intervalRef.current = setInterval(fetchLocations, 5000) // Poll every 5 seconds
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [rideId, isHost, isParticipant])

  const fetchLocations = async () => {
    try {
      const response = await fetch(`/api/rides/${rideId}/tracking`)
      if (response.ok) {
        const data = await response.json()
        setLocations(data.locations || [])
      }
    } catch (error) {
      console.error("Error fetching locations:", error)
    }
  }

  const startLocationTracking = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser")
      return
    }

    const options = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0,
    }

    watchIdRef.current = navigator.geolocation.watchPosition(
      async (position) => {
        const { latitude, longitude } = position.coords

        try {
          const response = await fetch(`/api/rides/${rideId}/tracking`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              latitude,
              longitude,
            }),
          })

          if (response.ok) {
            setError("")
            fetchLocations() // Refresh locations immediately
          } else {
            const data = await response.json()
            setError(data.error || "Failed to update location")
          }
        } catch (error) {
          console.error("Error updating location:", error)
          setError("Failed to send location update")
        }
      },
      (err) => {
        console.error("Geolocation error:", err)
        setError("Failed to get your location. Please check your browser permissions.")
      },
      options
    )
  }

  const stopLocationTracking = () => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current)
      watchIdRef.current = null
    }
  }

  const handleToggleTracking = () => {
    setIsTracking(!isTracking)
  }

  if (!isHost && !isParticipant) {
    return null
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Live Tracking</h3>
          <p className="text-sm text-muted-foreground">
            Share your location with other participants
          </p>
        </div>
        <Button
          onClick={handleToggleTracking}
          variant={isTracking ? "destructive" : "default"}
        >
          {isTracking ? (
            <>
              <Square className="h-4 w-4 mr-2" />
              Stop Tracking
            </>
          ) : (
            <>
              <Play className="h-4 w-4 mr-2" />
              Start Tracking
            </>
          )}
        </Button>
      </div>

      {error && (
        <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <RideMap
        startLat={startLat}
        startLng={startLng}
        endLat={endLat}
        endLng={endLng}
        routePolyline={routePolyline}
        userLocations={locations.map((loc) => ({
          lat: loc.lat,
          lng: loc.lng,
          userId: loc.userId,
          userName: loc.userName,
        }))}
        height="500px"
      />

      {locations.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-semibold">Active Participants</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {locations.map((location) => (
              <div
                key={location.userId}
                className="flex items-center gap-2 p-2 rounded-lg border text-sm"
              >
                <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                <span className="font-medium">{location.userName}</span>
                <span className="text-muted-foreground text-xs">
                  {new Date(location.timestamp).toLocaleTimeString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

