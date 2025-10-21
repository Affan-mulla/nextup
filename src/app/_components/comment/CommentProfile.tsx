import React, { useState } from "react";
import CommentVotes from "./CommentVotes";
import { CommentResponse } from "@/types/commentInterface";
import { formatDistanceToNow } from "date-fns";
import { useStore } from "@/store/store";
import { useCommentVote } from "@/hooks/useCommentVote";
import { DeleteCommentDialog } from "./DeleteCommentDialog";
import { useDeleteComment } from "@/hooks/useCommentDelete";
import { toast } from "sonner";
import Link from "next/link";
import { useRouter } from "next/navigation";

const CommentProfile = ({ comment }: { comment: CommentResponse }) => {
  const { user } = useStore();
  const [votesCount, setVotesCount] = useState(comment.votesCount);
  const [userVote, setUserVote] = useState(comment.votes);
  const [localIsDeleted, setLocalIsDeleted] = useState(comment.isDeleted);
  const { vote, isVoting } = useCommentVote();
  const { deleteComment, isDeleting } = useDeleteComment();
  const router = useRouter();

  const handleVote = async (type: "UP" | "DOWN", e?: React.MouseEvent) => {
    e?.stopPropagation(); // 👈 Prevent parent navigation
    const result = await vote(comment.id, type);
    if (result) {
      if (result.message === "Vote removed") {
        setUserVote(null);
        setVotesCount((prev) => prev + (type === "UP" ? -1 : 1));
      } else {
        const { votesCount: newVotesCount, votes } = result;
        setVotesCount(newVotesCount);
        setUserVote(votes[0]?.type || null);
      }
    }
  };

  const handleDelete = async (e?: React.MouseEvent) => {
    e?.stopPropagation(); // 👈 Prevent redirect
    try {
      setLocalIsDeleted(true);
      const res = await deleteComment(comment.id, user.id);
      if (res?.success) toast.success("Comment deleted");
      else {
        setLocalIsDeleted(false);
        throw new Error(res?.error || "Failed to delete comment");
      }
    } catch (error) {
      console.error("Error deleting comment:", error);
      toast.error("Failed to delete comment");
      setLocalIsDeleted(false);
    }
  };

  const handleNavigate = () => router.push(`/idea/${comment.idea.id}`);

  return (
    <div className="py-1 border-t border-border last:border-b">
      <div
        className="space-y-1 hover:bg-card transition-colors duration-200 rounded-xl md:p-4 py-4  cursor-pointer"
        onClick={(e) => {
          const target = e.target as HTMLElement;
          if (
            target.closest("button") ||
            target.closest("a") ||
            target.closest("[role='dialog']")
          )
            return; // 👈 ignore click if interacting with buttons/links
          handleNavigate();
        }}
      >
        <div className="flex justify-between items-center">
          <h2
            onClick={handleNavigate}
            className="font-outfit font-semibold hover:text-primary"
          >
            {comment.idea.title}
          </h2>
        </div>

        <div>
          {comment.parent ? (
            <div className="flex gap-1 text-sm items-end flex-wrap">
              <Link
                href={`/u/${comment.user.username}`}
                className="font-outfit font-semibold hover:text-primary"
                onClick={(e) => e.stopPropagation()}
              >
                {comment.user.username}
              </Link>
              <p className="text-muted-foreground font-inter text-xs">replied to</p>
              <Link
                href={`/u/${comment.parent.user.username}`}
                className="font-outfit font-semibold hover:text-primary"
                onClick={(e) => e.stopPropagation()}
              >
                {comment.parent.user.username}
              </Link>
              <p className="text-xs text-muted-foreground font-inter">
                {formatDistanceToNow(new Date(comment.createdAt), {
                  addSuffix: true,
                })}
              </p>
            </div>
          ) : (
            <h4 className="font-outfit font-semibold">
              {comment.user.username}{" "}
              <span className="text-xs font-light text-muted-foreground font-inter">
                Commented{" "}
                {formatDistanceToNow(new Date(comment.createdAt), {
                  addSuffix: true,
                })}
              </span>
            </h4>
          )}
        </div>

        <div className="flex gap-2 flex-col">
          <p className="text-inter text-sm">{comment.content}</p>
          <div className="flex gap-2 items-center">
            <CommentVotes
              votesCount={votesCount}
              userVote={userVote}
              handleVote={handleVote}
              isVoting={isVoting}
              initialVotesCount={comment.votesCount}
              localIsDeleted={localIsDeleted}
            />
            {user?.id === comment.user.id && !localIsDeleted && (
              <DeleteCommentDialog
                onDelete={handleDelete}
                isDeleting={isDeleting}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommentProfile;
