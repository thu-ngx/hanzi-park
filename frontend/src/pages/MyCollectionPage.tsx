import { useEffect, useState, useMemo } from "react";
import Navbar from "@/components/layout/Navbar";
import { useEditableNotes } from "@/features/character/hooks";
import CharacterCard from "@/features/character/components/card/CharacterCard";
import SkeletonCard from "@/features/character/components/card/SkeletonCard";
import { Search, Bookmark } from "lucide-react";
import { useCollectionStore } from "@/features/character/store/useCollectionStore";

const MyCollectionPage = () => {
  const { characters, isLoading, load, remove } = useCollectionStore();
  const notesEditor = useEditableNotes();

  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    load();
  }, [load]);

  const filtered = useMemo(() => {
    if (!searchQuery) return characters;

    const q = searchQuery.toLowerCase();
    return characters.filter(
      (c) =>
        c.character.includes(searchQuery) ||
        c.pinyin.toLowerCase().includes(q) ||
        c.meaning.toLowerCase().includes(q) ||
        c.notes?.toLowerCase().includes(q),
    );
  }, [characters, searchQuery]);

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
                {characters.length} saved character
                {characters.length !== 1 ? "s" : ""}
              </p>
            </div>
            {characters.length > 0 && (
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
                <SkeletonCard key={i} />
              ))}
            </div>
          )}

          {/* Collection Grid */}
          {!isLoading && filtered.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map((char) => (
                <CharacterCard
                  key={char._id}
                  character={char}
                  onRemove={remove}
                  onSaveNotes={(notes) => notesEditor.saveEdit(char._id, notes)}
                />
              ))}
            </div>
          )}

          {/* Empty state */}
          {!isLoading && characters.length === 0 && (
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
          {!isLoading && characters.length > 0 && filtered.length === 0 && (
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
