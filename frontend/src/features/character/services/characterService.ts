import api from "@/lib/axios";
import type {
  CharacterAnalysis,
  Note,
  DictionaryEntry,
  SearchResult,
} from "@/features/character/types/character";

export const characterService = {
  // Character lookup endpoints (public - /api/characters)
  lookup: async (character: string): Promise<CharacterAnalysis> => {
    const res = await api.post("/characters/lookup", { character });
    return res.data;
  },

  search: async (query: string): Promise<SearchResult[]> => {
    const res = await api.get(
      `/characters/search?q=${encodeURIComponent(query)}`,
    );
    return res.data;
  },

  getDictionaryEntry: async (char: string): Promise<DictionaryEntry> => {
    const res = await api.get(`/characters/${encodeURIComponent(char)}`);
    return res.data;
  },

  // User notes endpoints (protected - /api/notes)
  getSaved: async (): Promise<Note[]> => {
    const res = await api.get("/notes");
    return res.data;
  },

  save: async (data: Partial<Note>): Promise<Note> => {
    const res = await api.post("/notes", data);
    return res.data;
  },

  remove: async (id: string): Promise<void> => {
    await api.delete(`/notes/${id}`);
  },
};
