import api from "@/lib/axios";
import type { Note } from "../types/note";

export const noteService = {
  getAll: async (): Promise<Note[]> => {
    const res = await api.get("/notes");
    return res.data;
  },

  getByCharacter: async (char: string): Promise<Note | null> => {
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
