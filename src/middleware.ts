import { withAuth } from "next-auth/middleware"

export default withAuth({
  pages: {
    signIn: "/auth/signin", // or your login page
  },
})

export const config = {
  matcher: [ "/company/:path*", "/ideas/:path*"],
}

// 👇 Force Node.js runtime instead of Edge
export const runtime = "nodejs"
