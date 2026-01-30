import { useMemo } from "react";
import { useQueries } from "@tanstack/react-query";
import { characterService } from "../services/characterService";

interface DecompositionInfo {
  pinyin: string[];
  meaning: string | null;
}

const emptyMap = new Map<string, DecompositionInfo>();

export function useDecompositionData(
  decomposition: string | undefined,
): Map<string, DecompositionInfo> {
  // Extract unique Han characters from decomposition string
  const hanChars = useMemo(() => {
    if (!decomposition) return [];
    return [...new Set([...decomposition].filter((char) =>
      /\p{Script=Han}/u.test(char),
    ))];
  }, [decomposition]);

  // Fetch dictionary entries for each character in parallel
  const queries = useQueries({
    queries: hanChars.map((char) => ({
      queryKey: ["dictionary", char],
      queryFn: () => characterService.getDictionaryEntry(char),
      staleTime: 10 * 60 * 1000, // 10 minutes - dictionary data rarely changes
    })),
  });

  // Combine results into a Map
  const result = useMemo(() => {
    if (hanChars.length === 0) return emptyMap;

    // Check if all queries are done
    const allDone = queries.every((q) => !q.isLoading);
    if (!allDone) return emptyMap;

    const map = new Map<string, DecompositionInfo>();
    for (let i = 0; i < hanChars.length; i++) {
      const char = hanChars[i];
      const query = queries[i];

      if (query.data) {
        map.set(char, {
          pinyin: query.data.pinyin,
          meaning: query.data.definitions?.[0] || null,
        });
      } else {
        map.set(char, { pinyin: [], meaning: null });
      }
    }
    return map;
  }, [hanChars, queries]);

  return result;
}
