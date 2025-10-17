"use client";
import Idea from "@/app/_components/feed/Idea";
import { SortFeed } from "@/app/_components/Sort";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useStore } from "@/store/store";
import { Webhook } from "lucide-react";
import { useEffect, useCallback, useRef, useState } from "react";
import { motion } from "motion/react"
import Loader from "@/components/kokonutui/loader";

function Page() {
  const { ideas, loading, fetchIdeas, loadMore, hasMore } = useStore();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadInitialIdeas = async () => {
      try {
        await fetchIdeas(true); // Initial load with refresh
        setError(null);
      } catch (err) {
        setError('Failed to load ideas. Please try again.');
        console.error('Error loading ideas:', err);
      }
    };

    if (ideas.length === 0) {
      loadInitialIdeas();
    }
  }, [ideas.length, fetchIdeas]);

  // Infinite scroll handler
  const handleScroll = useCallback((event: React.UIEvent<HTMLDivElement>) => {
    if (loading || !hasMore) return;
    
    const element = event.currentTarget;
    const isNearBottom = element.scrollHeight - element.scrollTop <= element.clientHeight * 1.5;
    
    if (isNearBottom) {
      loadMore();
    }
  }, [loading, hasMore, loadMore]);
  console.log(ideas);
  

  return (
    <div>
      <div className="p-2 border-b-1">
        <SortFeed />
      </div>
      <div className="mt-2">
        <ScrollArea 
          ref={scrollRef}
          className="h-[calc(100vh-150px)]" 
          onScroll={handleScroll}
        >
          <ScrollBar orientation="vertical" />
          <div className="space-y-4">
            {error ? (
              <div className="w-full min-h-64 flex justify-center items-center">
                <motion.div 
                  className="text-center"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <p className="text-red-500 mb-2">{error}</p>
                  <button 
                    onClick={() => fetchIdeas(true)}
                    className="text-primary hover:underline"
                  >
                    Try again
                  </button>
                </motion.div>
              </div>
            ) : (
              <>
                {ideas.map((item) => (
                  <Idea key={item.id} idea={item} />
                ))}
                
                {loading && (
                  <div className="w-full py-4 flex justify-center">
                    <Loader size="sm" />
                  </div>
                )}
                
                {!loading && ideas.length === 0 && (
                  <div className="w-full min-h-64 flex justify-center items-center">
                    <motion.div 
                      className="text-center"
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                    >
                      <Webhook className="mx-auto mb-4" size={40} />
                      <p className="text-muted-foreground font-outfit text-lg">No ideas found</p>
                    </motion.div>
                  </div>
                )}

                {!loading && !hasMore && ideas.length > 0 && (
                  <div className="w-full py-4 text-center text-muted-foreground">
                    You have reached the end
                  </div>
                )}
              </>
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
      
}
export default Page;
