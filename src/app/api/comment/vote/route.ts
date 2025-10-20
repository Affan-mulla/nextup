import { VoteType } from "@prisma/client";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { commentId, userId, type } = body;

    if (!commentId || !userId || !type) {
      return new Response("Missing required fields", { status: 400 });
    }

    // Check if the user has already voted on this comment
    const existingVote = await prisma.commentVotes.findUnique({
      where: {
        userId_commentId: {
          userId,
          commentId,
        },
      },
    });

    if (existingVote) {
      if (existingVote.type === type) {
        // Remove vote if clicking the same button
        await prisma.$transaction([
          prisma.commentVotes.delete({
            where: {
              id: existingVote.id,
            },
          }),
          prisma.comments.update({
            where: { id: commentId },
            data: {
              votesCount: {
                increment: type === VoteType.UP ? -1 : 1,
              },
            },
          }),
        ]);

        return new Response(JSON.stringify({ message: "Vote removed" }), {
          status: 200,
        });
      } else {
        // Change vote type
        await prisma.$transaction([
          prisma.commentVotes.update({
            where: {
              id: existingVote.id,
            },
            data: {
              type,
            },
          }),
          prisma.comments.update({
            where: { id: commentId },
            data: {
              votesCount: {
                increment: type === VoteType.UP ? 2 : -2,
              },
            },
          }),
        ]);
      }
    } else {
      // Create new vote
      await prisma.$transaction([
        prisma.commentVotes.create({
          data: {
            type,
            userId,
            commentId,
          },
        }),
        prisma.comments.update({
          where: { id: commentId },
          data: {
            votesCount: {
              increment: type === VoteType.UP ? 1 : -1,
            },
          },
        }),
      ]);
    }

    const updatedComment = await prisma.comments.findUnique({
      where: { id: commentId },
      select: {
        votesCount: true,
        votes: {
          where: {
            userId,
          },
          select: {
            type: true,
          },
        },
      },
    });

    return new Response(JSON.stringify(updatedComment), { status: 200 });
  } catch (error) {
    console.error("Error processing vote:", error);
    return new Response("Error processing vote", { status: 500 });
  }
}