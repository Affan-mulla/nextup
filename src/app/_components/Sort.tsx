import * as React from "react"
import { useStore } from "@/store/store"

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export function SortFeed() {
  const { sort, setSort, fetchIdeas } = useStore();

  const handleSortChange = (value: string) => {
    setSort(value as "latest" | "popular");
    fetchIdeas(true); // Refresh the feed with new sort
  };

  return (
    <Select value={sort} onValueChange={handleSortChange}>
      <SelectTrigger className="w-[120px]">
        <SelectValue placeholder="Sort" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Sort By</SelectLabel>
          <SelectItem value="latest">Latest</SelectItem>
          <SelectItem value="popular">Popular</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
