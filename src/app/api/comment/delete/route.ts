import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { commentId, userId } = body;

    if (!commentId || !userId) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "Missing required fields" 
        }), 
        { status: 400 }
      );
    }

    // Verify comment exists
    const comment = await prisma.comments.findUnique({ 
      where: { id: commentId } 
    });
    
    if (!comment) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "Comment not found" 
        }), 
        { status: 404 }
      );
    }

    // Only owner can delete their comment
    if (comment.userId !== userId) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "You don't have permission to delete this comment" 
        }), 
        { status: 403 }
      );
    }

    // Soft-delete the comment by setting isDeleted flag
    // We don't remove the record so replies remain intact
    const updated = await prisma.comments.update({
      where: { id: commentId },
      data: {
        isDeleted: true,
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
            id: true
          }
        },
        votes: {
          select: {
            type: true,
            userId: true
          }
        }
      },
    });

    return new Response(JSON.stringify({ success: true, comment: updated }), { status: 200 });
  } catch (error) {
    console.error("Error deleting comment:", error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: "Error deleting comment" 
      }), 
      { status: 500 }
    );
  }
}
