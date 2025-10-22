"use client";

import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { SessionProvider, useSession } from "next-auth/react";
import Header from "../_components/Header";
import { useEffect, useState } from "react";
import { useStore } from "@/store/store";

import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import Loader from "@/components/kokonutui/loader";

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
  const { fetchCurrentUser, user, setUser } = useStore();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session?.user || user?.id) {
      setLoading(false);
      return;
    }

    const fetchUser = async () => {
      setLoading(true);

      await fetchCurrentUser(session.user.id);
      setLoading(false);
    };

    fetchUser();
  }, [session, user?.id, fetchCurrentUser]);

  return (
    <SidebarProvider>
      <div className="flex h-screen w-screen overflow-hidden">
        {/* Sidebar */}
        <AppSidebar />

        {/* Main Area */}
        <div className="flex bg-background  flex-col flex-1">
          {/* Header (fixed) */}
          <Header />

          {/* Scrollable page content */}

          <ScrollArea className="flex-1 overflow-y-auto">
            <ScrollBar orientation="vertical" />
            {loading ? (
              <div className="flex min-h-svh w-full items-center justify-center">
                <Loader size="sm" />
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
