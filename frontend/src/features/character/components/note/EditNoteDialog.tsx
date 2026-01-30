import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea"; // Assuming Shadcn Textarea exists or use standard
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
  initialNotes: string;
  character: string;
  onSave: (notes: string) => void;
  trigger: React.ReactNode;
}

const EditNoteDialog = ({
  initialNotes,
  character,
  onSave,
  trigger,
}: EditNoteDialogProps) => {
  const [notes, setNotes] = useState(initialNotes);
  const [open, setOpen] = useState(false);

  const handleSave = () => {
    onSave(notes);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-425px">
        <DialogHeader>
          <DialogTitle>Edit note for {character}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add your learning notes..."
            className="resize-none min-h-120px"
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
