import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { characterService } from "../services/characterService";
import { toast } from "@/lib/toast";
import type { SavedCharacter, CharacterAnalysis } from "../types/character";

export const useNotes = () => {
  return useQuery({
    queryKey: ["notes"],
    queryFn: characterService.getSaved,
    staleTime: 5 * 60 * 1000, // 5m
  });
};

export const useAddNote = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      data,
      notes,
    }: {
      data: CharacterAnalysis;
      notes: string;
    }) => {
      return characterService.save({
        character: data.character,
        pinyin: data.pinyin,
        meaning: data.meaning,
        semanticRadical: data.semanticRadical,
        phoneticComponent: data.phoneticComponent,
        frequencyRank: data.frequencyRank,
        strokeCount: data.strokeCount,
        notes: notes,
      });
    },
    // Optimistic Updates
    onMutate: async ({ data, notes }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["notes"] });

      // Snapshot the previous value
      const previousNotes = queryClient.getQueryData<SavedCharacter[]>([
        "notes",
      ]);

      // Create optimistic character
      const optimisticChar: SavedCharacter = {
        _id: `temp-${Date.now()}`,
        userId: "",
        character: data.character,
        pinyin: data.pinyin,
        meaning: data.meaning,
        semanticRadical: data.semanticRadical,
        phoneticComponent: data.phoneticComponent,
        frequencyRank: data.frequencyRank,
        strokeCount: data.strokeCount,
        notes: notes,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Optimistically update the cache
      queryClient.setQueryData<SavedCharacter[]>(["notes"], (old) => [
        optimisticChar,
        ...(old || []),
      ]);

      toast.success(`"${data.character}" saved to notes`);

      // Return context for rollback
      return { previousNotes };
    },
    onError: (_err, _newNote, context) => {
      // Roll back to the snapshot
      queryClient.setQueryData(["notes"], context?.previousNotes);
      toast.error("Character may already be saved");
    },
    onSettled: () => {
      // Always refetch to ensure we have the real ID from DB
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });
};

export const useUpdateNote = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, notes }: { id: string; notes: string }) =>
      characterService.updateNotes(id, notes),
    onMutate: async ({ id, notes }) => {
      await queryClient.cancelQueries({ queryKey: ["notes"] });
      const previousNotes = queryClient.getQueryData<SavedCharacter[]>([
        "notes",
      ]);

      // Optimistically update the specific note
      queryClient.setQueryData<SavedCharacter[]>(["notes"], (old) =>
        old?.map((char) =>
          char._id === id
            ? { ...char, notes, updatedAt: new Date().toISOString() }
            : char,
        ),
      );

      toast.success("Notes updated");
      return { previousNotes };
    },
    onError: (_err, _vars, context) => {
      queryClient.setQueryData(["notes"], context?.previousNotes);
      toast.error("Failed to update notes");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });
};

export const useDeleteNote = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: characterService.remove,
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ["notes"] });
      const previousNotes = queryClient.getQueryData<SavedCharacter[]>([
        "notes",
      ]);

      // Optimistically filter out the deleted item
      queryClient.setQueryData<SavedCharacter[]>(["notes"], (old) =>
        old?.filter((char) => char._id !== id),
      );

      toast.success("Character removed from notes");
      return { previousNotes };
    },
    onError: (_err, _id, context) => {
      queryClient.setQueryData(["notes"], context?.previousNotes);
      toast.error("Failed to remove character");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });
};
