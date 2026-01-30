import { useState, useEffect, useMemo } from "react";
import { characterService } from "../services/characterService";
import type { FrequencyBucketedFamily } from "../types/character";

interface ParentCharacterData {
  char: string;
  pinyin: string[];
  meaning: string | null;
  frequencyRank?: number | null;
}

interface LoadedData {
  character: string;
  parents: ParentCharacterData[];
}

const emptyBuckets: FrequencyBucketedFamily = {
  top1000: [],
  mid: [],
  rest: [],
};

export function useParentCharacters(
  character: string | undefined,
): FrequencyBucketedFamily {
  const [loadedData, setLoadedData] = useState<LoadedData | null>(null);

  useEffect(() => {
    if (!character) return;

    let cancelled = false;

    characterService
      .getDictionaryEntry(character)
      .then((entry) => {
        if (!cancelled) {
          setLoadedData({
            character,
            parents: entry.parents || [],
          });
        }
      })
      .catch(() => {
        if (!cancelled) {
          setLoadedData({
            character,
            parents: [],
          });
        }
      });

    return () => {
      cancelled = true;
    };
  }, [character]);

  const bucketedParents = useMemo<FrequencyBucketedFamily>(() => {
    // Return empty if no character or data is for a different character
    if (!character || !loadedData || loadedData.character !== character) {
      return emptyBuckets;
    }

    if (loadedData.parents.length === 0) return emptyBuckets;

    const buckets: FrequencyBucketedFamily = {
      top1000: [],
      mid: [],
      rest: [],
    };

    for (const parent of loadedData.parents) {
      const item = {
        char: parent.char,
        pinyin: parent.pinyin,
        meaning: parent.meaning,
      };
      const rank = parent.frequencyRank;

      if (rank && rank <= 1000) {
        buckets.top1000.push(item);
      } else if (rank && rank <= 2000) {
        buckets.mid.push(item);
      } else {
        buckets.rest.push(item);
      }
    }

    return buckets;
  }, [character, loadedData]);

  return bucketedParents;
}
