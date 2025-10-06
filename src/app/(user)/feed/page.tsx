"use client";
import Idea from "@/app/_components/feed/Idea";
import { SortFeed } from "@/app/_components/Sort";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useStore } from "@/store/store";
import { Loader, Webhook } from "lucide-react";
import { useEffect } from "react";
import { motion } from "motion/react"

function Page() {

   const { ideas, loading, fetchIdeas } = useStore()

  useEffect(() => {
    if (ideas.length === 0) fetchIdeas() // ✅ fetch only if not already loaded
  }, [])



  return (
    <div >
      <div className="py-2 border-b-1 ">
        <SortFeed />
      </div>
      <div className="mt-2">
        <ScrollArea className="h-[calc(100vh-150px)]" >
           <ScrollBar orientation="vertical"  />
        {/* Feature */}
       {
        loading ? <div className="w-full h-full flex items-center">
          <Loader className="animate-spin mx-auto" />
        </div> : ideas.length === 0 ? <div className="w-full h-full flex flex-col items-center gap-4 mt-10">
          <motion.div className="text-3xl font-semibold"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}>
          <Webhook />
          </motion.div>
        </div> : ideas.map((item) => (
          <Idea key={item.id} idea={item} />
        ))
       }
        </ScrollArea>
       
      </div>
    </div>
  );
}

export default Page;
