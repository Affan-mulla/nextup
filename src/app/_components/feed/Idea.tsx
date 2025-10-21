"use client";
import Image from "next/image";
import React from "react";
import IdeaHeader from "./IdeaHeader";
import IdeaContent from "./IdeaContent";
import Action from "./Action";
import { useIsMobile } from "@/utils/use-mobile";
import { IdeaType } from "@/types/api-data-types";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";

const Idea = ({idea,className} : {idea : IdeaType,className ?: string}) => {
  const mobile = useIsMobile();

  const router = useRouter();
  return (
    <div className={cn(`w-full flex p-3 gap-4 border-b cursor-pointer hover:bg-accent/20 duration-200 ${className}`)}
    onClick={() => {
      router.push(`/idea/${idea.id}`);
    }}>

      {/* Feature Content Box*/}
      <div className="flex flex-1 md:px-6 justify-between md:gap-0 gap-4 w-full ">
        {/* Feature Content */}
        <div className="flex flex-col gap-1 flex-1  ">
          <IdeaHeader
            username={idea.author.name}
            time={formatDistanceToNow(idea.createdAt)}
            avatar={idea.author.image || "/Placeholder.svg"}
          />
          <IdeaContent 
            votes={idea.votesCount} 
            comments={idea._count.comments}
            heading={idea.title}
            isMobile={mobile}
            ideaId={idea.id}
            userVote={idea.userVote}
          />
        </div>

        {mobile === false && (
          <div className="md:gap-3 gap-2 md:mt-3 justify-between  items-center hidden md:flex">
            <Action 
              ideaId={idea.id}
              votes={idea.votesCount} 
              comments={idea._count.comments} 
              userVote={idea.userVote}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Idea;