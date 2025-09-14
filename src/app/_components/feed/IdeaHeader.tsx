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
    <div className="flex font-inter text-xs text-neutral-500 font-semibold items-center">
      <Link
        href={`/u/${username}`}
        className="flex items-center hover:underline hover:text-primary duration-200 transition-colors"
      >
        <Image
          src={avatar}
          className="mr-2"
          alt=""
          width={18}
          height={18}
        />
        <p>u/{username}</p>
      </Link>
      <Dot />
      <p>{time}</p>
    </div>
  );
};

export default IdeaHeader;
