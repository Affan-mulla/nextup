import * as React from "react"

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
  return (
    <Select>
      <SelectTrigger className="w-[100px]">
        <SelectValue placeholder="Sort" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Sort</SelectLabel>
          <SelectItem value="best">Best</SelectItem>
          <SelectItem value="top">Top</SelectItem>
          <SelectItem value="new">New</SelectItem>
          <SelectItem value="hot">Hot</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
