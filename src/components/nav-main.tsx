"use client";

import { ChevronRight, Sparkle, Sparkles, type LucideIcon } from "lucide-react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

interface NavMainProps {
      products?: { title: string; url: string; img: string }[]
}

export function NavMain({
  products
} : NavMainProps) {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <SidebarGroup>
      <SidebarMenu>
          <Collapsible asChild defaultOpen={true} open={isOpen} onOpenChange={setIsOpen}>
            <SidebarMenuItem className="">
              <CollapsibleTrigger asChild className="select-none hover:bg-muted p-2 rounded-md flex items-center mb-1">
                <div className="w-full flex items-center justify-between text-[16px] font-outfit text-muted-foreground">
                  <span className="flex items-center gap-2">
                    <Sparkles size={18} />
                    <span>Products</span>
                  </span>
                  {isOpen ?<ChevronRight className="rotate-90" /> : <ChevronRight />  }
                </div>
              </CollapsibleTrigger>

              {products?.length ? (
                <>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {products?.map((subItem) => (
                        <SidebarMenuSubItem key={subItem.title} className="">
                          <SidebarMenuSubButton
                            asChild
                            className="text-[14px] font-inter"
                          >
                            <Link href={subItem.url} className="">
                              <Image
                                src={subItem.img}
                                width={25}
                                height={25}
                                alt={subItem.title}
                                className="rounded-full mr-1"
                              />
                              <span>{subItem.title}</span>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </>
              ) : null}
            </SidebarMenuItem>
          </Collapsible>
      </SidebarMenu>
    </SidebarGroup>
  );
}
