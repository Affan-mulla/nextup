"use client";
import Image from "next/image";
import React from "react";
import IdeaHeader from "./IdeaHeader";
import IdeaContent from "./IdeaContent";
import Action from "./Action";
import { useIsMobile } from "@/utils/use-mobile";
import { IdeaType } from "@/types/api-data-types";
import { useRouter } from "next/navigation";

const Idea = ({idea} : {idea : IdeaType}) => {
  const mobile = useIsMobile();
  const timeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    if (seconds < 60) return `${seconds} seconds ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} minutes ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hours ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days} days ago`;
    const weeks = Math.floor(days / 7);
    if (weeks < 4) return `${weeks} weeks ago`;
    const months = Math.floor(weeks / 4);
    if (months < 12) return `${months} months ago`;
    const years = Math.floor(months / 12);
    return `${years} years ago`;
  };
  const router = useRouter();
  return (
    <div className="w-full min-h-[100px] flex p-3 gap-4 border-b cursor-pointer hover:bg-accent/20 duration-200"
    onClick={() => {
      router.push(`/idea/${idea.id}`);
    }}>

      {/* Feature Content Box*/}
      <div className="flex flex-1 md:px-6 justify-between md:gap-0 gap-4 w-full ">
        {/* Feature Content */}
        <div className="flex flex-col gap-1 flex-1  ">
          <IdeaHeader
            username={idea.author.name}
            time={timeAgo(idea.createdAt.toString())}
            avatar={idea.author.image || "AvatarPlaceholder.png"}
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