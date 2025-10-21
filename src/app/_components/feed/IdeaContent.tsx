import { Button } from "@/components/ui/button";
import React from "react";
import Action from "./Action";
const IdeaContent = ({heading, isMobile, votes, comments, ideaId, userVote}: {
  heading: string, 
  isMobile: boolean, 
  votes?: number, 
  comments?: number,
  ideaId?: string,
  userVote?: "UP" | "DOWN" | null 
}) => {
  
  return (
    <div>
      <h1 className=" font-outfit md:text-xl ">
        {heading}
      </h1>
      <div className="flex gap-2 mt-2 font-inter items-center justify-between">
        <div className="flex gap-2">
          <Button 
            variant={"ghost"} 
            className="text-xs rounded-full hover:bg-accent/50"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              // TODO: Handle save functionality
            }}
          >
            Save
          </Button>
          <Button 
            variant={"ghost"} 
            className="text-xs rounded-full hover:bg-accent/50"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              // TODO: Handle share functionality
            }}
          >
            Share
          </Button>
        </div>
        {
          isMobile && ideaId && (
            <div className="flex-shrink-0">
              <Action 
                ideaId={ideaId}
                votes={votes || 0} 
                comments={comments || 0} 
                userVote={userVote}
              />
            </div>
          )
        }
      </div>
    </div>
  );
};

export default IdeaContent;
