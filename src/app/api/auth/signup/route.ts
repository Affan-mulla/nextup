"use server";
import sendEmail from "@/lib/email";
import prisma from "@/lib/prisma";

import { SignUpSchema } from "@/lib/validation";
import { hash } from "bcrypt-ts";

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

    const existingUser = await prisma.user.findUnique({
      where: { email: parsed.email },
    });
    if (existingUser) {
      return new Response("User already exists", { status: 400 });
    }
    const hashedPassword = await hash(parsed.password, 10);
    const user = await prisma.user.create({
      data: {
        username: parsed.username,
        email: parsed.email,
        passwordHash: hashedPassword,
        name: parsed.username,
        role: parsed.role === "user" ? "USER" : "ADMIN",
      },
    });
    if (!user) {
      return new Response("Failed to create user", { status: 500 });
    }

    if (parsed.role === "company" && parsed.company) {
      const company = await prisma.companies.create({
        data: {
          name: parsed.company,
          ownerId: user.id,
        },
      });

      if (!company) {
        return new Response("Failed to create company", { status: 500 });
      }
    }

    const emailSent = await sendEmail(
      user.email,
      "http://nextup-v7.vercel.app/auth/signin"
    );

    if (
      !emailSent
    ) {
      return new Response("Failed to send email", { status: 500 });
    }

    return new Response("User created", { status: 200 });
  } catch (error) {
    console.error(error);

    return new Response("Internal Server Error", { status: 500 });
  }
}
