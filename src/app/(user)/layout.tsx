"use client";
import { AppSidebar } from "@/components/app-sidebar";
import { Separator } from "@/components/ui/separator";

import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Bell, PlusCircle } from "lucide-react";
import Searchbar from "../_components/Searchbar";
import Profile from "../_components/Profile";
import { useStore } from "@/store/store";
import { SessionProvider, useSession } from "next-auth/react";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

// app/(user)/layout.tsx
export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data } = useSession();

  useEffect(() => {
    if (data) {
      useStore.setState({ user: data.user });
    }
  }, [data]);

  return (
    <SessionProvider>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className="flex h-16 shrink-0 border-b items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
            <div className="flex items-center justify-between gap-2 px-4 w-full">
              <div className="flex items-center gap-2">
                <SidebarTrigger className="-ml-1" />
                <Separator
                  orientation="vertical"
                  className="mr-2 data-[orientation=vertical]:h-4"
                />
              </div>

              <Searchbar />

              {/* Right */}
              {data ? (
                <div className="flex items-center gap-3 h-full">
                  <Link
                    href="/idea/create"
                    className="flex items-center gap-1 h-full font-inter rounded-lg bg-secondary px-3 py-2 text-sm font-medium hover:bg-secondary-foreground/10 transition-colors"
                  >
                    <PlusCircle size={20} />
                    <p className="ml-1">Create</p>
                  </Link>
                  <Link href="/notifications" className="flex h-9 w-9 items-center justify-center rounded-lg bg-secondary hover:bg-secondary-foreground/10 transition-colors">
                    <Bell className="h-5 w-5" />
                  </Link>

                  <Profile />
                </div>
              ) : (
                <Link href="/auth/signin">
                  <Button className="rounded-xl px-4 py-2 text-sm font-semibold">
                    Sign in
                  </Button>
                </Link>
              )}
            </div>
          </header>
          <div className="flex flex-1 flex-col gap-4 p-4 pt-0">{children}</div>
        </SidebarInset>
      </SidebarProvider>
    </SessionProvider>
  );
}
