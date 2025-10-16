"use client";
import EnhancedDescriptionDisplay from "@/app/_components/Idea/EnhancedDescriptionDisplay";
import UserDetail from "@/app/_components/Idea/UserDetail";
import Action from "@/app/_components/feed/Action";
import Loader from "@/components/kokonutui/loader";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import axios from "axios";
import { SerializedEditorState } from "lexical";
import { ArrowLeft, Ellipsis } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

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
  const [loading, setLoading] = useState(true);
  const ideaId = usePathname()?.split("/").pop();
 
  const [data, setData] = useState<IdeaData>({
    id: "",
    title: "",
    company: {
      name: "",
      logoUrl: "",
    },
    description: {
      root: {
        type: "root",
        format: "",
        indent: 0,
        version: 1,
        children: [
          {
            type: "paragraph",
            //@ts-expect-error no idea why it yells at me here
            format: "",
            indent: 0,
            version: 1,
            children: [
              {
                mode: "normal",
                text: "Dummy description",
                type: "text",
                style: "",
                detail: 0,
                format: 0,
                version: 1,
              },
            ],
            direction: "ltr",
            textStyle: "",
            textFormat: 0,
          },
        ],
        direction: "ltr",
      },
    },
    createdAt: "",
    status: "",
    votesCount: 0,
    userVote: null,
    author: {
      name: "",
    },
    _count: {
      comments: 0,
    },
  });

  const getIdea = async () => {
    try {
      const { data: res, status } = await axios.get("/api/idea/get-idea", {
        params: { ideaId },
      });
      console.log(res);
      if (status === 200) {
        setData(res);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getIdea();
  }, [ideaId]);

  if (loading) {
    return <Loader size="sm" />;
  }
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
              product={data?.company.name || ""}
              username={data?.author.name || ""}
              time={data?.createdAt || ""}
              avatar={data?.company.logoUrl || "../Placeholder.svg"}
            />
          </div>

          {/* Right side: voting and options */}
          <div className="flex items-center gap-2">
            <Action 
              ideaId={data.id}
              votes={data.votesCount} 
              comments={data._count.comments} 
              userVote={data.userVote}
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
            {data?.title || "Title"}
          </h1>

          {/* Description */}
          <div className="prose prose-neutral max-w-none">
            <EnhancedDescriptionDisplay content={data?.description} />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Page;
