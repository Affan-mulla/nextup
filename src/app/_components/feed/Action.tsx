import { ArrowBigDownDash, ArrowBigUpDash, MessageCircleMore } from "lucide-react";
import React from "react";

const Action = () => {
  return (
    <>
      {/* Voting */}
      <div className="flex items-center gap-2 rounded-2xl bg-card md:p-2 p-1 shadow-sm border border-border">
        {/* Upvote */}
        <button className="flex flex-col items-center justify-center rounded-xl md:p-2 p-1 hover:bg-muted transition">
          <ArrowBigUpDash className="size-5 text-muted-foreground hover:text-green-500" />
        </button>

        {/* Vote Count */}
        <span className="text-sm font-medium text-foreground">128</span>

        {/* Downvote */}
        <button className="flex flex-col items-center justify-center rounded-xl md:p-2 p-1 hover:bg-muted transition">
          <ArrowBigDownDash className="size-5 text-muted-foreground hover:text-red-500" />
        </button>
      </div>

      {/* Comments */}
      <div className="items-center rounded-2xl bg-card md:p-2 p-1 shadow-sm w-fit border border-border hidden md:flex">
        {/* Comment Button */}
        <button className="group flex items-center gap-2 rounded-xl bg-card md:px-3 px-2 md:py-2 py-1 transition-all duration-200 ease-out hover:scale-105 active:scale-95 ">
          <MessageCircleMore className="size-5 text-muted-foreground transition-colors group-hover:text-primary" />
          <span className="text-sm font-medium text-muted-foreground transition-colors group-hover:text-primary">
            100
          </span>
        </button>
      </div>
    </>
  );
};

export default Action;
