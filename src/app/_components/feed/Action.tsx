import { ArrowBigDownDash, ArrowBigUpDash, MessageCircleMore } from "lucide-react";
import React from "react";
import { useVote } from "@/hooks/useVote";

interface ActionProps {
  ideaId: string;
  votes: number;
  comments: number;
  userVote?: "UP" | "DOWN" | null;
}

const Action = ({ ideaId, votes, comments, userVote }: ActionProps) => {
  const { votesCount, userVote: currentUserVote, isLoading, upvote, downvote } = useVote(votes, userVote);
  const [isVoteChanging, setIsVoteChanging] = React.useState(false);

  // Add pulse animation when vote count changes
  React.useEffect(() => {
    if (votesCount !== votes) {
      setIsVoteChanging(true);
      const timer = setTimeout(() => setIsVoteChanging(false), 300);
      return () => clearTimeout(timer);
    }
  }, [votesCount, votes]);

  const handleUpvote = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isLoading) {
      upvote(ideaId);
    }
  };

  const handleDownvote = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isLoading) {
      downvote(ideaId);
    }
  };

  
  return (
    <>
      {/* Voting */}
      <div className="flex items-center gap-1 rounded-xl bg-card p-1.5 shadow-sm border border-border/50 hover:border-border transition-colors">
        {/* Upvote */}
        <button 
          onClick={handleUpvote}
          disabled={isLoading}
          className={`group flex flex-col items-center justify-center rounded-xl p-2 transition-all duration-200 ${
            currentUserVote === "UP" 
              ? "bg-green-50 text-green-600 border border-green-200" 
              : "hover:bg-green-50/50 hover:border-green-100"
          } ${isLoading ? "opacity-50 cursor-not-allowed" : "hover:scale-105 active:scale-95"}`}
        >
          <ArrowBigUpDash className={`size-5 transition-all duration-200 ${
            currentUserVote === "UP" 
              ? "text-green-600 drop-shadow-sm" 
              : "text-muted-foreground group-hover:text-green-500"
          }`} />
        </button>

        {/* Vote Count */}
        <div className="min-w-[2rem] text-center flex items-center justify-center">
          <span className={`text-sm font-semibold transition-all duration-300 ${
            votesCount > 0 
              ? "text-green-600" 
              : votesCount < 0 
                ? "text-red-600" 
                : "text-muted-foreground"
          } ${isVoteChanging ? "animate-pulse scale-110" : ""}`}>
            {votesCount > 0 ? `+${votesCount}` : votesCount}
          </span>
        </div>

        {/* Downvote */}
        <button 
          onClick={handleDownvote}
          disabled={isLoading}
          className={`group flex flex-col items-center justify-center rounded-xl p-2 transition-all duration-200 ${
            currentUserVote === "DOWN" 
              ? "bg-red-50 text-red-600 border border-red-200" 
              : "hover:bg-red-50/50 hover:border-red-100"
          } ${isLoading ? "opacity-50 cursor-not-allowed" : "hover:scale-105 active:scale-95"}`}
        >
          <ArrowBigDownDash className={`size-5 transition-all duration-200 ${
            currentUserVote === "DOWN" 
              ? "text-red-600 drop-shadow-sm" 
              : "text-muted-foreground group-hover:text-red-500"
          }`} />
        </button>
      </div>

      {/* Comments */}
      <div className="items-center rounded-2xl bg-card p-1.5 shadow-sm w-fit border border-border/50 hover:border-border transition-colors hidden md:flex">
        {/* Comment Button */}
        <button 
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            // TODO: Handle comment functionality
          }}
          className="group flex items-center gap-2 rounded-xl bg-card md:px-3 px-2 md:py-2 py-1 transition-all duration-200 ease-out hover:scale-105 active:scale-95 text-muted-foreground hover:bg-accent/50 hover:text-primary"
        >
          <MessageCircleMore className="size-5" />
          <span className="text-sm font-medium ">
            {comments}
          </span>
        </button>
      </div>
    </>
  );
};

export default Action;
