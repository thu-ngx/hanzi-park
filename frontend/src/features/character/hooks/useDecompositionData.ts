import { useState, useEffect, useMemo } from "react";
import { characterService } from "../services/characterService";

interface DecompositionInfo {
  pinyin: string[];
  meaning: string | null;
}

interface LoadedData {
  decomposition: string;
  data: Map<string, DecompositionInfo>;
}

const emptyMap = new Map<string, DecompositionInfo>();

export function useDecompositionData(
  decomposition: string | undefined,
): Map<string, DecompositionInfo> {
  const [loadedData, setLoadedData] = useState<LoadedData | null>(null);

  useEffect(() => {
    if (!decomposition) return;

    let cancelled = false;

    const hanChars = [...decomposition].filter((char) =>
      /\p{Script=Han}/u.test(char),
    );

    if (hanChars.length === 0) {
      // No characters to fetch, but still mark as loaded
      // Use Promise.resolve to make this async and avoid lint warning
      Promise.resolve().then(() => {
        if (!cancelled) {
          setLoadedData({
            decomposition,
            data: new Map(),
          });
        }
      });
      return;
    }

    Promise.all(
      hanChars.map((char) =>
        characterService
          .getDictionaryEntry(char)
          .then((entry) => ({
            char,
            pinyin: entry.pinyin,
            meaning: entry.definitions?.[0] || null,
          }))
          .catch(() => ({
            char,
            pinyin: [] as string[],
            meaning: null,
          })),
      ),
    ).then((results) => {
      if (cancelled) return;

      const map = new Map<string, DecompositionInfo>();
      for (const { char, pinyin, meaning } of results) {
        map.set(char, { pinyin, meaning });
      }
      setLoadedData({
        decomposition,
        data: map,
      });
    });

    return () => {
      cancelled = true;
    };
  }, [decomposition]);

  // Return empty map if no decomposition or data is for a different decomposition
  const result = useMemo(() => {
    if (!decomposition || !loadedData || loadedData.decomposition !== decomposition) {
      return emptyMap;
    }
    return loadedData.data;
  }, [decomposition, loadedData]);

  return result;
}
