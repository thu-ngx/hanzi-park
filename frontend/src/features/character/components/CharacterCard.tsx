import { Link } from "react-router";
import { Trash2, Pencil } from "lucide-react";
import type { SavedCharacter } from "@/features/character/types/character";
import CharacterTags from "./CharacterTags";
import NoteDisplay from "./note/NoteDisplay";
import EditNoteDialog from "./note/EditNoteDialog";
import { Button } from "@/components/ui/button";

interface CharacterCardProps {
  character: SavedCharacter;
  onRemove: (id: string) => void;
  onSaveNotes: (notes: string) => void;
}

const CharacterCard = ({
  character,
  onRemove,
  onSaveNotes,
}: CharacterCardProps) => {
  return (
    <div className="flex flex-col rounded-xl border border-gray-200 bg-white hover:shadow-soft hover:border-primary transition-all overflow-hidden h-full">
      {/* Clickable card area */}
      <Link
        to={`/character/${character.character}`}
        className="flex items-start gap-3 p-4 cursor-pointer group flex-1"
      >
        <span className="text-4xl font-bold text-black">
          {character.character}
        </span>
        <div className="text-left flex-1 min-w-0">
          <p className="text-sm font-semibold text-foreground truncate">
            {character.pinyin}
          </p>
          <p className="text-sm text-muted-foreground truncate">
            {character.meaning}
          </p>

          <CharacterTags
            semanticRadical={character.semanticRadical}
            phoneticComponent={character.phoneticComponent}
            frequencyRank={character.frequencyRank}
          />
        </div>
      </Link>

      {/* Notes section with actions */}
      <div className="px-4 pb-4 pt-3 border-t border-gray-200 flex flex-col gap-2">
        <NoteDisplay note={character.notes || ""} />

        <div className="flex justify-end gap-1">
          <EditNoteDialog
            character={character.character}
            initialNotes={character.notes || ""}
            onSave={onSaveNotes}
            trigger={
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/10 cursor-pointer"
                title="Edit notes"
              >
                <Pencil className="h-4 w-4" />
                <span className="sr-only">Edit notes</span>
              </Button>
            }
          />

          <Button
            variant="ghost"
            size="icon"
            onClick={() => onRemove(character._id)}
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
