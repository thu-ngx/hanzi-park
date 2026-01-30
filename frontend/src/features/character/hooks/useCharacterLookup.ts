import { useQuery } from "@tanstack/react-query";
import { toast } from "@/lib/toast";
import { characterService } from "../services/characterService";
import type { CharacterAnalysis } from "../types/character";

export interface CharacterLookupResult {
  data: CharacterAnalysis | undefined;
  isLoading: boolean;
  isError: boolean;
}

export function useCharacterLookup(
  character: string | undefined,
): CharacterLookupResult {
  const query = useQuery({
    queryKey: ["character", character],
    queryFn: async () => {
      const result = await characterService.lookup(character!);
      return result;
    },
    enabled: !!character,
  });

  // Show toast on error (but only once per error)
  if (query.isError && !query.isFetching) {
    toast.error("Failed to load character");
  }

  return {
    data: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
  };
}
