"use client";
import CardFlip from "@/components/kokonutui/card-flip";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence } from "motion/react";
import { motion } from "framer-motion";
import {
  ArrowBigDownDash,
  ArrowBigUpDash,
  Lightbulb,
  MessageCircleMore,
} from "lucide-react";
import { useStore } from "@/store/store";
import { useSession } from "next-auth/react";
import { ProfileProvider } from "@/context/profile";
import { useEffect, useMemo, useState } from "react";
import { User } from "@/types/store-types";
import axios from "axios";
import { toast } from "sonner";
import Loader from "@/components/kokonutui/loader";
import ProfileDetails from "@/app/_components/Profile/ProfileDetails";
import { useIsMobile } from "@/utils/use-mobile";
import { formatDistanceToNow } from "date-fns";

interface count {
  [key: string]: number;
}

const tabContent = [
  { link: "", title: "Post", icon: Lightbulb, private: false },
  {
    link: "comments",
    title: "Comments",
    icon: MessageCircleMore,
    private: false,
  },
  { link: "upvote", title: "Upvote", icon: ArrowBigUpDash, private: true },
  {
    link: "downvote",
    title: "Downvote",
    icon: ArrowBigDownDash,
    private: true,
  },
];
export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const userName = pathname?.split("/")[2] ?? "";
  const { user } = useStore();
  const { data: session, update } = useSession();
  const [userData, setUserData] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const isMobile = useIsMobile();

  
  const { _count = {}, createdAt } = userData || {};
  const { ideas = 0, comments = 0, follows = 0 } : count = _count;

  const cardFlipData = useMemo(
    () => [
      { title: "Posts", quantity: ideas },
      { title: "Comments", quantity: comments },
      { title: "Following", quantity: follows },
      {
        title: "Joined",
        quantity: createdAt
          ? `${formatDistanceToNow(new Date(createdAt))} ago`
          : "—",
      },
    ],
    [ideas, comments, follows, createdAt]
  );

  const basePath = useMemo(() => `/u/${userName}`, [userName]);

  const getUserDetails = async () => {
    try {
      setLoading(true);

      // as a fallback, try to reuse store user if its name matches the username (best-effort)
      if (user && user.name && user.name === userName) {
        setUserData(user as User);
        return;
      }

      const res = await axios.get(`/api/user/get-user`, {
        params: { username: userName },
      });

      if (res.status === 200) {
        setUserData(res.data as User);
      }
    } catch (error) {
      console.error("getUserDetails", error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!userName) return;
    getUserDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userName]);

  if (loading) return <Loader size="sm" />;




  // use session user id for reliable ownership detection
  const sessionUserId = session?.user?.id as string | undefined;
  const isOwner = Boolean(
    sessionUserId && userData && sessionUserId === userData.id
  );

  return (
    <ProfileProvider value={{ userData, isOwner }}>
      <main className="md:px-4 px-2  min-w-full py-5 flex gap-4 relative">
        <section className="md:p-5 p-2 rounded-xl w-full">
          <ProfileDetails
            userData={userData}
            userName={userName}
            isOwner={isOwner}
            onImageUpdate={(newImageUrl) => {
              setUserData(
                userData ? { ...userData, image: newImageUrl } : null
              );
              update({ ...session?.user, image: newImageUrl });
            }}
          />

          <div className="w-full">
            <div className="grid w-full grid-cols-4">
              <AnimatePresence>
                {tabContent
                  .filter((t) => (t.private ? isOwner : true))
                  .map((tab, i) => {
                    const currentPath = pathname;
                    const isRoot =
                      currentPath === basePath ||
                      currentPath === `${basePath}/`;
                    const isActive =
                      (tab.link === "" && isRoot) ||
                      (tab.link !== "" &&
                        currentPath === `${basePath}/${tab.link}`);

                    return (
                      <Link
                        key={i}
                        href={`${basePath}/${tab.link}`}
                        className={` flex gap-2 items-center justify-center relative py-2 font-outfit text-md transition border-b border-border ${
                          isActive ? "text-primary" : "text-muted-foreground"
                        }`}
                      >
                        <tab.icon size={18} />
                        {tab.title}
                        {isActive && (
                          <motion.div
                            layoutId="underline"
                            className="w-full h-0.5 bg-primary absolute bottom-0"
                          />
                        )}
                      </Link>
                    );
                  })}
              </AnimatePresence>
            </div>
            <div className="py-4">{children}</div>
          </div>
        </section>
        {!isMobile && (
          <div className="w-full max-w-[280px] h-fit sticky top-5 self-start">
            <CardFlip title={userData?.name || ""} features={cardFlipData} />
          </div>
        )}
      </main>
    </ProfileProvider>
  );
}
