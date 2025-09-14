"use client";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

const Searchbar = () => {
  return (
    <div className="relative md:w-lg ">
      <Search
        className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
        size={18}
      />
      <Input
        type="text"
        placeholder="Search..."
        className="pl-10 pr-4 py-2 w-full rounded-2xl border bg-background shadow-sm 
                   focus-visible:ring-1 focus-visible:ring-primary/50 
                   transition-all font-inter"
      />
    </div>
  );
};

export default Searchbar;
