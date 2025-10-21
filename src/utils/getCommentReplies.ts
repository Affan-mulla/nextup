
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


export async function getCommentsWithReplies(comments: Comment[]): Promise<Comment[]> {
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