import { useEffect, useState, useCallback } from "react";
import Navbar from "@/components/Navbar";
import { useHanziStore } from "@/stores/useHanziStore";
import CharacterCard from "@/components/hanzi/CharacterCard";
import SkeletonCard from "@/components/hanzi/SkeletonCard";
import { Search, Bookmark } from "lucide-react";

const MyCollectionPage = () => {
  const {
    savedCharacters,
    collectionLoading,
    loadSaved,
    removeCharacter,
    updateNotes,
  } = useHanziStore();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editNotes, setEditNotes] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    loadSaved();
  }, [loadSaved]);

  const handleStartEdit = useCallback((id: string, currentNotes: string) => {
    setEditingId(id);
    setEditNotes(currentNotes);
  }, []);

  const handleSaveNotes = useCallback(
    (id: string) => {
      updateNotes(id, editNotes);
      setEditingId(null);
    },
    [editNotes, updateNotes]
  );

  const filtered = searchQuery
    ? savedCharacters.filter(
      (c) =>
        c.character.includes(searchQuery) ||
        c.pinyin.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.meaning.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.notes?.toLowerCase().includes(searchQuery.toLowerCase())
    )
    : savedCharacters;

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-foreground">
                My Collection
              </h3>
              <p className="text-sm text-muted-foreground">
                {savedCharacters.length} saved character
                {savedCharacters.length !== 1 ? "s" : ""}
              </p>
            </div>
            {savedCharacters.length > 0 && (
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search collection..."
                  className="h-9 pl-9 pr-3 w-56 text-sm rounded-lg border border-gray-300 bg-white
                    focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary
                    placeholder:text-muted-foreground"
                />
              </div>
            )}
          </div>

          {/* Loading */}
          {collectionLoading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          )}

          {/* Collection Grid */}
          {!collectionLoading && filtered.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map((char) => (
                <CharacterCard
                  key={char._id}
                  character={char}
                  onRemove={removeCharacter}
                  onEditNotes={handleStartEdit}
                  isEditing={editingId === char._id}
                  editNotes={editNotes}
                  onEditNotesChange={setEditNotes}
                  onSaveNotes={() => handleSaveNotes(char._id)}
                  onCancelEdit={() => setEditingId(null)}
                />
              ))}
            </div>
          )}

          {/* Empty state */}
          {!collectionLoading && savedCharacters.length === 0 && (
            <div className="text-center py-16">
              <div className="mb-4 opacity-30">
                <Bookmark className="inline w-16 h-16" />
              </div>
              <p className="text-muted-foreground mb-2">
                Your collection is empty
              </p>
              <p className="text-sm text-muted-foreground">
                Analyze characters and save them to build your collection
              </p>
            </div>
          )}

          {/* Filtered empty */}
          {!collectionLoading &&
            savedCharacters.length > 0 &&
            filtered.length === 0 && (
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
