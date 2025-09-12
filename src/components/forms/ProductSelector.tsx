"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import axios from "axios";
import Image from "next/image";

interface Product {
  id: string;
  name: string;
  logoUrl?: string;
}

export function ProductSelector({ setId }: { setId: (val: string) => void }) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");
  const [products, setProducts] = React.useState<Product[]>([]);

  React.useEffect(() => {
    if (value) {
      setId(value);
    }
  }, [value, setId]);

  const getProducts = React.useCallback(async () => {
    const res = await axios.get("/api/product/get-product");
    console.log(res.data);

    setProducts(res.data);
  }, []);

  React.useEffect(() => {
    getProducts();
  }, []);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {value ? (
            <div className="flex items-center gap-2">
              <Image
                src={
                  products.find((p) => p.id === value)?.logoUrl ||
                  "Placeholder.svg"
                }
                width={20}
                height={20}
                alt={products.find((p) => p.id === value)?.name || "Product"}
                className="h-4 w-4 rounded-sm"
              />
              <span>{products.find((p) => p.id === value)?.name}</span>
            </div>
          ) : (
            "Select Product..."
          )}
          <ChevronsUpDown className="opacity-50 ml-auto" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search Product..." className="h-9" />
          <CommandList>
            <CommandEmpty>No Product found.</CommandEmpty>
            <CommandGroup>
              {products.map((product) => (
                <CommandItem
                  key={product.id}
                  value={product.name} // ✅ use id, not name
                  onSelect={() => {
                    setValue(product.id);
                    setOpen(false);
                  }}
                >
                  <Image
                    src={product.logoUrl || "Placeholder.svg"}
                    width={20}
                    height={20}
                    alt={product.name}
                    className="mr-2 h-4 w-4 rounded-sm"
                  />
                  {product.name} {/* ✅ show name */}
                  <Check
                    className={cn(
                      "ml-auto",
                      value === product.id ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
