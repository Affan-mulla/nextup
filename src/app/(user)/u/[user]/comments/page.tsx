"use client";
import CommentProfile from "@/app/_components/comment/CommentProfile";
import Loader from "@/components/Loader";
import { useProfile } from "@/context/profile";
import { CommentResponse } from "@/types/commentInterface";
import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "sonner";



const CommentsPage = () => {
  const [comments, setComments] = useState<CommentResponse[]>([]);
  const {userData} = useProfile();

  const getComment = async () => {
    if (!userData?.id) return;
    try {
      const res = await axios.get(`/api/comment/get-user-comments`, { params: { userId: userData.id } });
      if (res.status === 200) {
        setComments(res.data);
      }
      console.log(res.data);
    } catch (error) {
      console.error("getPost", error);
      toast.error("Something went wrong");
    }
  }

  useEffect(() => {
    getComment();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userData]);

  if(!userData) return <Loader />;

  return (
    <div className="">
      <h2 className="text-xl font-semibold mb-4">Your Comments</h2>
     {
      comments.length > 0 ? (
        comments.map((comment) => <CommentProfile key={comment.id} comment={comment} />)
      ) : (
        <div className="text-muted-foreground">No comments yet.</div>
      )
     }
    </div>
  );
};

export default CommentsPage;