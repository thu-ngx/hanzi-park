import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface NoteCaptureProps {
  initialNoteContent: string;
  onSave: (noteContent: string) => void;
}

const NoteCapture = ({ initialNoteContent, onSave }: NoteCaptureProps) => {
  const [editValue, setEditValue] = useState(initialNoteContent);

  const handleSave = () => {
    onSave(editValue);
  };

  return (
    <div className="space-y-3 flex flex-col h-full">
      <Textarea
        value={editValue}
        onChange={(e) => setEditValue(e.target.value)}
        placeholder="Add your learning notes..."
        className="w-full flex-1 px-3 py-2 text-sm rounded-xl border border-gray-300 bg-white focus:outline-none focus:border-primary resize-none"
      />
      <Button onClick={handleSave} className="w-fit cursor-pointer mx-auto">
        Save note
      </Button>
    </div>
  );
};

export default NoteCapture;
