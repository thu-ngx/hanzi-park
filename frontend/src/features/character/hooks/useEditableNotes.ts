import { useState, useCallback } from "react";
import { useNoteStore } from "../store/useNoteStore";

export function useEditableNotes() {
  const { updateNotes } = useNoteStore();

  const [editingId, setEditingId] = useState<string | null>(null);

  const startEdit = useCallback((id: string) => {
    setEditingId(id);
  }, []);

  const cancelEdit = useCallback(() => {
    setEditingId(null);
  }, []);

  const saveEdit = useCallback(
    async (id: string, notes: string) => {
      await updateNotes(id, notes);
      setEditingId(null);
    },
    [updateNotes],
  );

  return {
    editingId,
    startEdit,
    cancelEdit,
    saveEdit,
  };
}
