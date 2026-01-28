import { create } from "zustand";
import { toast } from "sonner";
import { hanziService } from "@/services/hanziService";
import type {
  CharacterAnalysis,
  SavedCharacter,
  DictionaryEntry,
} from "@/types/character";

interface HanziState {
  // UI state
  darkMode: boolean;

  // Active character (unified - replaces singleResult + selectedCharacter)
  activeCharacter: CharacterAnalysis | null;
  activeLoading: boolean;

  // Collection
  savedCharacters: SavedCharacter[];
  collectionLoading: boolean;

  // Composition tree
  compositionEntry: DictionaryEntry | null;
  compositionLoading: boolean;
  compositionOpen: boolean;

  // Actions
  toggleDarkMode: () => void;

  pushCharacter: (char: string) => Promise<void>;
  resetExplorer: () => void;

  loadSaved: () => Promise<void>;
  saveCharacter: (data: CharacterAnalysis, notes?: string) => Promise<void>;
  updateNotes: (id: string, notes: string) => Promise<void>;
  removeCharacter: (id: string) => Promise<void>;

  loadComposition: (char: string) => Promise<void>;
  closeComposition: () => void;
}

export const useHanziStore = create<HanziState>((set, get) => ({
  darkMode: false,

  activeCharacter: null,
  activeLoading: false,

  savedCharacters: [],
  collectionLoading: false,

  compositionEntry: null,
  compositionLoading: false,
  compositionOpen: false,

  toggleDarkMode: () => {
    const next = !get().darkMode;
    set({ darkMode: next });
    document.documentElement.classList.toggle("dark", next);
  },

  pushCharacter: async (char) => {
    try {
      set({ activeLoading: true });
      const result = await hanziService.lookup(char);
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
      compositionOpen: false,
      compositionEntry: null,
    });
  },

  loadSaved: async () => {
    try {
      set({ collectionLoading: true });
      const chars = await hanziService.getSaved();
      set({ savedCharacters: chars });
    } catch {
      toast.error("Failed to load saved characters");
    } finally {
      set({ collectionLoading: false });
    }
  },

  saveCharacter: async (data, notes) => {
    try {
      const saved = await hanziService.save({
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
      const updated = await hanziService.updateNotes(id, notes);
      set((s) => ({
        savedCharacters: s.savedCharacters.map((c) =>
          c._id === id ? updated : c,
        ),
      }));
      toast.success("Notes updated");
    } catch {
      toast.error("Failed to update notes");
    }
  },

  removeCharacter: async (id) => {
    try {
      await hanziService.remove(id);
      set((s) => ({
        savedCharacters: s.savedCharacters.filter((c) => c._id !== id),
      }));
      toast.success("Character removed from collection");
    } catch {
      toast.error("Failed to remove character");
    }
  },

  loadComposition: async (char) => {
    try {
      set({
        compositionLoading: true,
        compositionOpen: true,
        compositionEntry: null,
      });
      const entry = await hanziService.getDictionaryEntry(char);
      set({ compositionEntry: entry });
    } catch {
      toast.error("Composition data not available for this character");
      set({ compositionOpen: false });
    } finally {
      set({ compositionLoading: false });
    }
  },

  closeComposition: () =>
    set({ compositionOpen: false, compositionEntry: null }),
}));
