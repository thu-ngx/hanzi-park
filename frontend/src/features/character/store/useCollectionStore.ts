import { create } from "zustand";
import { toast } from "@/lib/toast";
import { characterService } from "@/features/character/services/characterService";
import type { CharacterAnalysis, SavedCharacter } from "@/features/character/types/character";

interface CollectionState {
  characters: SavedCharacter[];
  isLoading: boolean;

  load: () => Promise<void>;
  save: (data: CharacterAnalysis, notes?: string) => Promise<void>;
  updateNotes: (id: string, notes: string) => Promise<void>;
  remove: (id: string) => Promise<void>;
  findByChar: (char: string) => SavedCharacter | undefined;
}

export const useCollectionStore = create<CollectionState>((set, get) => ({
  characters: [],
  isLoading: false,

  load: async () => {
    try {
      set({ isLoading: true });
      const chars = await characterService.getSaved();
      set({ characters: chars });
    } catch {
      toast.error("Failed to load saved characters");
    } finally {
      set({ isLoading: false });
    }
  },

  save: async (data, notes) => {
    try {
      const saved = await characterService.save({
        character: data.character,
        pinyin: data.pinyin,
        meaning: data.meaning,
        semanticRadical: data.semanticRadical,
        phoneticComponent: data.phoneticComponent,
        frequencyRank: data.frequencyRank,
        strokeCount: data.strokeCount,
        notes: notes || "",
      });
      set((s) => ({ characters: [saved, ...s.characters] }));
      toast.success(`"${data.character}" saved to collection`);
    } catch {
      toast.error("Character may already be saved");
    }
  },

  updateNotes: async (id, notes) => {
    try {
      const updated = await characterService.updateNotes(id, notes);
      set((s) => ({
        characters: s.characters.map((c) => (c._id === id ? updated : c)),
      }));
      toast.success("Notes updated");
    } catch {
      toast.error("Failed to update notes");
    }
  },

  remove: async (id) => {
    try {
      await characterService.remove(id);
      set((s) => ({
        characters: s.characters.filter((c) => c._id !== id),
      }));
      toast.success("Character removed from collection");
    } catch {
      toast.error("Failed to remove character");
    }
  },

  findByChar: (char) => {
    return get().characters.find((c) => c.character === char);
  },
}));
