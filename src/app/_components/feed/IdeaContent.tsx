import { Button } from "@/components/ui/button";
import React from "react";
import Action from "./Action";

const IdeaContent = ({heading, isMobile}: {heading: string, isMobile: boolean}) => {
  
  return (
    <div>
      <h1 className=" font-outfit md:text-xl ">
        {heading}
      </h1>
      <div className="flex gap-2 mt-2 font-inter">
        <Button variant={"ghost"} className="text-xs ">
          Save
        </Button>
        <Button variant={"ghost"} className="text-xs">
          Share
        </Button>
         {
          isMobile && <Action />
         }
      </div>
    </div>
  );
};

export default IdeaContent;
