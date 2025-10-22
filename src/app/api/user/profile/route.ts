import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const userId = new URL(req.url).searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // Fetch latest profile from Prisma
    const profile = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        name: true,
        image: true,
        role: true,
        email: true,
        createdAt: true,
        _count: {
          select: {
            ideas: true,
            comments: true,
            follows: true,
          },
        },
      },
    });

    if(!profile) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return new NextResponse(JSON.stringify(profile), { status: 200 });

  } catch (error) {
    return new Response("Error while fetching profile", { status: 501 });
  }
}
