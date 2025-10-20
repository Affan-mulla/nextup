import prisma from "@/lib/prisma";

interface CommentUser {
  username: string;
  image: string | null;
  id: string;
}

interface Comment {
  id: string;
  content: string;
  createdAt: Date;
  commentId: string | null;
  user: CommentUser;
  votesCount: number;
  isDeleted: boolean;
  userVote?: "UP" | "DOWN" | null | { type: "UP" | "DOWN" }[];
  replies?: Comment[];
}

async function getCommentsWithReplies(comments: Comment[]): Promise<Comment[]> {
  // Build a map of comments by their ID
  const commentMap = new Map<string, Comment>();
  comments.forEach((comment) => {
    commentMap.set(comment.id, { ...comment, replies: [] });
  });

  // Organize comments into a tree structure
  const rootComments: Comment[] = [];
  comments.forEach((comment) => {
    if (comment.commentId) {
      // This is a reply, add it to its parent's replies array
      const parentComment = commentMap.get(comment.commentId);
      if (parentComment && parentComment.replies) {
        parentComment.replies.push(commentMap.get(comment.id) as Comment);
      }
    } else {
      // This is a root comment
      rootComments.push(commentMap.get(comment.id) as Comment);
    }
  });

  return rootComments;
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
