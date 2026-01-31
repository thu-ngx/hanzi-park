import { useMemo } from "react";
import { useQueries } from "@tanstack/react-query";
import { characterService } from "../services/characterService";

interface ExampleCharData {
  pinyin: string[];
  meaning: string | null;
}

const EXAMPLE_CHARS = ["清", "汜", "妈", "隹", "房", "船"];

export const useExampleCharacters = () => {
  const queries = useQueries({
    queries: EXAMPLE_CHARS.map((char) => ({
      queryKey: ["character", char],
      queryFn: () => characterService.getCharacter(char),
      staleTime: 10 * 60 * 1000, // 10 minutes
    })),
  });

  const isLoading = queries.some((q) => q.isLoading);

  const exampleChars = useMemo(() => {
    const entries: Record<string, ExampleCharData> = {};

    for (let i = 0; i < EXAMPLE_CHARS.length; i++) {
      const char = EXAMPLE_CHARS[i];
      const query = queries[i];

      if (query.data) {
        entries[char] = {
          pinyin: query.data.pinyin,
          meaning: query.data.definitions?.[0] || null,
        };
      }
    }

    return entries;
  }, [queries]);

  return { exampleChars, exampleCharsList: EXAMPLE_CHARS, isLoading };
};
