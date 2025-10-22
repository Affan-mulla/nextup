export interface User {
    id: string ,
    email: string ,
    name?: string  | undefined,
    role?: string | undefined,
    image?: string  | undefined,
    createdAt?: string ,
    username: string ,
    bio?: string  | undefined,
    jobRole?: string | undefined,
    _count?: { ideas: number, comments: number,follows: number }
}

export interface Store {
    user : User,
    setUser : (user : User) => void,
    submitVote: (
        ideaId: string,
        voteType: "UP" | "DOWN",
        previousVote: "UP" | "DOWN" | null,
        previousCount: number
    ) => Promise<SubmitVoteResult>
}

export interface SubmitVoteResult {
    success: boolean;
    data?: {
        votesCount: number;
        userVote: "UP" | "DOWN" | null;
    };
    error?: Error;
}