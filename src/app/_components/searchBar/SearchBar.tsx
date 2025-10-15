import React from "react";
import { motion, AnimatePresence, easeInOut } from "framer-motion";
import {
  Building2,
  Loader2,
  User,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { useSearch } from "@/hooks/useSearch";
import Link from "next/link";

const VARIANTS = {
  dropdown: {
    hidden: { opacity: 0, y: -8, scale: 0.98 },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        // type: "spring",
        springiness: 500,
        stiffness: 200,
        damping: 18,
        mass: 0.8,
      },
    },
    exit: {
      opacity: 0,
      y: -8,
      scale: 0.97,
      transition: { duration: 0.15, easeInOut },
    },
  },
  list: {
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.06,
        delayChildren: 0.05,
      },
    },
  },
  item: {
    hidden: { opacity: 0, y: 10 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        // type: "spring",
        stiffness: 300,
        damping: 20,
      },
    },
  },
};

interface SearchResult {
  type: "Companies" | "Users";
  id: string;
  name: string;
}

const SearchBar = () => {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const [debouncedQuery, setDebouncedQuery] = React.useState(query);
  React.useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(query), 400);
    return () => clearTimeout(t);
  }, [query]);

  const { results, loading } = useSearch(debouncedQuery, open);

  const groupedResults = React.useMemo(() => {
    const groups: { Companies: SearchResult[]; Users: SearchResult[] } = {
      Companies: [],
      Users: [],
    };
    results.forEach((item) => groups[item.type].push(item));
    return groups;
  }, [results]);

  const handleFocus = () => setOpen(true);
  const handleBlur = () => setTimeout(() => setOpen(false), 150);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setQuery(e.target.value);

  return (
    <div className="w-full max-w-lg relative">
      <Input
        type="text"
        placeholder="Search..."
        value={query}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onChange={handleChange}
        className="font-inter"
      />

      <AnimatePresence>
        {open && (
          <motion.div
            key="dropdown"
            variants={VARIANTS.dropdown}
            initial="hidden"
            animate="show"
            exit="exit"
            className="absolute top-full left-0 w-full z-30 mt-1"
          >
            <div className="bg-background border border-border rounded-md shadow-lg overflow-hidden backdrop-blur-sm">
              {loading ? (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                  className="px-4 py-3 text-sm text-muted-foreground text-center w-full"
                >
                  <Loader2 size={16} className="animate-spin text-center" />
                </motion.div>
              ) : results.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                  className="px-4 py-3 text-sm text-muted-foreground text-center"
                >
                  No results found
                </motion.div>
              ) : (
                <>
                  {["Companies", "Users"].map(
                    (group) =>
                      groupedResults[group as "Companies" | "Users"].length > 0 && (
                        <div key={group} className="px-2 py-1 my-1 border-b border-border">
                          <p className="text-xs text-muted-foreground mb-1 px-2 uppercase tracking-wide font-outfit">
                            {group}
                          </p>
                          <motion.ul
                            variants={VARIANTS.list}
                            initial="hidden"
                            animate="show"
                            exit="hidden"
                            className=""
                          >
                            {groupedResults[group as "Companies" | "Users"].map((item : SearchResult) => (
                              <motion.li
                                key={item.id}
                                variants={VARIANTS.item}
                                transition={{ type: "spring", stiffness: 300 }}
                                className="flex items-center gap-2 p-2 text-xs font-inter rounded-md cursor-pointer select-none hover:bg-muted "
                              >
                                <Link href={item.type === "Companies" ? `/c/${item.name}` : `/u/${item.name}`} className="flex items-center gap-2">
                                {item.type === "Companies" ? (
                                  <Building2
                                    className="text-blue-600"
                                    size={16}
                                  />
                                ) : (
                                  <User className="text-green-500" size={16} />
                                )}
                                <span>{item.name}</span>
                                </Link>
                              </motion.li>
                            ))}
                          </motion.ul>
                        </div>
                      )
                  )}
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SearchBar;
