"use client"
import React from 'react'

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { LogOutIcon, Settings, Sparkles } from 'lucide-react'
import { signOut } from 'next-auth/react'
import { useStore } from '@/store/store'
import { ModeToggle } from '@/components/ui/dark-mode-toggle'
import Link from 'next/link'

const Profile = () => {
   const user = useStore((state : any) => state.user);
  return (
    <DropdownMenu>
          <DropdownMenuTrigger asChild className='h-full'>
              <Avatar className="h-9 w-9 rounded-lg">
                <AvatarImage src={user?.image || "Placeholder.svg"} alt={user?.name || "Placeholder"} />
                <AvatarFallback className="rounded-lg">CN</AvatarFallback>
              </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={user?.image || "Placeholder.svg"} alt={user?.name || "Placeholder"} />
                  <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{user?.name}</span>
                  <span className="truncate text-xs">{user?.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <Sparkles />
                Upgrade to Pro
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                 <Link href={`/user/${user?.name}`} className='flex items-center'>
                <Settings />
                <p className='ml-2'>Account</p>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <ModeToggle/>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link href="/settings" className='flex items-center'>
                <Settings />
                <p className='ml-2'>Settings</p>
                </Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => signOut({ callbackUrl: "/" })}>
             <LogOutIcon />
             Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
  )
}

export default Profile