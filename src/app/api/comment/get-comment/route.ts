import prisma from "@/lib/prisma";
import { getCommentsWithReplies } from "@/utils/getCommentReplies";

interface CommentUser {
  username: string;
  image: string | null;
  id: string;
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const ideaId = searchParams.get("ideaId");
    const userId = searchParams.get("userId"); // Pass userId from client for userVote

    if (!ideaId) {
      return new Response("Missing ideaId", { status: 400 });
    }

    // Get all comments for the idea
    const comments = await prisma.comments.findMany({
      where: {
        ideaId: ideaId,
      },
      select: {
        id: true,
        content: true,
        createdAt: true,
        commentId: true,
        votesCount: true,
        isDeleted: true,
        user: {
          select: {
            username: true,
            image: true,
            id: true,
          },
        },
        votes: {
          select: {
            type: true,
            userId: true,
          },
        },
      },
      orderBy: [
        {
          commentId: "asc",
        },
        {
          createdAt: "desc",
        },
      ],
    });

    // Map votesCount and userVote for each comment
    const commentsWithVotes = comments.map((comment ) => ({
      ...comment,
      userVote: comment.votes?.[0]?.type || null,
    }));
    // Organize comments into a hierarchical structure
    const organizedComments = await getCommentsWithReplies(commentsWithVotes);

    return new Response(JSON.stringify(organizedComments), { status: 200 });
  } catch (error) {
    console.error("Error fetching comments:", error);
    return new Response("Error fetching comments", { status: 500 });
  }
}
