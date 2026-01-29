import { Link } from "react-router";
import { Trash2 } from "lucide-react";
import type { SavedCharacter } from "@/types/character";

interface CharacterCardProps {
    character: SavedCharacter;
    onRemove: (id: string) => void;
    onEditNotes: (id: string, notes: string) => void;
    isEditing: boolean;
    editNotes: string;
    onEditNotesChange: (notes: string) => void;
    onSaveNotes: () => void;
    onCancelEdit: () => void;
}

const CharacterCard = ({
    character,
    onRemove,
    onEditNotes,
    isEditing,
    editNotes,
    onEditNotesChange,
    onSaveNotes,
    onCancelEdit,
}: CharacterCardProps) => {
    return (
        <div className="flex flex-col rounded-xl border border-gray-200 bg-white hover:shadow-soft hover:border-primary transition-all overflow-hidden">
            {/* Clickable card area */}
            <Link
                to={`/character/${character.character}`}
                className="flex items-start gap-3 p-4 cursor-pointer group"
            >
                <span className="text-4xl font-bold text-black">
                    {character.character}
                </span>
                <div className="text-left flex-1">
                    <p className="text-sm font-semibold text-foreground">
                        {character.pinyin}
                    </p>
                    <p className="text-sm text-muted-foreground">{character.meaning}</p>

                    {/* Tags */}
                    <div className="mt-2 flex flex-wrap gap-1.5">
                        {character.semanticRadical && (
                            <span className="text-xs px-2 py-0.5 rounded bg-emerald-100 text-emerald-700">
                                {character.semanticRadical.radical}{" "}
                                {character.semanticRadical.meaning}
                            </span>
                        )}
                        {character.phoneticComponent && (
                            <span className="text-xs px-2 py-0.5 rounded bg-blue-100 text-blue-700">
                                {character.phoneticComponent.component}{" "}
                                {character.phoneticComponent.sound}
                            </span>
                        )}
                        {character.frequencyRank && (
                            <span className="text-xs px-2 py-0.5 rounded bg-gray-100 text-gray-600">
                                #{character.frequencyRank}
                            </span>
                        )}
                    </div>
                </div>

                {/* Remove button - stop propagation */}
                <button
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        onRemove(character._id);
                    }}
                    title="Remove"
                    className="p-1.5 rounded-lg hover:bg-red-100 text-muted-foreground hover:text-red-600 transition-colors cursor-pointer"
                >
                    <Trash2 className="w-4 h-4" />
                </button>
            </Link>

            {/* Notes section - not part of link */}
            <div className="px-4 pb-4 pt-3 border-t border-gray-200">
                {isEditing ? (
                    <div className="space-y-2">
                        <textarea
                            value={editNotes}
                            onChange={(e) => onEditNotesChange(e.target.value)}
                            className="w-full h-16 px-2 py-1.5 text-xs rounded-lg border border-gray-300 bg-white
                focus:outline-none resize-none"
                        />
                        <div className="flex gap-2">
                            <button
                                onClick={onSaveNotes}
                                className="text-xs px-3 py-1 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer"
                            >
                                Save
                            </button>
                            <button
                                onClick={onCancelEdit}
                                className="text-xs px-3 py-1 rounded-md border border-gray-300 hover:bg-gray-50 cursor-pointer"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="flex items-start justify-between gap-2">
                        <p className="text-xs text-muted-foreground flex-1">
                            {character.notes || "No notes yet"}
                        </p>
                        <button
                            onClick={() => onEditNotes(character._id, character.notes || "")}
                            className="text-xs text-primary hover:underline cursor-pointer shrink-0"
                        >
                            Edit
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CharacterCard;
