import { useState, useMemo, useEffect } from "react";
import { toast } from "@/lib/toast";
import { useCollectionStore } from "@/features/character/store";
import { useParentCharacters, useDecompositionData } from "@/features/character/hooks";
import { useAuthStore } from "@/features/auth/store/useAuthStore";
import StrokeOrderAnimation from "./StrokeOrderAnimation";
import CharacterGrid from "./CharacterGrid";
import CharacterTile from "./CharacterTile";
import type { CharacterAnalysis } from "../types/character";

interface CharacterDetailProps {
  data: CharacterAnalysis | null;
  isLoading: boolean;
}

const CharacterDetail = ({ data, isLoading }: CharacterDetailProps) => {
  const { save, findByChar } = useCollectionStore();
  const { accessToken } = useAuthStore();

  // Custom hooks for related data
  const bucketedParents = useParentCharacters(data?.character);
  const decompositionData = useDecompositionData(data?.decomposition);

  // Get saved notes for current character
  const savedNotes = useMemo(() => {
    if (!data) return "";
    const saved = findByChar(data.character);
    return saved?.notes || "";
  }, [data, findByChar]);

  // Local notes state
  const [notes, setNotes] = useState("");

  useEffect(() => {
    setNotes(savedNotes);
  }, [data?.character, savedNotes]); // Only run when character or savedNotes changes

  if (!data && !isLoading) return null;

  const handleSave = () => {
    if (!data) return;

    if (!accessToken) {
      toast.info("Please log in to save notes to your collection");
      return;
    }

    save(data, notes);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Loading state */}
      {isLoading && (
        <div className="flex flex-col items-center gap-4 py-16">
          <div className="w-12 h-12 border-4 border-gray-200 border-t-primary rounded-full animate-spin" />
          <p className="text-gray-500">Loading character...</p>
        </div>
      )}

      {data && !isLoading && (
        <>
          {/* Main content grid */}
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left: Character + Stroke Animation */}
            <div className="lg:col-span-2 space-y-6">
              <div className="p-8 rounded-2xl bg-white border border-gray-200 shadow-soft">
                <div className="flex flex-col gap-6">
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="flex flex-col items-center gap-4">
                      <StrokeOrderAnimation
                        character={data.character}
                        size={150}
                      />
                      {/* Decomposition */}
                      {data.decomposition && (
                        <div className="w-fit mx-auto ">
                          <p className="font-mono text-base text-gray-800">
                            {data.decomposition}
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="flex-1 text-center md:text-left space-y-3">
                      <div className="flex items-center justify-center md:justify-start">
                        <p className="text-2xl text-gray-700">
                          <span className="font-chinese">{data.character}</span>{" "}
                          <span className="italic">{data.pinyin}</span>
                        </p>
                        {data.decomposition && (
                          <div className="flex items-start gap-2 ml-4">
                            {[...new Set([...data.decomposition].filter((char) => /\p{Script=Han}/u.test(char)))]
                              .map((char) => {
                                const isSemantic =
                                  data.semanticRadical?.radical === char;
                                const isPhonetic =
                                  data.phoneticComponent?.component === char;
                                const charData = decompositionData.get(char);

                                return (
                                  <CharacterTile
                                    key={char}
                                    char={char}
                                    pinyin={charData?.pinyin}
                                    meaning={charData?.meaning}
                                    role={
                                      isSemantic
                                        ? "semantic"
                                        : isPhonetic
                                          ? "phonetic"
                                          : undefined
                                    }
                                    variant="inline"
                                  />
                                );
                              })}
                          </div>
                        )}
                      </div>
                      <p className="text-xl text-gray-600">{data.meaning}</p>
                      {data.etymology?.hint && (
                        <div className=" text-amber-700">
                          <p className="italic text-lg">
                            {data.etymology.hint}
                          </p>
                        </div>
                      )}

                      <div className="flex flex-wrap gap-2 justify-center md:justify-start mt-4">
                        {data.frequencyRank && (
                          <span className="text-sm px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 font-medium">
                            #{data.frequencyRank} common
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Notes + Save */}
            <div className="space-y-6">
              <div className="p-6 rounded-xl bg-white border border-gray-200 space-y-3">
                <h3 className="text-sm font-semibold text-gray-700">
                  Personal Notes
                </h3>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add your learning notes..."
                  className="w-full h-24 px-3 py-2 text-sm rounded-xl border border-gray-300 bg-white
                    focus:outline-none focus:border-primary
                    placeholder:text-muted-foreground resize-none"
                />
                <button
                  onClick={handleSave}
                  className="w-full px-6 py-2.5 rounded-xl bg-primary text-primary-foreground
                    font-medium text-sm hover:bg-primary/90 transition-colors cursor-pointer"
                >
                  Save to Collection
                </button>
              </div>
            </div>
          </div>

          {/* Phonetic Family */}
          <CharacterGrid
            title={`Phonetic Family ${data.phoneticComponent?.component ?? ""}`}
            data={data.phoneticFamily}
          />

          {/* Semantic Family */}
          <CharacterGrid
            title={`Semantic Family ${data.semanticRadical?.radical ?? ""}`}
            data={data.semanticFamily}
          />

          {/* Parent Characters */}
          <CharacterGrid
            title={`${data.character} appears in`}
            data={bucketedParents}
          />
        </>
      )}
    </div>
  );
};

export default CharacterDetail;
