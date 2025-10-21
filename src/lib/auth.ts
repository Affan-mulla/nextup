import { type NextAuthOptions } from "next-auth"
import GitHubProvider from "next-auth/providers/github"
import CredentialsProvider from "next-auth/providers/credentials"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import prisma from "@/lib/prisma"
import { compare } from "bcrypt-ts"

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
      profile(profile) {
        return {
          id: profile.id.toString(),
          username: profile.login || profile.name,
          name: profile.name || profile.login,
          email: profile.email,
          image: profile.avatar_url,
          role: "USER",
        }
      },
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: { email: {}, password: {} },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) return null

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        })
        if (!user || !user.passwordHash) return null

        const valid = await compare(credentials.password, user.passwordHash)
        if (!valid) return null

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          image : user.image
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        // Attach commonly used user fields to the token so they are
        // available in the session callback and on the client.
        // `user` can come from providers or credentials, so use any.
        const u = user;
        console.log(user);
        
        token.id = u.id ?? token.id;
        token.role = u.role ?? token.role;
        // NextAuth uses `picture` on the token for image by convention
        token.picture = u.image ?? token.picture;
      }
      return token
    },

    async session({ session, token }) {
      console.log(session);
      console.log(token);
      
      
      return {
        ...session,
        user: {
          ...session.user,
          image: token.picture as string,
          id: token.id as string,
          role: token.role as string,
        },
      }
    },
  },
}
