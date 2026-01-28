import api from "@/lib/axios";
import type {
  CharacterAnalysis,
  SavedCharacter,
  DictionaryEntry,
  SearchResult,
} from "@/types/character";

export const hanziService = {
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

  getSaved: async (): Promise<SavedCharacter[]> => {
    const res = await api.get("/characters/saved");
    return res.data;
  },

  save: async (data: Partial<SavedCharacter>): Promise<SavedCharacter> => {
    const res = await api.post("/characters/save", data);
    return res.data;
  },

  updateNotes: async (id: string, notes: string): Promise<SavedCharacter> => {
    const res = await api.put(`/characters/${id}/notes`, { notes });
    return res.data;
  },

  remove: async (id: string): Promise<void> => {
    await api.delete(`/characters/${id}`);
  },

  getDictionaryEntry: async (char: string): Promise<DictionaryEntry> => {
    const res = await api.get(`/dictionary/${encodeURIComponent(char)}`);
    return res.data;
  },
};
