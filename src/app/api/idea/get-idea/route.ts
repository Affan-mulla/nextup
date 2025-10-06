import prisma from "@/lib/prisma";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const ideaId: string | null = req.nextUrl.searchParams.get("ideaId");
    console.log(ideaId);

    if (!ideaId) {
      const ideas = await prisma.ideas.findMany({
        take: 10,
        select: {
          id: true,
          title: true,
          description: true,
          status: true,
          createdAt: true,
          votesCount: true,
          author: {
            select: {
              name: true,
              image: true,
            },
          },
          company: {
            select: {
              name: true,
              logoUrl: true,
            },
          },
          _count: {
            select: {
              comments: true,
            },
          },
        },
      });

      return new Response(JSON.stringify(ideas), { status: 200 });
    }

    const idea = await prisma.ideas.findUnique({
      where: {
        id: ideaId,
      },
      select: {
        title: true,
        description: true,
        status: true,
        createdAt: true,
        author: {
          select: {
            name: true,
          },
        },
        id: true,
        company: {
          select: {
            name: true,
            logoUrl: true,
          },
        },
      },
    });

    if (!idea) {
      return new Response("Idea not found", { status: 404 });
    }

    return new Response(JSON.stringify(idea), { status: 200 });
  } catch (error) {
    return new Response("Error getting idea", { status: 500 });
  }
}
