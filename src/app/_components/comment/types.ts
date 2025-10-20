export interface CommentUser {
  username: string;
  image: string | null;
  id: string;
}

export interface CommentData {
  id: string;
  content: string;
  createdAt: Date;
  user: CommentUser;
  replies?: CommentData[];
  ideaId: string;
  votesCount: number;
  userVote?: "UP" | "DOWN" | null;
}

export interface CommentFormData {
  comment: string;
  ideaId: string;
  userId: string;
  commentId?: string;
}