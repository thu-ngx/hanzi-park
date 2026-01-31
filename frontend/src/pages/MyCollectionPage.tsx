import { useState, useMemo } from "react";
import Navbar from "@/components/layout/Navbar";
import NoteCard from "@/features/note/components/card/NoteCard";
import NoteCardSkeleton from "@/features/note/components/card/NoteCardSkeleton";
import { Search, Bookmark } from "lucide-react";
import {
  useNotes,
  useDeleteNote,
  useSaveNote,
} from "@/features/note/hooks/useNote";

const MyCollectionPage = () => {
  const { data: notes = [], isLoading } = useNotes();
  const deleteNote = useDeleteNote();
  const saveNote = useSaveNote();

  const [searchQuery, setSearchQuery] = useState("");

  const filtered = useMemo(() => {
    if (!searchQuery) return notes;

    const q = searchQuery.toLowerCase();
    return notes.filter(
      (n) =>
        n.character.includes(searchQuery) ||
        n.pinyin.toLowerCase().includes(q) ||
        n.meaning.toLowerCase().includes(q) ||
        n.noteContent?.toLowerCase().includes(q),
    );
  }, [notes, searchQuery]);

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold text-foreground">
                My Collection
              </h3>
              <p className="text-sm text-muted-foreground">
                {notes.length} saved character
                {notes.length !== 1 ? "s" : ""}
              </p>
            </div>
            {notes.length > 0 && (
              <div className="relative w-full sm:w-auto">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search collection..."
                  className="h-9 pl-9 pr-3 w-full sm:w-56 text-sm rounded-lg border border-gray-300 bg-white
                    focus:outline-none focus:border-primary
                    placeholder:text-muted-foreground"
                />
              </div>
            )}
          </div>

          {/* Loading */}
          {isLoading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <NoteCardSkeleton key={i} />
              ))}
            </div>
          )}

          {/* Collection Grid */}
          {!isLoading && filtered.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map((note) => (
                <NoteCard
                  key={note._id}
                  note={note}
                  onRemove={(id) => deleteNote.mutate(id)}
                  onSaveNoteContent={(noteContent) =>
                    saveNote.mutate({ data: note, noteContent })
                  }
                />
              ))}
            </div>
          )}

          {/* Empty state */}
          {!isLoading && notes.length === 0 && (
            <div className="text-center py-16">
              <div className="mb-4 opacity-30">
                <Bookmark className="inline w-16 h-16" />
              </div>
              <p className="text-muted-foreground mb-2">
                Your collection is empty
              </p>
              <p className="text-sm text-muted-foreground">
                Look up characters and save them to build your collection
              </p>
            </div>
          )}

          {/* Filtered empty */}
          {!isLoading && notes.length > 0 && filtered.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                No characters match your search
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default MyCollectionPage;
