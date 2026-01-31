import { toast } from "@/lib/toast";
import { characterService } from "../services/characterService";
import type { Character } from "../types/character";
import { useQuery } from "@tanstack/react-query";

export function useCharacter(char: string | undefined) {
  return useQuery<Character>({
    queryKey: ["character", char],
    queryFn: async () => {
      try {
        return await characterService.getCharacter(char!);
      } catch (error) {
        console.error("Failed to fetch character:", error);
        toast.error("Failed to load character");
        throw error;
      }
    },
    enabled: !!char,
    staleTime: Infinity, // Character data doesn't change, never refetch automatically
  });
}
