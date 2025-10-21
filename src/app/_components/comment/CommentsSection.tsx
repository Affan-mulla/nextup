"use client";
import useSWR from "swr";
import axios from "axios";
import Comment from "@/app/_components/comment/comment";
import { CommentData } from "./types";
import { toast } from "sonner";
import Loader from "@/components/Loader";

const fetcher = (url: string, ideaId: string) =>
  axios.get(url, { params: { ideaId } }).then((res) => res.data);

const addIdeaIdToReplies = (comments: CommentData[], ideaId: string): CommentData[] => {
  return comments.map(comment => ({
    ...comment,
    ideaId,
    replies: comment.replies ? addIdeaIdToReplies(comment.replies, ideaId) : undefined
  }));
};


export default function CommentsSection({ ideaId }: { ideaId: string }) {
  const { data: comments, error, mutate } = useSWR<CommentData[]>(
    [`/api/comment/get-comment`, ideaId],
    ([url, id]: [string, string]) => fetcher(url, id),
    {
      refreshInterval: 7000,
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      onError: (err) => {
        console.error("Error fetching comments:", err);
        toast.error("Failed to load comments. Please refresh the page.");
      }
    }
  );

  if (error) {
    return (
      <div className="my-4 text-center text-muted-foreground">
        Error loading comments
      </div>
    );
  }

  if (!comments) {
    return (
      <div className="my-4 flex justify-center">
       <Loader/>
      </div>
    );
  }
  

  const commentsWithIdeaId = addIdeaIdToReplies(comments, ideaId);

  return (
    <div className="my-6 space-y-4">
      {commentsWithIdeaId.length === 0 ? (
        <div className="text-center text-muted-foreground">
          No comments yet. Be the first to comment!
        </div>
      ) : (
        commentsWithIdeaId.map((comment) => (
          <Comment key={comment.id} {...comment}  />
        ))
      )}
    </div>
  );
}