"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const createRideSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().min(1),
  startLocation: z.string().min(1),
  endLocation: z.string().min(1),
  date: z.string().min(1),
  time: z.string().min(1),
  difficulty: z.enum(["easy", "medium", "hard"]),
  maxParticipants: z.number().int().min(2).max(100),
})

type CreateRideForm = z.infer<typeof createRideSchema>

export default function CreateRidePage() {
  const router = useRouter()
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CreateRideForm>({
    resolver: zodResolver(createRideSchema),
    defaultValues: {
      difficulty: "medium",
      maxParticipants: 20,
    },
  })

  const difficulty = watch("difficulty")

  const onSubmit = async (data: CreateRideForm) => {
    setIsLoading(true)
    setError("")

    try {
      // Combine date and time
      const dateTime = new Date(`${data.date}T${data.time}`).toISOString()

      const response = await fetch("/api/rides", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          date: dateTime,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        setError(result.error || "Failed to create ride")
        return
      }

      router.push(`/rides/${result.ride.id}`)
    } catch (err) {
      setError("Something went wrong. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>Host a Ride</CardTitle>
          <CardDescription>Create a new bike ride for the community</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            {error && (
              <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                {error}
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="title">Ride Title</Label>
              <Input
                id="title"
                placeholder="e.g., Weekend Ride to Nandi Hills"
                {...register("title")}
              />
              {errors.title && (
                <p className="text-sm text-destructive">{errors.title.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe the ride route, meeting point, and any important details..."
                rows={6}
                {...register("description")}
              />
              {errors.description && (
                <p className="text-sm text-destructive">{errors.description.message}</p>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startLocation">Start Location</Label>
                <Input
                  id="startLocation"
                  placeholder="Starting point"
                  {...register("startLocation")}
                />
                {errors.startLocation && (
                  <p className="text-sm text-destructive">{errors.startLocation.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="endLocation">End Location</Label>
                <Input
                  id="endLocation"
                  placeholder="Destination"
                  {...register("endLocation")}
                />
                {errors.endLocation && (
                  <p className="text-sm text-destructive">{errors.endLocation.message}</p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  min={new Date().toISOString().split("T")[0]}
                  {...register("date")}
                />
                {errors.date && (
                  <p className="text-sm text-destructive">{errors.date.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="time">Time</Label>
                <Input
                  id="time"
                  type="time"
                  {...register("time")}
                />
                {errors.time && (
                  <p className="text-sm text-destructive">{errors.time.message}</p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="difficulty">Difficulty</Label>
                <Select
                  value={difficulty}
                  onValueChange={(value) => setValue("difficulty", value as any)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="easy">Easy</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="hard">Hard</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="maxParticipants">Max Participants</Label>
                <Input
                  id="maxParticipants"
                  type="number"
                  min={2}
                  max={100}
                  {...register("maxParticipants", { valueAsNumber: true })}
                />
                {errors.maxParticipants && (
                  <p className="text-sm text-destructive">{errors.maxParticipants.message}</p>
                )}
              </div>
            </div>
            <div className="flex gap-2">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Creating..." : "Create Ride"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </form>
      </Card>
    </div>
  )
}

