"use client";
import { useState } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";

interface VoteResponse {
  success: boolean;
  votesCount: number;
  userVote: "UP" | "DOWN" | null;
}

export const useVote = (initialVotesCount: number, initialUserVote?: "UP" | "DOWN" | null) => {
  const [votesCount, setVotesCount] = useState(initialVotesCount);
  const [userVote, setUserVote] = useState<"UP" | "DOWN" | null>(initialUserVote || null);
  const [isLoading, setIsLoading] = useState(false);
  const { data: session } = useSession();

  const vote = async (ideaId: string, voteType: "UP" | "DOWN") => {
    if (!session?.user?.id) {
      alert("Please sign in to vote");
      return;
    }

    setIsLoading(true);
    
    // Optimistic update
    const previousVotesCount = votesCount;
    const previousUserVote = userVote;
    
    // Calculate optimistic vote count
    let newVotesCount = votesCount;
    if (previousUserVote === voteType) {
      // Same vote - remove it
      newVotesCount = voteType === "UP" ? votesCount - 1 : votesCount + 1;
      setUserVote(null);
    } else if (previousUserVote) {
      // Different vote - change it
      newVotesCount = voteType === "UP" ? votesCount + 2 : votesCount - 2;
      setUserVote(voteType);
    } else {
      // New vote
      newVotesCount = voteType === "UP" ? votesCount + 1 : votesCount - 1;
      setUserVote(voteType);
    }
    
    setVotesCount(newVotesCount);

    try {
      const response = await axios.post("/api/vote", {
        ideaId,
        voteType,
      });

      const data: VoteResponse = await response.data;

      if (!data.success) {
        throw new Error(data.success ? "Vote failed" : "Network error");
      }

      // Update with server response
      setVotesCount(data.votesCount);
      setUserVote(data.userVote);
    } catch (error) {
      // Revert optimistic update on error
      setVotesCount(previousVotesCount);
      setUserVote(previousUserVote);
      console.error("Vote error:", error);
      alert("Failed to vote. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const upvote = (ideaId: string) => vote(ideaId, "UP");
  const downvote = (ideaId: string) => vote(ideaId, "DOWN");

  return {
    votesCount,
    userVote,
    isLoading,
    upvote,
    downvote,
  };
};
