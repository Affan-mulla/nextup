export interface CommentResponse {
  id: string;
  content: string;
  commentId?: string | null;
  createdAt: string; // or Date if you don't serialize it
  votesCount: number;
  isDeleted: boolean;
  user: {
    id: string;
    username: string;
    image: string | null;
  };
  idea: {
    id: string;
    title: string;
  };
  votes : "UP" | "DOWN" | null;
  parent?: {
    id: string;
    content: string;
    user: {
      id: string;
      username: string;
      image: string | null;
    };
  } | null;
}