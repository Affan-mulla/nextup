import Idea from "@/app/_components/feed/Idea";
import { SortFeed } from "@/app/_components/Sort";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
function Page() {
  return (
    <div >
      <div className="py-2 border-b-1 ">
        <SortFeed />
      </div>
      <div className="mt-2">
        <ScrollArea className="h-[calc(100vh-150px)]" >
           <ScrollBar orientation="vertical"  />
        {/* Feature */}
        <Idea />
        <Idea />
        <Idea />
        <Idea />
        <Idea />
        <Idea />
        <Idea />
        <Idea />
        </ScrollArea>
       
      </div>
    </div>
  );
}

export default Page;
