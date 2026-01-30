import { useState, useCallback } from "react";
import { useCollectionStore } from "../store/useCollectionStore";

export function useEditableNotes() {
  const { updateNotes } = useCollectionStore();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");

  const startEdit = useCallback((id: string, currentNotes: string) => {
    setEditingId(id);
    setEditValue(currentNotes);
  }, []);

  const cancelEdit = useCallback(() => {
    setEditingId(null);
    setEditValue("");
  }, []);

  const saveEdit = useCallback(async () => {
    if (!editingId) return;
    await updateNotes(editingId, editValue);
    setEditingId(null);
    setEditValue("");
  }, [editingId, editValue, updateNotes]);

  return {
    editingId,
    editValue,
    setEditValue,
    startEdit,
    cancelEdit,
    saveEdit,
  };
}
