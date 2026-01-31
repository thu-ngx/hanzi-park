import { Link } from "react-router";
import { Trash2, Pencil } from "lucide-react";
import type { Note } from "@/features/character/types/character";
import CharacterTags from "../display/CharacterTags";
import { Button } from "@/components/ui/button";
import EditNoteDialog from "../note/EditNoteDialog";

interface CharacterCardProps {
  note: Note;
  onRemove: (id: string) => void;
  onSaveNoteContent: (noteContent: string) => void;
}

const CharacterCard = ({
  note,
  onRemove,
  onSaveNoteContent,
}: CharacterCardProps) => {
  return (
    <div className="flex flex-col rounded-xl border border-gray-200 bg-white hover:shadow-soft hover:border-primary transition-all overflow-hidden h-full">
      {/* Clickable card area */}
      <Link
        to={`/character/${note.character}`}
        className="flex items-start gap-3 p-4 cursor-pointer group flex-1"
      >
        <span className="text-4xl font-bold text-black">{note.character}</span>
        <div className="text-left flex-1 min-w-0">
          <p className="text-sm font-semibold text-foreground truncate">
            {note.pinyin}
          </p>
          <p className="text-sm text-muted-foreground truncate">
            {note.meaning}
          </p>

          <CharacterTags
            semanticComponent={note.semanticComponent}
            phoneticComponent={note.phoneticComponent}
            frequencyRank={note.frequencyRank}
          />
        </div>
      </Link>

      {/* Note section with actions */}
      <div className="px-4 pb-4 pt-3 border-t border-gray-200 flex flex-col gap-2">
        <p className="text-xs text-muted-foreground flex-1 wrap-break-word whitespace-pre-wrap">
          {note.noteContent || ""}
        </p>

        <div className="flex justify-end gap-1">
          <EditNoteDialog
            character={note.character}
            initialNoteContent={note.noteContent || ""}
            onSave={onSaveNoteContent}
            trigger={
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/10 cursor-pointer"
                title="Edit note"
              >
                <Pencil className="h-4 w-4" />
                <span className="sr-only">Edit note</span>
              </Button>
            }
          />

          <Button
            variant="ghost"
            size="icon"
            onClick={() => onRemove(note._id)}
            className="h-8 w-8 text-muted-foreground hover:text-red-600 hover:bg-red-50 cursor-pointer"
            title="Remove from collection"
          >
            <Trash2 className="h-4 w-4" />
            <span className="sr-only">Remove</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CharacterCard;
