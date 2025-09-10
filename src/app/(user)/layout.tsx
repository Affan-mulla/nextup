"use client";
import { AppSidebar } from "@/components/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

import { SessionProvider, useSession } from "next-auth/react";
import Header from "../_components/Header";
import { useEffect } from "react";
import { useStore } from "@/store/store";

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
          <Header/>
          <div className="flex flex-1 flex-col gap-4 px-4 pt-2">{children}</div>
        </SidebarInset>
      </SidebarProvider>
    </SessionProvider>
  );
}
