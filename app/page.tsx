"use client"

import Link from "next/link"
import { useSession } from "next-auth/react"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Navbar } from "@/components/Navbar"
import { 
  Bike, 
  MessageSquare, 
  Users, 
  Bot, 
  MapPin, 
  Calendar, 
  Shield, 
  Zap,
  ArrowRight,
  CheckCircle2,
  Sparkles
} from "lucide-react"

export default function LandingPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    // Redirect authenticated users to the main app
    if (status === "authenticated" && session) {
      router.push("/feed")
    }
  }, [session, status, router])

  // Show loading state while checking auth
  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  // Don't render landing page if authenticated (will redirect)
  if (status === "authenticated") {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20">
      <Navbar />
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/5 rounded-full blur-3xl"></div>
        </div>
        
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-8 backdrop-blur-sm">
            <Sparkles className="h-4 w-4" />
            <span className="text-sm font-medium">Bangalore's Premier Bike Riding Community</span>
          </div>
          
          {/* Hero Image */}
          <div className="mb-8 flex justify-center">
            <div className="relative w-full max-w-2xl h-64 md:h-80 rounded-2xl overflow-hidden shadow-xl border border-border/50">
              <img 
                src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80" 
                alt="Bikers on road"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent"></div>
            </div>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
            BLR Riders
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground mb-4 max-w-2xl mx-auto">
            Connect with fellow riders, discover amazing routes, and join exciting bike rides across Bangalore
          </p>
          
          <p className="text-lg text-muted-foreground mb-12 max-w-xl mx-auto">
            Your one-stop platform for everything bike-related in the Garden City
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button size="lg" className="text-lg px-8 py-6 shadow-lg">
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline" className="text-lg px-8 py-6">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Everything You Need to Ride Together
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Powerful features designed for the biking community
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          <Card className="border border-border/50 hover:border-primary/30 transition-all hover:shadow-xl overflow-hidden bg-card/50 backdrop-blur-sm">
            <div className="h-48 overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80" 
                alt="Community of bikers"
                className="w-full h-full object-cover"
              />
            </div>
            <CardContent className="p-6">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <MessageSquare className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Community Feed</h3>
              <p className="text-muted-foreground">
                Share experiences, ask questions, and connect with other riders in our vibrant community
              </p>
            </CardContent>
          </Card>

          <Card className="border border-border/50 hover:border-primary/30 transition-all hover:shadow-xl overflow-hidden bg-card/50 backdrop-blur-sm">
            <div className="h-48 overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=400&q=80" 
                alt="Group bike ride"
                className="w-full h-full object-cover"
              />
            </div>
            <CardContent className="p-6">
              <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                <Bike className="h-6 w-6 text-accent" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Host & Join Rides</h3>
              <p className="text-muted-foreground">
                Create your own rides or join others for amazing biking adventures across Bangalore
              </p>
            </CardContent>
          </Card>

          <Card className="border border-border/50 hover:border-primary/30 transition-all hover:shadow-xl overflow-hidden bg-card/50 backdrop-blur-sm">
            <div className="h-48 overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1609535766154-9e89e84a2c0a?w=400&q=80" 
                alt="Bikers chatting"
                className="w-full h-full object-cover"
              />
            </div>
            <CardContent className="p-6">
              <div className="h-12 w-12 rounded-lg bg-secondary/10 flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-secondary-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Real-time Chat</h3>
              <p className="text-muted-foreground">
                Connect with riders through 1-on-1 and group chats. Plan rides and share tips instantly
              </p>
            </CardContent>
          </Card>

          <Card className="border border-border/50 hover:border-primary/30 transition-all hover:shadow-xl overflow-hidden bg-card/50 backdrop-blur-sm">
            <div className="h-48 overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80" 
                alt="AI assistance"
                className="w-full h-full object-cover"
              />
            </div>
            <CardContent className="p-6">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Bot className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">AI Assistant</h3>
              <p className="text-muted-foreground">
                Get instant answers about traffic rules, safety guidelines, and best practices
              </p>
            </CardContent>
          </Card>

          <Card className="border border-border/50 hover:border-primary/30 transition-all hover:shadow-xl overflow-hidden bg-card/50 backdrop-blur-sm">
            <div className="h-48 overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=400&q=80" 
                alt="Bike route"
                className="w-full h-full object-cover"
              />
            </div>
            <CardContent className="p-6">
              <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                <MapPin className="h-6 w-6 text-accent" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Route Discovery</h3>
              <p className="text-muted-foreground">
                Discover new routes, share your favorite paths, and explore Bangalore on two wheels
              </p>
            </CardContent>
          </Card>

          <Card className="border border-border/50 hover:border-primary/30 transition-all hover:shadow-xl overflow-hidden bg-card/50 backdrop-blur-sm">
            <div className="h-48 overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1609535766154-9e89e84a2c0a?w=400&q=80" 
                alt="Safety gear"
                className="w-full h-full object-cover"
              />
            </div>
            <CardContent className="p-6">
              <div className="h-12 w-12 rounded-lg bg-secondary/10 flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-secondary-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Safety First</h3>
              <p className="text-muted-foreground">
                Access comprehensive safety guidelines, traffic rules, and community best practices
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="container mx-auto px-4 py-20 bg-muted/20 rounded-3xl my-20 relative overflow-hidden">
        {/* Background image */}
        <div className="absolute inset-0 opacity-5">
          <img 
            src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=80" 
            alt="Bikers background"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Why Join BLR Riders?
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Active Community</h3>
                <p className="text-muted-foreground">
                  Join hundreds of riders sharing experiences, tips, and organizing rides every week
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="h-10 w-10 rounded-full bg-accent/10 flex items-center justify-center">
                  <CheckCircle2 className="h-5 w-5 text-accent" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">AI-Powered Features</h3>
                <p className="text-muted-foreground">
                  Smart ride recommendations and instant answers to your biking questions
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="h-10 w-10 rounded-full bg-secondary/10 flex items-center justify-center">
                  <CheckCircle2 className="h-5 w-5 text-secondary-foreground" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Easy to Use</h3>
                <p className="text-muted-foreground">
                  Intuitive interface designed for riders, by riders. Get started in minutes
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Free Forever</h3>
                <p className="text-muted-foreground">
                  All features are completely free. Join, connect, and ride without any cost
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <Card className="max-w-4xl mx-auto border border-primary/20 bg-gradient-to-br from-primary/5 to-accent/5 overflow-hidden relative">
          <div className="absolute inset-0 opacity-10">
            <img 
              src="https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=1200&q=80" 
              alt="Bikers"
              className="w-full h-full object-cover"
            />
          </div>
          <CardContent className="p-12 text-center relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Start Riding?
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join the BLR Riders community today and connect with fellow biking enthusiasts
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register">
                <Button size="lg" className="text-lg px-8 py-6 shadow-lg">
                  Create Account
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/login">
                <Button size="lg" variant="outline" className="text-lg px-8 py-6">
                  Sign In
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t bg-muted/30 py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <Bike className="h-6 w-6 text-primary" />
              <span className="font-bold text-xl bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                BLR Riders
              </span>
            </div>
            <p className="text-muted-foreground text-sm">
              © 2025 BLR Riders. Built for the Bangalore biking community.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

