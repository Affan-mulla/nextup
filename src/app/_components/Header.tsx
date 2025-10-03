"use client"
import { Separator } from '@/components/ui/separator'
import { SidebarTrigger } from '@/components/ui/sidebar'
import React from 'react'
import Searchbar from './Searchbar'
import Link from 'next/link'
import { Bell, PlusCircle } from 'lucide-react'
import Profile from './Profile'
import { Button } from '@/components/ui/button'
import { useStore } from '@/store/store'
import { Store } from '@/types/store-types'

const Header = () => {
   const data = useStore((state : Store) => state.user);

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
                  <Link
                    href="/idea"
                    className="flex shadow-sm hover:shadow-muted-foreground/40  items-center gap-1 h-full font-inter rounded-md bg-secondary px-4 py-2 text-sm font-medium hover:bg-secondary-foreground/10 transition-colors"
                  >
                    <PlusCircle size={20} />
                    <p className="ml-1">Create</p>
                  </Link>
                  <Link href="/notifications" className="flex h-9 w-9 items-center justify-center rounded-md bg-secondary hover:bg-secondary-foreground/10 transition-colors">
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
  )
}

export default Header