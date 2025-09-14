"use client";

import axios from "axios";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import Image from "next/image";
import { useDebounce } from "../editor/editor-hooks/use-debounce";
import { Loader, Search } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

interface Product {
  id: string;
  name: string;
  logoUrl?: string;
}

interface ProductSelectorProps {
  setId: (id: string) => void;
}

const ProductSelector: React.FC<ProductSelectorProps> = ({ setId }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // fetch products list (with optional search)
  const fetchProducts = useCallback(async (query?: string) => {
    try {
      setLoading(true);
      setError("");
      const res = await axios.get<Product[]>(
        "/api/product/get-product",
        query ? { params: { search: query } } : {}
      );
      setProducts(res.data || []);
      console.log(res.data);
    } catch (err) {
      console.error("Error fetching products:", err);
      setError("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  }, []);

  // debounce search input
  const debouncedFetch = useDebounce((query: string) => {
    if(products.find((p)=> p.name.includes(query))) {
      return
    }
    fetchProducts(query.trim() || undefined);
  }, 500);

  const handleSearch = (value: string) => {
    setSearch(value);
    debouncedFetch(value);
  };

  // initial load
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // notify parent of selection
  useEffect(() => {
    if (selected) setId(selected);
  }, [selected, setId]);

  // selected product memoized
  const selectedProduct = useMemo(
    () => products.find((p) => p.id === selected),
    [products, selected]
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="w-1/3">
        <button className="flex items-center gap-2 rounded-md  bg-muted px-3 py-2 text-sm font-medium font-inter border border-border">
          {
            selectedProduct ? (
              <Image
                src={selectedProduct.logoUrl || "Placeholder.svg"}
                alt={selectedProduct.name}
                width={20}
                height={20}
              />
            ) :
            <Search size={20} className="text-muted-foreground" />
          }
          {selectedProduct ? selectedProduct.name : "Select a product"}
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-64 p-0 font-inter" side="bottom">
        <Command>
          <CommandInput
            placeholder="Search product..."
            value={search}
            onValueChange={handleSearch}
          />

          <CommandList>
            {loading && (
              <div className="flex items-center gap-2 px-2 py-2 text-sm text-muted-foreground">
                <Loader className="h-4 w-4 animate-spin" /> Loading...
              </div>
            )}

            {error && <p className="px-2 py-2 text-red-500">{error}</p>}

            {!loading && !error && products.length === 0 && (
              <CommandEmpty>No product found.</CommandEmpty>
            )}

            <CommandGroup>
              {products.map((product) => (
                <CommandItem
                  key={product.id}
                  value={product.name}
                  onSelect={() => setSelected(product.id)}
                  className={
                    selected === product.id
                      ? "bg-accent text-accent-foreground"
                      : ""
                  }
                >
                  <Image
                    src={product.logoUrl || "/Placeholder.svg"}
                    alt={product.name || "Product"}
                    width={20}
                    height={20}
                    className="rounded-sm mr-2"
                  />
                  {product.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ProductSelector;
