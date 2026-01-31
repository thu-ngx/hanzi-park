import api from "@/lib/axios";
import type {
  Character,
  Note,
  CharacterSearchResult,
} from "@/features/character/types/character";

export const characterService = {
  // ============================================
  // CHARACTER ENDPOINTS (public - /api/characters)
  // ============================================

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

  // ============================================
  // NOTE ENDPOINTS (protected - /api/notes)
  // ============================================

  getSaved: async (): Promise<Note[]> => {
    const res = await api.get("/notes");
    return res.data;
  },

  getNote: async (char: string): Promise<Note | null> => {
    const res = await api.get(`/notes/character/${encodeURIComponent(char)}`);
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
