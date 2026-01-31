import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { noteService } from "../services/noteService";
import { toast } from "@/lib/toast";
import type { Note } from "../types/note";

type NoteData = Pick<
  Note,
  | "character"
  | "pinyin"
  | "meaning"
  | "semanticComponent"
  | "phoneticComponent"
  | "frequencyRank"
>;

export const useNotes = () => {
  return useQuery({
    queryKey: ["notes"],
    queryFn: noteService.getAll,
    staleTime: 5 * 60 * 1000, // 5m
  });
};

export const useNote = (character: string | undefined) => {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: ["note", character],
    queryFn: () => noteService.getByCharacter(character!),
    enabled: !!character,
    staleTime: 5 * 60 * 1000, // 5m
    // Check the "notes" list cache first before fetching
    initialData: () => {
      const allNotes = queryClient.getQueryData<Note[]>(["notes"]);
      return allNotes?.find((n) => n.character === character);
    },
  });
};

export const useSaveNote = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      data,
      noteContent,
    }: {
      data: NoteData;
      noteContent: string;
    }) => {
      return noteService.save({
        character: data.character,
        pinyin: data.pinyin,
        meaning: data.meaning,
        semanticComponent: data.semanticComponent,
        phoneticComponent: data.phoneticComponent,
        frequencyRank: data.frequencyRank,
        noteContent,
      });
    },
    onMutate: async ({ data, noteContent }) => {
      await queryClient.cancelQueries({ queryKey: ["notes"] });
      await queryClient.cancelQueries({ queryKey: ["note", data.character] });

      const previousNotes = queryClient.getQueryData<Note[]>(["notes"]);
      const previousNote = queryClient.getQueryData<Note | null>([
        "note",
        data.character,
      ]);

      const optimisticNote: Note = {
        _id: previousNote?._id || `temp-${Date.now()}`,
        userId: previousNote?.userId || "",
        character: data.character,
        pinyin: data.pinyin,
        meaning: data.meaning,
        semanticComponent: data.semanticComponent,
        phoneticComponent: data.phoneticComponent,
        frequencyRank: data.frequencyRank,
        noteContent,
        createdAt: previousNote?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Optimistically update the individual note cache
      queryClient.setQueryData<Note | null>(
        ["note", data.character],
        optimisticNote,
      );

      // Optimistically update or add to the notes list
      queryClient.setQueryData<Note[]>(["notes"], (old) => {
        const existing = old?.find((n) => n.character === data.character);
        if (existing) {
          return old?.map((n) =>
            n.character === data.character ? optimisticNote : n,
          );
        }
        return [optimisticNote, ...(old || [])];
      });

      toast.success("Note saved in collection");
      return { previousNotes, previousNote };
    },
    onError: (_err, { data }, context) => {
      queryClient.setQueryData(["notes"], context?.previousNotes);
      queryClient.setQueryData(["note", data.character], context?.previousNote);
      toast.error("Failed to save note");
    },
    onSettled: (_data, _error, { data }) => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      queryClient.invalidateQueries({ queryKey: ["note", data.character] });
    },
  });
};

export const useDeleteNote = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: noteService.remove,
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ["notes"] });
      const previousNotes = queryClient.getQueryData<Note[]>(["notes"]);

      // Optimistically filter out the deleted item
      queryClient.setQueryData<Note[]>(["notes"], (old) =>
        old?.filter((char) => char._id !== id),
      );

      toast.success("Character removed from collection");
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
