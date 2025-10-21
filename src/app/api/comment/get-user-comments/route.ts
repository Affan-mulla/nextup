import prisma from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return new Response("Missing userId", { status: 400 });
    }

    const comments = await prisma.comments.findMany({
      where: {
        userId,
        isDeleted: false,
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
            id: true,
            username: true,
            image: true,
          },
        },
        idea: {
          select: {
            id: true,
            title: true,
          },
        },
        votes: {
          select: {
            type: true,
          },
        },
        parent: { // <-- get the comment you're replying to
          select: {
            id: true,
            content: true,
            user: {
              select: {
                id: true,
                username: true,
                image: true,
              },
            },
          },
        },
      },
    });

    const formattedComments = comments.map((comment) => ({
      ...comment,
      votes: comment.votes[0]?.type || null,
    }));

    return new Response(JSON.stringify(formattedComments), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response("Error getting comments", { status: 501 });
  }
}