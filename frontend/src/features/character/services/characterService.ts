import api from "@/lib/axios";
import type {
  Character,
  CharacterSearchResult,
} from "@/features/character/types/character";

export const characterService = {
  getCharacter: async (char: string): Promise<Character> => {
    const res = await api.get(`/characters/${encodeURIComponent(char)}`);
    return res.data;
  },

  searchCharacters: async (query: string): Promise<CharacterSearchResult[]> => {
    const res = await api.get(
      `/characters/search?q=${encodeURIComponent(query)}`,
    );
    return res.data;
  },
};
