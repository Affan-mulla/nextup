export interface IdeaType {
  id: string;
  title: string;
  description: string;
  status: string;
  createdAt: Date;
  votesCount: number;
  userVote?: "UP" | "DOWN" | null;
  _count: {
    comments: number;
  };
  author: {
    name: string;
    image: string | null;
  };
  company: {
    name: string;
    logoUrl: string | null;
  };
}
