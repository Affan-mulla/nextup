import { Button } from "@/components/ui/button";
import React from "react";
import Action from "./Action";
const IdeaContent = ({heading, isMobile ,votes, comments}: {heading: string, isMobile: boolean, votes?: number, comments?: number}) => {
  
  return (
    <div>
      <h1 className=" font-outfit md:text-xl ">
        {heading}
      </h1>
      <div className="flex gap-2 mt-2 font-inter ">
        <Button variant={"ghost"} className="text-xs rounded-full">
          Save
        </Button>
        <Button variant={"ghost"} className="text-xs rounded-full">
          Share
        </Button>
         {
          isMobile && <Action votes={votes || 0} comments={comments || 0} />
         }
      </div>
    </div>
  );
};

export default IdeaContent;
