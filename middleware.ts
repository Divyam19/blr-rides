import { NextResponse } from "next/server"
import { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Skip middleware for API routes, static files, and Next.js internals
  if (
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon.ico")
  ) {
    return NextResponse.next()
  }
  
  // Public routes that don't require authentication
  const publicRoutes = ["/login", "/register", "/"]
  const isPublicRoute = publicRoutes.some(route => pathname === route || pathname.startsWith(route + "/"))
  
  // Check for NextAuth v5 session token in cookies
  // Try all possible cookie names for NextAuth v5
  const sessionToken = 
    request.cookies.get("authjs.session-token")?.value ||
    request.cookies.get("__Secure-authjs.session-token")?.value ||
    request.cookies.get("next-auth.session-token")?.value ||
    request.cookies.get("__Secure-next-auth.session-token")?.value
  
  const isLoggedIn = !!sessionToken

  // Landing page - always accessible
  if (pathname === "/") {
    // If logged in, redirect to feed
    if (isLoggedIn) {
      return NextResponse.redirect(new URL("/feed", request.url))
    }
    // If not logged in, show landing page
    return NextResponse.next()
  }

  // If not logged in and trying to access protected route, redirect to login
  if (!isLoggedIn && !isPublicRoute) {
    const loginUrl = new URL("/login", request.url)
    loginUrl.searchParams.set("callbackUrl", pathname)
    return NextResponse.redirect(loginUrl)
  }

  // If logged in and trying to access auth pages, redirect to feed
  if (isLoggedIn && (pathname === "/login" || pathname === "/register")) {
    return NextResponse.redirect(new URL("/feed", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
}

