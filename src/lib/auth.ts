// auth.ts
import { NextAuthOptions } from "next-auth"
import NextAuth, { getServerSession } from "next-auth"
import GitHubProvider from "next-auth/providers/github"
import CredentialsProvider from "next-auth/providers/credentials"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import prisma from "@/lib/prisma"
import { compare } from "bcrypt-ts"
import { GetServerSidePropsContext, NextApiRequest, NextApiResponse } from "next"

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
          name: profile.name || profile.login,
          email: profile.email,
          image: profile.avatar_url,
          role: "USER", // 👈 always set
        }
      },
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: { email: {}, password: {} },
      async authorize(credentials) {
        const user = await prisma.user.findUnique({ where: { email: credentials?.email } })
        if (!user || !user.passwordHash) return null

        const valid = await compare(credentials!.password, user.passwordHash)
        if (!valid) return null

        return { id: user.id, email: user.email, name: user.name, role: user.role }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = (user as any).id
        token.role = (user as any).role
      }
      return token
    },
    async session({ session, token }) {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id as string,
          role: token.role as string,
        },
      }
    },
  },
}

export const { handlers, auth: nextAuthAuth } = NextAuth(authOptions)

// helper for server components / API
export function auth(
  req?: GetServerSidePropsContext["req"] | NextApiRequest,
  res?: GetServerSidePropsContext["res"] | NextApiResponse
) {
  // If req/res provided (pages/api or getServerSideProps)
  if (req && res) {
    return getServerSession(req, res, authOptions)
  }
  // If no args (App Router / server component)
  return getServerSession(authOptions)
}