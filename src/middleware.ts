import withAuth from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token

    // if no token → not logged in → redirect to signin
    if (!token) {
      return NextResponse.redirect(new URL("/auth/signin", req.url))
    }

    // if user tries to hit admin routes but is not admin
    if (req.nextUrl.pathname.startsWith("/dashboard") && token.role !== "ADMIN") {
      return NextResponse.rewrite(new URL("/not-allowed", req.url)) 
      // or show a "Not Allowed" page
    }

  if(!req.nextUrl.pathname.startsWith("/dashboard") && token.role === "ADMIN") {
    return NextResponse.rewrite(new URL("/not-allowed", req.url)) 
  }    

    // allow all other cases
    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: () => true, // we handle logic above
    },
  }
)

export const config = { 
  matcher: [ "/dashboard/:path*","/c/:path*","/idea/:path*" ,"/home/:path*" , "/u/:path*", "/notifications/:path*", "/settings/:path*" ],
}

// 👇 Force Node.js runtime instead of Edge
export const runtime = "nodejs"
