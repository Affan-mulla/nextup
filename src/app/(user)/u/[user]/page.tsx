"use client";
import Idea from "@/app/_components/feed/Idea";
import Loader from "@/components/Loader";
import { IdeaType } from "@/types/api-data-types";
import axios from "axios";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const PostsPage = () => {
  const username = usePathname()?.split("/")[2] ?? "";

  const [posts, setPosts] = useState<IdeaType[]>([]);
  const [loading, setLoading] = useState(false);

  const getPost = async () => {
    if (!username) return;
    setLoading(true);
    try {
      const res = await axios.get(`/api/user/get-posts`, { params: { username } });

      if (res.status === 200) {
        setPosts(res.data as IdeaType[]);
      }
    } catch (error) {
      console.error("getPost", error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getPost();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [username]);

  if (loading) return <Loader />

  if (!posts.length) return <div className="text-muted-foreground">No posts yet.</div>;

  return (
    <div className="flex flex-col">
      {posts.map((p) => (
        <Idea key={p.id} idea={p}  />
      ))}
    </div>
  );
};

export default PostsPage;