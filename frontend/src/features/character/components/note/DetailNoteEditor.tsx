import { useState } from "react";
import { Button } from "@/components/ui/button";

interface DetailNoteEditorProps {
  initialNotes: string;
  onSave: (notes: string) => void;
}

const DetailNoteEditor = ({ initialNotes, onSave }: DetailNoteEditorProps) => {
  // Use initialNotes only once to set the starting state
  const [editValue, setEditValue] = useState(initialNotes);

  const handleSave = () => {
    onSave(editValue);
  };

  return (
    <div className="space-y-3 flex flex-col h-full">
      <textarea
        value={editValue}
        onChange={(e) => setEditValue(e.target.value)}
        placeholder="Add your learning notes..."
        className="w-full flex-1 px-3 py-2 text-sm rounded-xl border border-gray-300 bg-white focus:outline-none focus:border-primary resize-none"
      />
      <div className="flex gap-2">
        <Button onClick={handleSave} className="cursor-pointer">
          Save to collection
        </Button>
      </div>
    </div>
  );
};

export default DetailNoteEditor;
