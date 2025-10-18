"use client";
import Image from "next/image";
import CardFlip from "@/components/kokonutui/card-flip";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence } from "motion/react";
import { motion } from "framer-motion";
import { ArrowBigDownDash, ArrowBigUpDash, Lightbulb, MessageCircleMore } from "lucide-react";
import { useStore } from "@/store/store";
import { useSession } from "next-auth/react";
import { ProfileProvider } from "@/context/profile";
import { useEffect, useMemo, useState } from "react";
import { User } from "@/types/store-types";
import axios from "axios";
import { toast } from "sonner";
import Loader from "@/components/kokonutui/loader";

const tabContent = [
  { link: "", title: "Post", icon: Lightbulb, private: false },
  { link: "comments", title: "Comments", icon: MessageCircleMore, private: false },
  { link: "upvote", title: "Upvote", icon: ArrowBigUpDash, private: true },
  { link: "downvote", title: "Downvote", icon: ArrowBigDownDash, private: true },
];
export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const userName = pathname?.split("/")[2] ?? "";
  const { user } = useStore();
  const { data: session } = useSession();
  const [userData, setUserData] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const basePath = useMemo(() => `/u/${userName}`, [userName]);

  const getUserDetails = async () => {
    try {
      setLoading(true);

      // If session user is the same username, reuse it (session can include username/name depending on provider)
      const sessionUser: any = session?.user;
      if (sessionUser && (sessionUser.username === userName || sessionUser.name === userName)) {
        // map session user fields into our User shape safely
        setUserData({ id: sessionUser.id, name: sessionUser.name, image: sessionUser.image } as User);
        return;
      }

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

  if (loading) return <Loader />

  // use session user id for reliable ownership detection
  const sessionUserId = session?.user?.id as string | undefined;
  const isOwner = Boolean(sessionUserId && userData && sessionUserId === userData.id);

  return (
    <ProfileProvider value={{ userData, isOwner }}>
    <main className="px-4  min-w-full py-5 flex gap-4 relative">
      <section className=" p-5 rounded-xl w-full">
        <div className="flex gap-4 h-30">
          <Image
            src={userData?.image || "/Placeholder.webp"}
            width={50}
            height={50}
            alt="logo"
            className="rounded-full object-cover w-16 h-16"
          />
          <aside className="flex flex-col">
            <h2 className="font-outfit text-2xl tracking-wide font-semibold">
              {userData?.name}
            </h2>
            <h4 className="font-inter text-muted-foreground font-md">
              {`u/${userName}`}
            </h4>
          </aside>
        </div>

        <div className="w-full">
          <div className="grid w-full grid-cols-4">
            <AnimatePresence>
              {tabContent
                .filter((t) => (t.private ? isOwner : true))
                .map((tab, i) => {
                  const currentPath = pathname;
                  const isRoot = currentPath === basePath || currentPath === `${basePath}/`;
                  const isActive =
                    (tab.link === "" && isRoot) || (tab.link !== "" && currentPath === `${basePath}/${tab.link}`);

                  return (
                    <Link
                      key={i}
                      href={`${basePath}/${tab.link}`}
                      className={` flex gap-2 items-center justify-center relative py-2 font-outfit text-md transition border-b border-border ${isActive ? "text-primary" : "text-muted-foreground"}`}
                    >
                      <tab.icon size={18} />
                      {tab.title}
                      {isActive && <motion.div layoutId="underline" className="w-full h-0.5 bg-primary absolute bottom-0" />}
                    </Link>
                  );
                })}
            </AnimatePresence>
          </div>
          <div className="py-4">{children}</div>
        </div>
      </section>
      <div className="w-full max-w-[280px] h-fit sticky top-5 self-start">
        <CardFlip title={userData?.name || ""} subtitle="0 follower" />
      </div>
    </main>
    </ProfileProvider>
  );
}
