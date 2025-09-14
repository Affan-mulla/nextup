import { Dot } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

interface IdeaProps {
  username: string;
  time: string;
  avatar: string;
  product: string;
}

const UserDetail = ({ username, product, time, avatar }: IdeaProps) => {

  const timeAgo = (date: Date) => {
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
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
  }
  return (
    <div className="flex items-center gap-3 font-inter">
      {/* Avatar */}
      <Link href={`/p/${product}`} className="shrink-0">
        <Image
          src={avatar}
          alt={`${username} avatar`}
          width={36}
          height={36}
          className="rounded-full border border-neutral-800"
        />
      </Link>

      {/* Details */}
      <div className="flex flex-col leading-tight">
        <span className="flex items-center gap-1 text-sm text-neutral-400">
          <Link
            href={`/p/${product}`}
            className="text-neutral-200 font-medium hover:text-white transition-colors"
          >
            p/{product}
          </Link>
          <Dot className="w-4 h-4 text-neutral-500" />
          <span className="text-xs text-neutral-500">{timeAgo(new Date(time))}</span>
        </span>

        <Link
          href={`/u/${username}`}
          className="text-xs text-neutral-500 hover:text-neutral-300 transition-colors w-fit"
        >
          @{username}
        </Link>
      </div>
    </div>
  );
};

export default UserDetail;
