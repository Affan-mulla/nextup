"use client";
import WrapperDescriptionDisplay from "@/app/_components/Idea/DescriptionDisplay";
import UserDetail from "@/app/_components/Idea/UserDetail";
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
  title: string;
  company: {
    name: string;
    logoUrl: string;
  };
  description?: SerializedEditorState;
  createdAt: string;
  status: string;
  author: {
    name: string;
  };
}

const Page = () => {
  const [loading, setLoading] = useState(true);
  const ideaId = usePathname()?.split("/").pop();
 
  const [data, setData] = useState<IdeaData>({
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
    productId: "",
    createdAt: "",
    status: "",
    author: {
      name: "",
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
    <div className="md:px-6 px-3 py-4 w-full h-full">
      <div className="md:px-4 px-2 flex flex-col gap-4 h-full">
        {/* Header */}
        <div className="flex items-center justify-between flex-shrink-0">
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

          {/* Right side: options */}
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full hover:bg-neutral-800 transition-colors"
          >
            <Ellipsis size={20} />
          </Button>
        </div>

        {/* Main Content */}
        <main className="flex flex-col h-full">
          {/* Title */}
          <h1 className="text-2xl font-outfit flex-shrink-0">
            {data?.title || "Title"}
          </h1>

          {/* Scrollable Description */}
          <div className="mt-4 flex-1 overflow-hidden">
            <ScrollArea className="h-full w-full">
              <WrapperDescriptionDisplay content={data?.description} />
              <ScrollBar orientation="vertical" />
            </ScrollArea>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Page;
