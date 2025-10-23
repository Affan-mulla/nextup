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
          username: user.username,
          name: user.name,
          role: user.role,
          image : user.image,
          createdAt: user.createdAt,
        }
      },
    }),
  ],
  callbacks: {
  async jwt({ token, user }) {
    if (user) {
      const u = user as { id?: string; name?: string; username?: string; role?: string; image?: string }
      token.id = u.id ?? token.id
      token.name = u.name ?? token.name
      token.username = u.username ?? token.username
      token.role = u.role ?? token.role
      token.picture = u.image ?? token.picture
    }
    return token
  },

  async session({ session, token }) {
    return {
      ...session,
      user: {
        ...session.user,
        id: token.id as string,
        name: token.name as string,
        username: token.username as string,
        role: token.role as string,
        image: token.picture as string,
      },
    }
  },
}

}
