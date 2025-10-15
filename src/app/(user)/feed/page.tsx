"use client";
import Idea from "@/app/_components/feed/Idea";
import { SortFeed } from "@/app/_components/Sort";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useStore } from "@/store/store";
import {  Webhook } from "lucide-react";
import { useEffect } from "react";
import { motion } from "motion/react"
import Loader from "@/components/kokonutui/loader";

function Page() {

  const { ideas, loading, fetchIdeas } = useStore()

  useEffect(() => {
    if (ideas.length === 0) fetchIdeas() // ✅ fetch only if not already loaded
  }, [])



  return (
    <div >
      <div className="p-2 border-b-1 ">
        <SortFeed />
      </div>
      <div className="mt-2">
        <ScrollArea className="h-[calc(100vh-150px)]" >
           <ScrollBar orientation="vertical"  />
        {/* Feature */}
       {
        loading ? <div className="w-full min-h-[calc(100vh-150px)] justify-center flex items-center">
          <Loader size="sm" />
        </div> : ideas.length === 0 ? <div className="w-full min-h-64 flex justify-center items-center">
          <motion.div className="text-3xl font-semibold"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}>
              <Webhook size={40} />
              <p className="text-muted font-outfit">No result found</p>

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
