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
    // Optimistic update: immediately add to UI with temp ID
    const tempId = `temp-${Date.now()}`;
    const optimistic: SavedCharacter = {
      _id: tempId,
      userId: "",
      character: data.character,
      pinyin: data.pinyin,
      meaning: data.meaning,
      semanticRadical: data.semanticRadical,
      phoneticComponent: data.phoneticComponent,
      frequencyRank: data.frequencyRank,
      strokeCount: data.strokeCount,
      notes: notes || "",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    set((s) => ({ characters: [optimistic, ...s.characters] }));

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
      // Replace temp with real saved character
      set((s) => ({
        characters: s.characters.map((c) => (c._id === tempId ? saved : c)),
      }));
      toast.success(`"${data.character}" saved to collection`);
    } catch {
      // Rollback optimistic update
      set((s) => ({ characters: s.characters.filter((c) => c._id !== tempId) }));
      toast.error("Character may already be saved");
    }
  },

  updateNotes: async (id, notes) => {
    // Store previous state for rollback
    const previous = get().characters.find((c) => c._id === id);
    if (!previous) return;

    // Optimistic update
    set((s) => ({
      characters: s.characters.map((c) =>
        c._id === id ? { ...c, notes, updatedAt: new Date().toISOString() } : c
      ),
    }));

    try {
      const updated = await characterService.updateNotes(id, notes);
      set((s) => ({
        characters: s.characters.map((c) => (c._id === id ? updated : c)),
      }));
      toast.success("Notes updated");
    } catch {
      // Rollback
      set((s) => ({
        characters: s.characters.map((c) => (c._id === id ? previous : c)),
      }));
      toast.error("Failed to update notes");
    }
  },

  remove: async (id) => {
    // Store for rollback
    const previous = get().characters;
    const toRemove = previous.find((c) => c._id === id);
    if (!toRemove) return;

    // Optimistic removal
    set((s) => ({
      characters: s.characters.filter((c) => c._id !== id),
    }));

    try {
      await characterService.remove(id);
      toast.success("Character removed from collection");
    } catch {
      // Rollback
      set({ characters: previous });
      toast.error("Failed to remove character");
    }
  },

  findByChar: (char) => {
    return get().characters.find((c) => c.character === char);
  },
}));
