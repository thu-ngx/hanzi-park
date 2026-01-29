import { create } from "zustand";
import { toast } from "sonner";
import { characterService } from "@/services/characterService";
import type { CharacterAnalysis, SavedCharacter } from "@/types/character";

interface CharacterState {
  // UI state
  darkMode: boolean;

  // Active character (unified - replaces singleResult + selectedCharacter)
  activeCharacter: CharacterAnalysis | null;
  activeLoading: boolean;

  // Collection
  savedCharacters: SavedCharacter[];
  collectionLoading: boolean;

  // Actions
  toggleDarkMode: () => void;

  pushCharacter: (char: string) => Promise<void>;
  resetExplorer: () => void;

  loadSaved: () => Promise<void>;
  saveCharacter: (data: CharacterAnalysis, notes?: string) => Promise<void>;
  updateNotes: (id: string, notes: string) => Promise<void>;
  removeCharacter: (id: string) => Promise<void>;
}

export const useCharacterStore = create<CharacterState>((set, get) => ({
  darkMode: false,

  activeCharacter: null,
  activeLoading: false,

  savedCharacters: [],
  collectionLoading: false,

  toggleDarkMode: () => {
    const next = !get().darkMode;
    set({ darkMode: next });
    document.documentElement.classList.toggle("dark", next);
  },

  pushCharacter: async (char) => {
    try {
      set({ activeLoading: true });
      const result = await characterService.lookup(char);
      set({
        activeCharacter: result,
      });
    } catch {
      toast.error("Failed to load character");
    } finally {
      set({ activeLoading: false });
    }
  },

  resetExplorer: () => {
    set({
      activeCharacter: null,
    });
  },

  loadSaved: async () => {
    try {
      set({ collectionLoading: true });
      const chars = await characterService.getSaved();
      set({ savedCharacters: chars });
    } catch {
      toast.error("Failed to load saved characters");
    } finally {
      set({ collectionLoading: false });
    }
  },

  saveCharacter: async (data, notes) => {
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
      set((s) => ({ savedCharacters: [saved, ...s.savedCharacters] }));
      toast.success(`"${data.character}" saved to collection`);
    } catch {
      toast.error("Character may already be saved");
    }
  },

  updateNotes: async (id, notes) => {
    try {
      const updated = await characterService.updateNotes(id, notes);
      set((s) => ({
        savedCharacters: s.savedCharacters.map((c) =>
          c._id === id ? updated : c
        ),
      }));
      toast.success("Notes updated");
    } catch {
      toast.error("Failed to update notes");
    }
  },

  removeCharacter: async (id) => {
    try {
      await characterService.remove(id);
      set((s) => ({
        savedCharacters: s.savedCharacters.filter((c) => c._id !== id),
      }));
      toast.success("Character removed from collection");
    } catch {
      toast.error("Failed to remove character");
    }
  },
}));
