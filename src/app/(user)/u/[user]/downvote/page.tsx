"use client";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import Idea from "@/app/_components/feed/Idea";
import Loader from "@/components/Loader";
import { useProfile } from "@/context/profile";

interface Author {
  name: string;
  image: string | null;
  username?: string;
}

interface Company {
  name: string;
  logoUrl: string | null;
}

interface DownvotedPost {
  id: string;
  title: string;
  description: string | object;
  status: string;
  createdAt: string;
  votesCount: number;
  author: Author;
  company: Company;
  _count: { comments: number };
  idea?: DownvotedPost; // handle nested idea
}

const DownvotePage = () => {
  const pathname = usePathname();
  const username = pathname ? pathname.split("/")[2] : "";
  const [posts, setPosts] = useState<DownvotedPost[]>([]);
  const [loading, setLoading] = useState(false);

  const { userData, isOwner } = useProfile();

  useEffect(() => {
    if (!username) return;
    setLoading(true);
    axios
      .get<DownvotedPost[]>(`/api/user/get-votes`, { params: { username, type: "DOWN" } })
      .then((res) => setPosts(res.data))
      .catch(() => setPosts([]))
      .finally(() => setLoading(false));
  }, [username]);

  if (loading) return <Loader />;

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold mb-4">Posts You&#39;ve Downvoted</h2>
      {userData && isOwner === false ? (
        <div className="text-destructive">
          Not allowed — you can only view downvoted posts on your own profile.
        </div>
      ) : posts.length === 0 ? (
        <div className="text-muted-foreground">No downvoted posts yet.</div>
      ) : (
        posts.map((post) => {
          const ideaData = post.idea ?? post;
          const idea = {
            ...ideaData,
            createdAt: new Date(ideaData.createdAt),
            description:
              typeof ideaData.description === "string"
                ? ideaData.description
                : JSON.stringify(ideaData.description),
            userVote: "DOWN" as const,
          };
          return <Idea key={idea.id} idea={idea} />;
        })
      )}
    </div>
  );
};

export default DownvotePage;
