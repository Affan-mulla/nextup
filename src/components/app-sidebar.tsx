"use client";

import * as React from "react";
import {
  ArrowBigUpDash,
  Brain,
  Compass,
  Home,
  Star,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavProjects } from "@/components/nav-projects";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { Separator } from "./ui/separator";
import ProfileDropdown from "./kokonutui/profile-dropdown";
import { useIsMobile } from "@/utils/use-mobile";

const data = {
  products: [
    {
      title: "Ezybill",
      url: "/p/ezybill",
      img: "Placeholder.svg",
    },
    {
      title: "Snapgram",
      url: "/p/snapgram",
      img: "Placeholder.svg",
    },
    {
      title: "Cinder",
      url: "/p/cinder",
      img: "Placeholder.svg",
    },
  ],
  projects: [
    {
      name: "Home",
      url: "/",
      icon: Home,
    },
    {
      name: "Popular",
      url: "/popular",
      icon: Star,
    },
    {
      name: "Genius",
      url: "/genius",
      icon: Brain,
    },
    {
      name: "Explore",
      url: "/explore",
      icon: Compass,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const isMobile = useIsMobile()
  return (
    <Sidebar variant="inset"  {...props} className="border-r border-border">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/">
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <ArrowBigUpDash className="size-5" />
                </div>
                <div className="grid flex-1 text-left text-lg font-outfit leading-tight">
                  <span className="truncate font-semibold ">NextUp</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent >
        <NavProjects projects={data.projects} />
        <Separator />
        <NavMain products={data.products} />
      </SidebarContent>
      <SidebarFooter className="md:p-0   ">
        {
          !isMobile && (
            <ProfileDropdown/>
          )
        }
      </SidebarFooter>
    </Sidebar>
  );
}
