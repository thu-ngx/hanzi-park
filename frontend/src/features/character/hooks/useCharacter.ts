import { useQuery } from "@tanstack/react-query";
import { characterService } from "../services/characterService";
import type { Character } from "../types/character";

export function useCharacter(char: string | undefined) {
    return useQuery<Character>({
        queryKey: ["character", char],
        queryFn: () => characterService.getCharacter(char!),
        enabled: !!char,
        staleTime: 10 * 60 * 1000, // 10 minutes - character data rarely changes
    });
}
