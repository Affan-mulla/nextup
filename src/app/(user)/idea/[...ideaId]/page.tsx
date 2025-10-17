"use client";
import EnhancedDescriptionDisplay from "@/app/_components/Idea/EnhancedDescriptionDisplay";
import UserDetail from "@/app/_components/Idea/UserDetail";
import Action from "@/app/_components/feed/Action";
import Loader from "@/components/kokonutui/loader";
import { Button } from "@/components/ui/button";
import { useStore } from "@/store/store";
import axios from "axios";
import { SerializedEditorState } from "lexical";
import { ArrowLeft, Ellipsis } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import useSWR, { SWRResponse } from "swr";

const fetcher = (url: string, ideaId: string) =>
  axios.get(url, { params: { ideaId } }).then((res) => res.data);

interface IdeaData {
  id: string;
  title: string;
  company: {
    name: string;
    logoUrl: string;
  };
  description?: SerializedEditorState;
  createdAt: string;
  status: string;
  votesCount: number;
  userVote?: "UP" | "DOWN" | null;
  author: {
    name: string;
  };
  _count: {
    comments: number;
  };
}

const Page = () => {
   const ideaId = usePathname()?.split("/").pop();
  const { ideas, addIdea } = useStore(); // make sure you have addIdea() in your store

  // 1️⃣ Try getting it from local store first
  const cachedIdea = ideas.find(idea => idea.id === ideaId);

  // 2️⃣ If not cached, fetch from API with SWR
  const { data, error, isLoading } = useSWR(
    !cachedIdea && ideaId ? [`/api/idea/get-idea`, ideaId] : null,
    ([url, id]) => fetcher(url, id),
    {
      revalidateOnFocus: false,
      dedupingInterval: 1000 * 60 * 5,
      onSuccess: (freshData) => {
        // store in Zustand for later reuse
        addIdea(freshData);
      },
    }
  );

  const idea = cachedIdea || data;

  if (isLoading && !idea) return <Loader size="sm" />;
  if (error && !idea)
    return (
      <div>
        <h1>Something went wrong</h1>
      </div>
    );

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          {/* Left side: back + user/product */}
          <div className="flex items-center gap-3">
            <Link
              href="/feed"
              className="p-2 rounded-full bg-muted transition-colors hover:bg-muted/80"
            >
              <ArrowLeft size={22} />
            </Link>

            <UserDetail
              product={idea?.company.name || ""}
              username={idea?.author.name || ""}
              time={  idea?.createdAt || ""}
              avatar={idea?.company.logoUrl || "../Placeholder.svg"}
            />
          </div>

          {/* Right side: voting and options */}
          <div className="flex items-center gap-2">
            <Action
              ideaId={idea.id}
              votes={idea.votesCount}
              comments={idea._count.comments}
              userVote={idea.userVote}
            />
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full hover:bg-muted transition-colors"
            >
              <Ellipsis size={20} />
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <main className="bg-card rounded-xl border border-border/50 p-6 shadow-sm">
          {/* Title */}
          <h1 className="text-3xl font-outfit font-semibold mb-6 leading-tight">
            {idea?.title || "Title"}
          </h1>

          {/* Description */}
          <div className="prose prose-neutral max-w-none">
            <EnhancedDescriptionDisplay content={idea?.description} />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Page;
