import { useState, useCallback } from "react";
import { useCollectionStore } from "../store/useCollectionStore";

export function useEditableNotes() {
  const { updateNotes } = useCollectionStore();

  const [editingId, setEditingId] = useState<string | null>(null);

  const startEdit = useCallback((id: string) => {
    setEditingId(id);
  }, []);

  const cancelEdit = useCallback(() => {
    setEditingId(null);
  }, []);

  const saveEdit = useCallback(async (id: string, notes: string) => {
    await updateNotes(id, notes);
    setEditingId(null);
  }, [updateNotes]);

  return {
    editingId,
    startEdit,
    cancelEdit,
    saveEdit,
  };
}
