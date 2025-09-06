import { auth } from "./lib/auth"



export default auth((req) => {
  if(!req.auth) {
    return Response.redirect("/auth/signin")
  }
})

export const config = {
  matcher: [ "/company/:path*", "/ideas/:path*" ,"/home/:path*" , "/user/:path*", "/notification/:path*", "/settings/:path*", "/profile/:path*" ],
}

// 👇 Force Node.js runtime instead of Edge
export const runtime = "nodejs"
