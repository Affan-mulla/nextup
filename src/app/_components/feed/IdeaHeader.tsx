import { Dot } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

interface IdeaProps {
    username: string;
    time: string;
    avatar: string;
}

const IdeaHeader = ({username , time,avatar} : IdeaProps) => {
  return (
    <div className="flex font-inter text-xs text-muted-foreground font-semibold items-center">
      <Link
        href={`/u/${username}`}
        className="flex items-center hover:underline hover:text-primary duration-200 transition-colors"
      >
        <Image
          src={avatar || "/Placeholder.svg"}
          className="mr-2 rounded-full"
          alt=""
          width={20}
          height={20}
        />
        <p className="text-muted-foreground">u/{username}</p>
      </Link>
      <Dot className="text-muted-foreground" />
      <p className="text-muted-foreground">{time}</p>
    </div>
  );
};

export default IdeaHeader;
