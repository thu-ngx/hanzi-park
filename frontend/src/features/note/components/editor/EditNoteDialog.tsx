import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";

interface EditNoteDialogProps {
  initialNoteContent: string;
  character: string;
  onSave: (noteContent: string) => void;
  trigger: React.ReactNode;
}

const EditNoteDialog = ({
  initialNoteContent,
  character,
  onSave,
  trigger,
}: EditNoteDialogProps) => {
  const [noteContent, setNoteContent] = useState(initialNoteContent);
  const [open, setOpen] = useState(false);

  const handleSave = () => {
    onSave(noteContent);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="bg-background border-gray-200">
        <DialogHeader>
          <DialogTitle>Edit note for {character}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Textarea
            value={noteContent}
            onChange={(e) => setNoteContent(e.target.value)}
            placeholder="Add your learning notes..."
            className="resize-none min-h-120px bg-white"
          />
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button onClick={handleSave}>Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditNoteDialog;
