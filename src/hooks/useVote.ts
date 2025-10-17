"use client";
import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { useStore } from "@/store/store";

interface VoteResponse {
  success: boolean;
  votesCount: number;
  userVote: "UP" | "DOWN" | null;
}

export const useVote = (initialVotesCount: number, initialUserVote?: "UP" | "DOWN" | null) => {
  const [votesCount, setVotesCount] = useState(initialVotesCount);
  const [userVote, setUserVote] = useState<"UP" | "DOWN" | null>(initialUserVote || null);
  const [isLoading, setIsLoading] = useState(false);
  const {updateVotes, submitVote, user} = useStore();

  const vote = async (ideaId: string, voteType: "UP" | "DOWN") => {
    if (!user?.id) {
      toast.error("Please sign in to vote");
      return;
    }

    setIsLoading(true);
    
    // Store previous state for potential rollback
    const previousVotesCount = votesCount;
    const previousUserVote = userVote;
    
    // Calculate optimistic vote count
    let newVotesCount = votesCount;
    let newUserVote = userVote;
    
    if (previousUserVote === voteType) {
      // Same vote - remove it
      newVotesCount = voteType === "UP" ? votesCount - 1 : votesCount + 1;
      newUserVote = null;
    } else if (previousUserVote) {
      // Different vote - change it
      newVotesCount = voteType === "UP" ? votesCount + 2 : votesCount - 2;
      newUserVote = voteType;
    } else {
      // New vote
      newVotesCount = voteType === "UP" ? votesCount + 1 : votesCount - 1;
      newUserVote = voteType;
    }
    
    // Update local state optimistically
    setVotesCount(newVotesCount);
    setUserVote(newUserVote);
    
    // Update global store optimistically
    updateVotes(ideaId, newVotesCount, newUserVote);

    // Submit vote - this will handle its own state management for consistency
    const result = await submitVote(ideaId, voteType, previousUserVote, previousVotesCount);
    
    if (!result.success) {
      // If the vote failed (not due to navigation), show error
      if (result.error?.name !== 'AbortError') {
        toast.error("Failed to vote. Please try again.");
      }
    }
    
    setIsLoading(false);
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
