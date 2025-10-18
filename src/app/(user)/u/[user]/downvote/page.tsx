"use client";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import Idea from "@/app/_components/feed/Idea";
import Loader from "@/components/Loader";
import { useProfile } from "@/context/profile";

interface DownvotedPost {
  id: string;
  title: string;
  description: string;
  status: string;
  createdAt: string;
  votesCount: number;
  author: { name: string; image: string | null; username?: string };
  company: { name: string; logoUrl: string | null };
  _count: { comments: number };
}

const DownvotePage = () => {
  const username = usePathname()?.split("/")[2] ?? "";
  const [posts, setPosts] = useState<DownvotedPost[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!username) return;
    setLoading(true);
    axios
      .get(`/api/user/get-votes`, { params: { username, type: "DOWN" } })
      .then((res) => setPosts(res.data))
      .catch(() => setPosts([]))
      .finally(() => setLoading(false));
  }, [username]);

  // Show not-allowed message to non-owners if they somehow navigated here directly
  const { userData, isOwner } = useProfile();

  if(loading) return <Loader />

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold mb-4">Posts You've Downvoted</h2>
      { userData && isOwner === false ? (
        <div className="text-destructive">Not allowed — you can only view downvoted posts on your own profile.</div>
      ) : posts.length === 0 ? (
        <div className="text-muted-foreground">No downvoted posts yet.</div>
      ) : (
        posts.map((post) => {
          // If API returns { idea: {...} }, extract idea
          const ideaData = (post as any).idea || post;
          const idea = {
            ...ideaData,
            createdAt: ideaData.createdAt ? new Date(ideaData.createdAt) : new Date(),
            description: typeof ideaData.description === "string" ? ideaData.description : JSON.stringify(ideaData.description),
            userVote: "DOWN" as const,
          };
          return <Idea key={idea.id} idea={idea} />;
        })
      )}
    </div>
  );
};

export default DownvotePage;
