"use client";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import React from "react";
import Searchbar from "./Searchbar";
import Link from "next/link";
import { Bell, PlusCircle } from "lucide-react";
import Profile from "./Profile";
import { Button } from "@/components/ui/button";
import { useStore } from "@/store/store";
import { Store } from "@/types/store-types";
import { animate, motion } from "motion/react";
const Header = () => {
  const data = useStore((state: Store) => state.user);

  return (
    <header className="flex h-16  shrink-0 border-b items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
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
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 250, damping: 15 }}
            >
              <Link
                href="/idea"
                className="relative flex items-center gap-2 rounded-lg border border-border
             bg-gradient-to-br from-primary/10 via-primary/5 to-transparent
             backdrop-blur-md px-5 py-2 text-sm font-medium text-foreground
             transition-all duration-300 overflow-hidden group
             shadow-sm 
             shadow-foreground/10 dark:shadow-primary/10  hover:shadow-foreground/20 dark:hover:shadow-primary/20
           "
              >
                <PlusCircle
                  size={20}
                  className="text-primary transition-transform duration-300 group-hover:rotate-180 z-10"
                />
                <p className="font-medium z-10">Create</p>
              </Link>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05 }}>
              <Link
                href="/notifications"
                className=" p-2 rounded-lg hover:bg-accent/50 transition-colors duration-200 flex items-center justify-center
                border border-border shadow-sm  shadow-foreground/10  hover:shadow-foreground/10
           "
              >
                <motion.div
                  onHoverStart={() => {
                    animate(
                      ".notification-bell",
                      { rotate: [0, 15, -15, 0] },
                      { duration: 0.5, ease: "easeInOut" }
                    );
                  }}
                  className="notification-bell"
                >
                  <Bell className="h-5 w-5 z-100" />
                </motion.div>
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }}>
              <Profile />
            </motion.div>
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
  );
};

export default Header;
