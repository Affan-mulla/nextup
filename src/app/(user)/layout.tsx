"use client";

import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { SessionProvider, useSession } from "next-auth/react";
import Header from "../_components/Header";
import { useEffect, useState } from "react";
import { useStore } from "@/store/store";
import { Loader } from "lucide-react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <Content>{children}</Content>
    </SessionProvider>
  );
}

function Content({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const user = useStore((state: any) => state.user);
  const setUser = useStore((state: any) => state.setUser);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id && status === "authenticated" && session?.user) {
      setUser(session.user);
    }
    if (status !== "loading") {
      setLoading(false);
    }
  }, [status, session, user?.id, setUser]);

  return (
    <SidebarProvider>
      <div className="flex h-screen w-screen overflow-hidden">
        {/* Sidebar */}
        <AppSidebar />

        {/* Main Area */}
        <div className="flex bg-background  rounded-lg m-2 flex-col flex-1">
          {/* Header (fixed) */}
          <Header />

          {/* Scrollable page content */}
         
          <ScrollArea className="flex-1 overflow-y-auto px-4 pt-2">
            <ScrollBar orientation="vertical" />
            {loading ? (
              <div className="flex h-full w-full items-center justify-center">
                <Loader className="animate-spin" />
              </div>
            ) : (
              children
            )}
          </ScrollArea>     
        </div>
      </div>
    </SidebarProvider>
  );
}
