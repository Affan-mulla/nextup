"use server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return new Response("Unauthorized", { status: 401 });
    }

    const { ideaId, voteType } = await request.json();

    if (!ideaId || !voteType) {
      return new Response("Missing required fields", { status: 400 });
    }

    if (voteType !== "UP" && voteType !== "DOWN") {
      return new Response("Invalid vote type", { status: 400 });
    }

    // Check if idea exists
    const idea = await prisma.ideas.findUnique({
      where: { id: ideaId },
      select: { id: true, votesCount: true }
    });

    if (!idea) {
      return new Response("Idea not found", { status: 404 });
    }

    // Check if user has already voted on this idea
    const existingVote = await prisma.votes.findUnique({
      where: {
        userId_ideaId: {
          userId: session.user.id,
          ideaId: ideaId
        }
      }
    });

    // Use transaction to ensure data consistency
    const result = await prisma.$transaction(async (tx) => {
      let newVoteCount = idea.votesCount;
      let voteRecord = null;

      if (existingVote) {
        // User has already voted
        if (existingVote.type === voteType) {
          // Same vote type - remove the vote
          await tx.votes.delete({
            where: { id: existingVote.id }
          });
          newVoteCount = voteType === "UP" ? newVoteCount - 1 : newVoteCount + 1;
        } else {
          // Different vote type - update the vote
          await tx.votes.update({
            where: { id: existingVote.id },
            data: { type: voteType }
          });
          newVoteCount = voteType === "UP" ? newVoteCount + 2 : newVoteCount - 2;
        }
      } else {
        // User hasn't voted yet - create new vote
        voteRecord = await tx.votes.create({
          data: {
            userId: session.user.id,
            ideaId: ideaId,
            type: voteType
          }
        });
        newVoteCount = voteType === "UP" ? newVoteCount + 1 : newVoteCount - 1;
      }

      // Update the idea's vote count
      await tx.ideas.update({
        where: { id: ideaId },
        data: { votesCount: newVoteCount }
      });

      return { newVoteCount, voteRecord };
    });

    return new Response(JSON.stringify({
      success: true,
      votesCount: result.newVoteCount,
      userVote: existingVote ? (existingVote.type === voteType ? null : voteType) : voteType
    }), { status: 200 });

  } catch (error) {
    console.error("Vote error:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return new Response("Unauthorized", { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const ideaId = searchParams.get("ideaId");

    if (!ideaId) {
      return new Response("Missing ideaId", { status: 400 });
    }

    // Get user's vote for this idea
    const userVote = await prisma.votes.findUnique({
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

    return new Response(JSON.stringify({
      userVote: userVote?.type || null
    }), { status: 200 });

  } catch (error) {
    console.error("Get vote error:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
