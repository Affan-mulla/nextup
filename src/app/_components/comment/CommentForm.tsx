"use client";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Loader2, Send, User } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { CommentType } from "@/lib/validation";
import { useStore } from "@/store/store";
import { toast } from "sonner";
import axios from "axios";

interface CommentFormProps {
  ideaId: string;
  commentId?: string;
  onSuccess?: () => void;
  isReply?: boolean;
}

export default function CommentForm({ ideaId, commentId, onSuccess, isReply = false }: CommentFormProps) {
  const { user: currentUser } = useStore();
  const [isOpen, setIsOpen] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting, errors },
  } = useForm<CommentType>({
    defaultValues: {
      comment: "",
      ideaId: ideaId || "",
      userId: currentUser?.id || "",
      commentId: commentId || "",
    },
  });

  const onSubmit = async (data: CommentType) => {
    try {
      const res = await axios.post("/api/comment/upload-comment", data);

      if (res.status === 200) {
        toast.success(commentId ? "Reply added successfully" : "Comment added successfully");
        reset();
        setIsOpen(false);
        onSuccess?.();
      }
    } catch (error) {
      toast.error(commentId ? "Error adding reply" : "Error adding comment");
    }
  };

  const handleCancel = () => {
    reset();
    setIsOpen(false);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={isReply ? "" : "mt-4"}>
      <div className={`rounded-2xl ${isReply ? 'bg-background/50' : 'bg-card/20'} shadow-sm border border-border/60 overflow-hidden flex flex-col items-center gap-2 px-2 py-3`}>
        <div className="flex items-center w-full gap-3 px-2">
          <Avatar className="h-8 w-8">
            {currentUser?.image ? (
              <AvatarImage src={currentUser.image} alt={currentUser.name || ""} className="object-cover" />
            ) : (
              <AvatarFallback>
                <User className="w-4 h-4 text-muted-foreground" />
              </AvatarFallback>
            )}
          </Avatar>
          <input
            autoComplete="off"
            type="text"
            placeholder={commentId ? "Write a reply..." : "Write a comment..."}
            {...register("comment", { required: true })}
            onFocus={() => setIsOpen(true)}
            className="w-full px-4 py-2 text-sm bg-background focus:outline-none rounded-xl border border-border focus:ring-2 focus:ring-primary/30 transition-all"
          />
        </div>
        {errors.comment && (
          <span className="text-red-500 w-full pl-14 text-xs">This field is required</span>
        )}

        <AnimatePresence>
          {isOpen && (
            <motion.div
              className="flex gap-4 items-center w-full px-2 py-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="text-xs h-7 px-3"
                onClick={handleCancel}
              >
                Cancel
              </Button>

              <Button
                type="submit"
                disabled={isSubmitting}
                size="sm"
                className="text-xs h-7 px-3 bg-primary/90 hover:bg-primary/100 transition-all flex gap-2 items-center"
              >
                {isSubmitting ? (
                  <Loader2 className="w-3 h-3 animate-spin" />
                ) : (
                  <>
                    <Send className="w-3 h-3" />
                    {commentId ? "Reply" : "Comment"}
                  </>
                )}
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </form>
  );
}
