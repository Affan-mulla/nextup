"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const CommentsPage = () => {
  const username = usePathname()?.split("/")[2];
  const userComments = [
    {
      id: 1,
      postTitle: "The Future of Web Development",
      postAuthor: "techexpert",
      comment: "Really insightful post! I especially agree with the points about AI integration.",
      upvotes: 23,
      timestamp: "3 hours ago"
    },
    {
      id: 2,
      postTitle: "Understanding React 19",
      postAuthor: "reactmaster",
      comment: "The new concurrent features are game-changing. Great explanation!",
      upvotes: 15,
      timestamp: "5 hours ago"
    },
    {
      id: 3,
      postTitle: "TypeScript Best Practices",
      postAuthor: "typescript_guru",
      comment: "I've been using these patterns in my projects. They really improve code quality.",
      upvotes: 8,
      timestamp: "1 day ago"
    }
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold mb-4">Your Comments</h2>
      {userComments.map((comment) => (
        <div key={comment.id} className="bg-card rounded-lg p-6 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <Image
                  src="/Placeholder.webp"
                  width={24}
                  height={24}
                  alt="User avatar"
                  className="rounded-full"
                />
                <Link href={`/u/${username}`} className="font-medium hover:underline">
                  {username}
                </Link>
                <span className="text-sm text-muted-foreground">• {comment.timestamp}</span>
              </div>
              <Link 
                href="#" 
                className="text-sm text-muted-foreground hover:text-primary transition-colors block mb-2"
              >
                On: "{comment.postTitle}" by @{comment.postAuthor}
              </Link>
              <p className="text-foreground mb-3">{comment.comment}</p>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <button className="flex items-center gap-1 hover:text-primary transition-colors">
                  👍 {comment.upvotes}
                </button>
                <button className="flex items-center gap-1 hover:text-primary transition-colors">
                  ✏️ Edit
                </button>
                <button className="flex items-center gap-1 hover:text-destructive transition-colors">
                  🗑️ Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CommentsPage;