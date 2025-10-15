import { useState, useEffect } from "react";
import useDebounce from "@/hooks/use-debounce";
import axios from "axios";
interface SearchResult {
  type: "Companies" | "Users";
  id: string;
  name: string;
}

export function useSearch(query: string, isFocused: boolean) {
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    // Fetch only if focused
    if (!isFocused) return;

    // Fetch popular when query is empty
    const fetchData = async () => {
      setLoading(true);
      try {
        const endpoint = debouncedQuery
          ? `/api/search?q=${debouncedQuery}`
          : `/api/search/`;

        const res = await axios.get(endpoint);
        const data : SearchResult[]  = res.data;
        setResults(data);
      } catch (err) {
        console.error("Search error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [debouncedQuery, isFocused]);

  return { results, loading };
}
