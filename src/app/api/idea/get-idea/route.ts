import prisma from "@/lib/prisma";
import { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
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

      // If user is logged in, fetch their votes for these ideas
      if (session?.user?.id) {
        const ideaIds = ideas.map(idea => idea.id);
        const userVotes = await prisma.votes.findMany({
          where: {
            userId: session.user.id,
            ideaId: { in: ideaIds }
          },
          select: {
            ideaId: true,
            type: true
          }
        });

        // Create a map of ideaId to vote type
        const voteMap = userVotes.reduce((acc, vote) => {
          acc[vote.ideaId] = vote.type;
          return acc;
        }, {} as Record<string, "UP" | "DOWN">);

        // Add userVote to each idea
        const ideasWithVotes = ideas.map(idea => ({
          ...idea,
          userVote: voteMap[idea.id] || null
        }));

        return new Response(JSON.stringify(ideasWithVotes), { status: 200 });
      }

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
        votesCount: true,
        author: {
          select: {
            name: true,
            image: true,
          },
        },
        id: true,
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

    if (!idea) {
      return new Response("Idea not found", { status: 404 });
    }

    // If user is logged in, fetch their vote for this idea
    let userVote = null;
    if (session?.user?.id) {
      const vote = await prisma.votes.findUnique({
        where: {
          userId_ideaId: {
            userId: session.user.id,
            ideaId: ideaId
          }
        },
        select: {
          type: true
        }
      });
      userVote = vote?.type || null;
    }

    const ideaWithVote = {
      ...idea,
      userVote
    };

    return new Response(JSON.stringify(ideaWithVote), { status: 200 });
  } catch (error) {
    return new Response("Error getting idea", { status: 500 });
  }
}
