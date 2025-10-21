import { Button } from "@/components/ui/button";
import { ArrowBigDownDash, ArrowBigUpDash, MessageSquare, Trash, User } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";
import CommentForm from "./CommentForm";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { useCommentVote } from "@/hooks/useCommentVote";
import { useStore } from "@/store/store";
import { toast } from "sonner";
import { useDeleteComment } from "@/hooks/useCommentDelete";
import { DeleteCommentDialog } from "./DeleteCommentDialog";
import CommentVotes from "./CommentVotes";

interface CommentProps {
  id: string;
  content: string;
  createdAt: Date;
  user: {
    username: string;
    image: string | null;
    id: string;
  };
  ideaId: string;
  votesCount: number;
  isDeleted?: boolean;
  userVote?: "UP" | "DOWN" | null;
  replies?: CommentProps[];
  isReply?: boolean;
}

const Comment = ({ 
  id, 
  content, 
  createdAt, 
  user, 
  ideaId, 
  votesCount: initialVotesCount = 0, 
  userVote: initialUserVote, 
  replies = [], 
  isReply = false,
  isDeleted = false 
}: CommentProps) => {
  const [isReplying, setIsReplying] = useState(false);
  const [showReplies, setShowReplies] = useState(true);
  const [votesCount, setVotesCount] = useState(initialVotesCount);
  const [userVote, setUserVote] = useState(initialUserVote);
  const [localIsDeleted, setLocalIsDeleted] = useState(isDeleted);
  const { vote, isVoting } = useCommentVote();
  const {user : currentUser} = useStore();
  const {deleteComment,isDeleting} = useDeleteComment();
  
  const toggleReply = () => {
    setIsReplying(!isReplying);
  };

  const handleVote = async (type: "UP" | "DOWN") => {
    const result = await vote(id, type);
    if (result) {
      if (result.message === "Vote removed") {
        // Vote was removed
        setUserVote(null);
        setVotesCount(prev => prev + (type === "UP" ? -1 : 1));
      } else {
        // Vote was added or changed
        const { votesCount: newVotesCount, votes } = result;
        setVotesCount(newVotesCount);
        setUserVote(votes[0]?.type || null);
      }
    }
  };

  const handleDelete = async () => {
    try {
      // Optimistically update UI
      setLocalIsDeleted(true);
      
      const res = await deleteComment(id, currentUser.id);
      if (res?.success) {
        toast.success('Comment deleted');
      } else {
        // Revert optimistic update on failure
        setLocalIsDeleted(false);
        throw new Error(res?.error || 'Failed to delete comment');
      }
    } catch (error) {
      console.error('Error deleting comment:', error);
      toast.error('Failed to delete comment');
      setLocalIsDeleted(false);
    }
  };


  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`${isReply ? 'ml-8 mt-3 border-l-2 border-border/40 pl-4' : 'mb-2 pb-4'}`}
    >
      <div className="space-y-2">
        <div className="flex gap-2 items-center">
          <Avatar className="h-8 w-8">
            {user.image ? (
              <AvatarImage src={user.image} alt={user.username} />
            ) : (
              <AvatarFallback>
                <User className="w-4 h-4 text-muted-foreground" />
              </AvatarFallback>
            )}
          </Avatar>
          <div className="flex gap-2 items-center">
            <Link href={`/u/${user.username}`}>
              <h3 className="hover:text-primary font-outfit text-sm font-medium transition-colors duration-200">
                {user.username}
              </h3>
            </Link>
            <span className="text-xs text-muted-foreground">
              {formatDistanceToNow(new Date(createdAt), { addSuffix: true })}
            </span>
          </div>
        </div>
        <div className="space-y-2">
          <p className="font-inter text-sm pl-10 text-muted-foreground">{localIsDeleted ? 'Comment deleted by user' : content}</p>
          <div className="flex gap-3 pl-10">
            <CommentVotes votesCount={votesCount} userVote={userVote} handleVote={handleVote} isVoting={isVoting} initialVotesCount={initialVotesCount} localIsDeleted={localIsDeleted} />
            <Button
              variant={"ghost"}
              size="sm"
              className="text-xs h-7 px-2"
              onClick={toggleReply}
              disabled={localIsDeleted}
            >
              <MessageSquare className="size-3 mr-1" />
              Reply
            </Button>
            {
                currentUser?.id === user.id && !localIsDeleted && (
                  <DeleteCommentDialog
                    onDelete={handleDelete}
                    isDeleting={isDeleting}
                  />
                )
            }
          </div>
        </div>

        <AnimatePresence>
          {isReplying && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="pl-10"
            >
              <CommentForm ideaId={ideaId} commentId={id} onSuccess={() => setIsReplying(false)} />
            </motion.div>
          )}
        </AnimatePresence>

        {replies.length > 0 && (
          <div className="pl-10">
            <Button
              variant="ghost"
              size="sm"
              className="text-xs h-7 px-2 mb-2"
              onClick={() => setShowReplies(!showReplies)}
            >
              {showReplies ? "Hide" : "Show"} {replies.length} {replies.length === 1 ? "reply" : "replies"}
            </Button>

            <AnimatePresence>
              {showReplies && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  {replies.map((reply) => (
                    <Comment
                      key={reply.id}
                      {...reply}
                      ideaId={ideaId}
                      isReply={true}
                    />
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default Comment;
