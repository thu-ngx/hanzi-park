import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { characterService } from "../services/characterService";
import { toast } from "@/lib/toast";
import type { Note } from "../types/character";

type NoteData = Pick<
  Note,
  | "character"
  | "pinyin"
  | "meaning"
  | "semanticRadical"
  | "phoneticComponent"
  | "frequencyRank"
>;

export const useNotes = () => {
  return useQuery({
    queryKey: ["notes"],
    queryFn: characterService.getSaved,
    staleTime: 5 * 60 * 1000, // 5m
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
      return characterService.save({
        character: data.character,
        pinyin: data.pinyin,
        meaning: data.meaning,
        semanticRadical: data.semanticRadical,
        phoneticComponent: data.phoneticComponent,
        frequencyRank: data.frequencyRank,
        noteContent,
      });
    },
    onMutate: async ({ data, noteContent }) => {
      await queryClient.cancelQueries({ queryKey: ["notes"] });

      const previousNotes = queryClient.getQueryData<Note[]>([
        "notes",
      ]);

      // Optimistically update or add the character
      queryClient.setQueryData<Note[]>(["notes"], (old) => {
        const existing = old?.find((n) => n.character === data.character);
        if (existing) {
          return old?.map((n) =>
            n.character === data.character
              ? { ...n, noteContent, updatedAt: new Date().toISOString() }
              : n,
          );
        }
        return [
          {
            _id: `temp-${Date.now()}`,
            userId: "",
            character: data.character,
            pinyin: data.pinyin,
            meaning: data.meaning,
            semanticRadical: data.semanticRadical,
            phoneticComponent: data.phoneticComponent,
            frequencyRank: data.frequencyRank,
            noteContent,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          ...(old || []),
        ];
      });

      toast.success("Note saved");
      return { previousNotes };
    },
    onError: (_err, _newNote, context) => {
      queryClient.setQueryData(["notes"], context?.previousNotes);
      toast.error("Failed to save note");
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
      const previousNotes = queryClient.getQueryData<Note[]>([
        "notes",
      ]);

      // Optimistically filter out the deleted item
      queryClient.setQueryData<Note[]>(["notes"], (old) =>
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
