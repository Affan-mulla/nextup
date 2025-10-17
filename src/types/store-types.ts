export interface User {
    id: string ,
    email?: string | null | undefined,
    name?: string | null | undefined,
    role?: string | null | undefined,
    image?: string | null | undefined
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