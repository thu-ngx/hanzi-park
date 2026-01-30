import { useQuery } from "@tanstack/react-query";
import { characterService } from "../services/characterService";
import type { FrequencyBucketedFamily, RichFamilyCharacter } from "../types/character";

interface ParentCharacterData {
  char: string;
  pinyin: string[];
  meaning: string | null;
  frequencyRank?: number | null;
}

const emptyBuckets: FrequencyBucketedFamily = {
  top1000: [],
  mid: [],
  rest: [],
};

function bucketByFrequency(parents: ParentCharacterData[]): FrequencyBucketedFamily {
  if (parents.length === 0) return emptyBuckets;

  const buckets: FrequencyBucketedFamily = {
    top1000: [],
    mid: [],
    rest: [],
  };

  for (const parent of parents) {
    const item: RichFamilyCharacter = {
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
}

export function useParentCharacters(
  character: string | undefined,
): FrequencyBucketedFamily {
  const query = useQuery({
    queryKey: ["dictionary", character],
    queryFn: () => characterService.getDictionaryEntry(character!),
    enabled: !!character,
    staleTime: 10 * 60 * 1000, // 10 minutes
    select: (entry) => bucketByFrequency(entry.parents || []),
  });

  return query.data ?? emptyBuckets;
}
