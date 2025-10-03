"use client";
import Image from "next/image";
import React from "react";
import IdeaHeader from "./IdeaHeader";
import IdeaContent from "./IdeaContent";
import Action from "./Action";
import { useIsMobile } from "@/utils/use-mobile";

const Idea = () => {
  const mobile = useIsMobile();
  return (
    <div className="w-full min-h-[100px] flex p-3 gap-4 border-b">
      {/* Feature Image */}
      <div className="md:h-[100px] md:w-[100px] h-[70px] w-[70px] flex-shrink-0 flex justify-center items-center rounded-xl border overflow-hidden relative bg-muted/30 backdrop-blur-sm">
        <Image
          src="IdeaImgPlaceholder.svg"
          alt="Idea thumbnail"
          width={100}
          height={100}
          className={`object-cover transition-all
      ${
        "IdeaImgPlaceholder.svg".includes("Placeholder")
          ? "w-1/2 h-1/2 object-contain" // small, centered for placeholder
          : "w-full h-full object-cover" // normal image
      }`}
        />
      </div>

      {/* Feature Content Box*/}
      <div className="flex flex-1 justify-between md:gap-0 gap-4 ">
        {/* Feature Content */}
        <div className="flex flex-col gap-2">
          <IdeaHeader
            username="username"
            time="2h ago"
            avatar="Placeholder.svg"
          />
          <IdeaContent
            heading="Create a Theme Switcher Component with Tailwind and shadcn."
            isMobile={mobile}
          />
        </div>

        {mobile === false && (
          <div className="md:gap-3 gap-2 md:mt-3 justify-between  items-center hidden md:flex">
            <Action />
          </div>
        )}
      </div>
    </div>
  );
};

export default Idea;
