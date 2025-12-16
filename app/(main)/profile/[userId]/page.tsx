"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { User, MapPin, Bike, Award, Calendar, Users, MessageSquare, Plus } from "lucide-react"
import { format } from "date-fns"
import Link from "next/link"

interface UserProfile {
  id: string
  name: string
  bio: string | null
  avatar: string | null
  location: string | null
  bikeModel: string | null
  experience: string | null
  reputation: number
  createdAt: Date
  isFollowing: boolean
  isOwnProfile: boolean
  _count: {
    posts: number
    hostedRides: number
    rideParticipants: number
    followers: number
    following: number
  }
}

export default function UserProfilePage() {
  const params = useParams()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [isFollowing, setIsFollowing] = useState(false)
  const [isUpdatingFollow, setIsUpdatingFollow] = useState(false)

  useEffect(() => {
    fetchProfile()
  }, [params.userId])

  const fetchProfile = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/users/${params.userId}`)
      const data = await response.json()
      if (data.user) {
        setProfile(data.user)
        setIsFollowing(data.user.isFollowing)
      }
    } catch (error) {
      console.error("Error fetching profile:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleFollow = async () => {
    if (isUpdatingFollow) return

    setIsUpdatingFollow(true)
    const previousState = isFollowing

    // Optimistic update
    setIsFollowing(!isFollowing)

    try {
      const response = await fetch(`/api/users/${params.userId}/follow`, {
        method: isFollowing ? "DELETE" : "POST",
      })

      if (!response.ok) {
        setIsFollowing(previousState)
      } else {
        fetchProfile()
      }
    } catch (error) {
      setIsFollowing(previousState)
      console.error("Error updating follow status:", error)
    } finally {
      setIsUpdatingFollow(false)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Card className="animate-pulse">
          <CardContent className="p-6">
            <div className="h-24 bg-muted rounded mb-4"></div>
            <div className="h-4 bg-muted rounded w-3/4"></div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-muted-foreground">User not found</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center">
                {profile.avatar ? (
                  <img
                    src={profile.avatar}
                    alt={profile.name}
                    className="h-20 w-20 rounded-full"
                  />
                ) : (
                  <User className="h-10 w-10 text-primary" />
                )}
              </div>
              <div className="flex-1">
                <CardTitle className="text-2xl mb-2">{profile.name}</CardTitle>
                {profile.bio && (
                  <p className="text-muted-foreground mb-2">{profile.bio}</p>
                )}
                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                  {profile.location && (
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {profile.location}
                    </div>
                  )}
                  {profile.bikeModel && (
                    <div className="flex items-center gap-1">
                      <Bike className="h-4 w-4" />
                      {profile.bikeModel}
                    </div>
                  )}
                  {profile.experience && (
                    <div className="flex items-center gap-1">
                      <Award className="h-4 w-4" />
                      {profile.experience}
                    </div>
                  )}
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    Joined {format(new Date(profile.createdAt), "MMM yyyy")}
                  </div>
                </div>
              </div>
            </div>
            {!profile.isOwnProfile && (
              <Button
                onClick={handleFollow}
                disabled={isUpdatingFollow}
                variant={isFollowing ? "outline" : "default"}
              >
                {isFollowing ? "Unfollow" : "Follow"}
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center p-4 rounded-lg border">
              <div className="text-2xl font-bold">{profile.reputation}</div>
              <div className="text-sm text-muted-foreground">Reputation</div>
            </div>
            <div className="text-center p-4 rounded-lg border">
              <div className="text-2xl font-bold">{profile._count.posts}</div>
              <div className="text-sm text-muted-foreground">Posts</div>
            </div>
            <div className="text-center p-4 rounded-lg border">
              <div className="text-2xl font-bold">{profile._count.hostedRides}</div>
              <div className="text-sm text-muted-foreground">Hosted Rides</div>
            </div>
            <div className="text-center p-4 rounded-lg border">
              <div className="text-2xl font-bold">{profile._count.rideParticipants}</div>
              <div className="text-sm text-muted-foreground">Joined Rides</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="text-center p-4 rounded-lg border">
              <div className="text-2xl font-bold">{profile._count.followers}</div>
              <div className="text-sm text-muted-foreground flex items-center justify-center gap-1">
                <Users className="h-4 w-4" />
                Followers
              </div>
            </div>
            <div className="text-center p-4 rounded-lg border">
              <div className="text-2xl font-bold">{profile._count.following}</div>
              <div className="text-sm text-muted-foreground flex items-center justify-center gap-1">
                <Users className="h-4 w-4" />
                Following
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                Recent Posts
              </h3>
              <p className="text-sm text-muted-foreground">
                {profile._count.posts === 0
                  ? "No posts yet"
                  : `View all ${profile._count.posts} posts`}
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Hosted Rides
              </h3>
              <p className="text-sm text-muted-foreground">
                {profile._count.hostedRides === 0
                  ? "No hosted rides yet"
                  : `View all ${profile._count.hostedRides} hosted rides`}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

