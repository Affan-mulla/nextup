import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GitHubProvider from "next-auth/providers/github";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { compare } from "bcrypt-ts";
import prisma from "@/lib/prisma"; // <- we’ll add this
import { Resend } from "resend";
import Email from "next-auth/providers/email";

// Initialize Resend with your API key
const resend = new Resend(process.env.RESEND_API_KEY);

const handler = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  providers: [
    Email({
      from: process.env.EMAIL_FROM,
      maxAge: 10 * 60, // 10 minutes; keep it tight
      async sendVerificationRequest({ identifier, url }) {
        await resend.emails.send({
          from: process.env.EMAIL_FROM!,
          to: identifier,
          subject: "Verify your sign-in",
          text: `Sign in link: ${url}`,
          html: `
            <div style="font-family:system-ui">
              <h2>Verify your email</h2>
              <p>Click the button below to complete sign-in.</p>
              <p><a href="${url}" style="display:inline-block;padding:10px 16px;border-radius:8px;text-decoration:none;border:1px solid #e5e7eb">Verify & Sign in</a></p>
              <p style="color:#6b7280">This link expires in 10 minutes. If you didn’t request it, ignore this email.</p>
            </div>
          `,
        });
      }
    }),
    // GitHub OAuth
    GitHubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),

    // Credentials login
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user) return null;

        const isValid = await compare(credentials.password, user.passwordHash);
        if (!isValid) return null;

        return { id: user.id, email: user.email, name: user.name };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.uid = user.id;
      return token;
    },
    async session({ session, token }) {
      if (session.user && token?.uid) (session.user as any).id = token.uid;
      return session;
    },
  },

  pages: {
    signIn: "/auth/signin",
    verifyRequest: "/auth/verify", // “check your email” screen
    error: "/auth/error", // handle expired/invalid links
  },
});

export { handler as GET, handler as POST };
