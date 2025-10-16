"use server";
import sendEmail from "@/lib/email";
import prisma from "@/lib/prisma";

import { SignUpSchema } from "@/lib/validation";
import { hash } from "bcrypt-ts";
import { ZodError } from "zod";

export async function POST(request: Request) {
  try {
    const data = await request.json();
    console.log(data);
    if (!data.email || !data.password || !data.username || !data.role) {
      return new Response("Missing fields", { status: 400 });
    }
    if (data.role !== "user" && data.role !== "company") {
      return new Response("Invalid role", { status: 400 });
    }
    if (data.role === "company" && !data.company) {
      return new Response("Missing company name for company role", {
        status: 400,
      });
    }

    const parsed = SignUpSchema.parse(data);

    // Check if email or username already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email: parsed.email },
          { username: parsed.username }
        ]
      },
    });
    if (existingUser) {
      const field = existingUser.email === parsed.email ? "email" : "username";
      return new Response(`${field.charAt(0).toUpperCase() + field.slice(1)} already exists`, { status: 409 });
    }
    const hashedPassword = await hash(parsed.password, 10);
    
    // Use transaction to ensure both user and company creation succeed or fail together
    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          username: parsed.username,
          email: parsed.email,
          passwordHash: hashedPassword,
          name: parsed.username,
          role: parsed.role === "user" ? "USER" : "ADMIN",
        },
      });

      if (parsed.role === "company" && parsed.company) {
        const company = await tx.companies.create({
          data: {
            name: parsed.company,
            ownerId: user.id,
          },
        });
        return { user, company };
      }

      return { user };
    });

    if (!result.user) {
      return new Response("Failed to create user", { status: 500 });
    }

    const emailSent = await sendEmail(
      result.user.email,
      "http://nextup-v7.vercel.app/auth/signin"
    );

    if (
      !emailSent
    ) {
      return new Response("Failed to send email", { status: 500 });
    }

    return new Response("User created", { status: 200 });
  } catch (error) {
    console.error("Signup error:", error);
    
    // Handle specific Prisma errors
    if (error instanceof Error) {
      if (error.message.includes("Unique constraint")) {
        return new Response("Email or username already exists", { status: 409 });
      }
      if (error.message.includes("Invalid email")) {
        return new Response("Invalid email format", { status: 400 });
      }
    }
    
    // Handle validation errors from Zod
    if (error && typeof error === 'object' && 'issues' in error) {
      const validationError = error as ZodError;
      const firstIssue = validationError.issues?.[0];
      if (firstIssue) {
        return new Response(firstIssue.message || "Validation error", { status: 400 });
      }
    }

    return new Response("Internal Server Error", { status: 500 });
  }
}
