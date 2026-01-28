import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router";
import { useHanziStore } from "@/stores/useHanziStore";
import StrokeOrderAnimation from "./StrokeOrderAnimation";
import CharacterGrid from "./CharacterGrid";
import { hanziService } from "@/services/hanziService";

const CharacterDetail = () => {
  const navigate = useNavigate();
  const { activeCharacter, activeLoading, saveCharacter, savedCharacters } =
    useHanziStore();

  const [notes, setNotes] = useState("");
  const [parentCharacters, setParentCharacters] = useState<
    Array<{
      char: string;
      pinyin: string[];
      meaning: string | null;
      frequencyRank?: number | null;
    }>
  >([]);

  // Load saved notes when activeCharacter changes
  useEffect(() => {
    if (activeCharacter) {
      const saved = savedCharacters.find(
        (c) => c.character === activeCharacter.character,
      );
      setNotes(saved?.notes || "");
    } else {
      setNotes("");
    }
  }, [activeCharacter, savedCharacters]);

  // Fetch parent characters when activeCharacter changes
  useEffect(() => {
    if (activeCharacter) {
      hanziService
        .getDictionaryEntry(activeCharacter.character)
        .then((entry) => {
          setParentCharacters(entry.parents || []);
        })
        .catch(() => {
          setParentCharacters([]);
        });
    } else {
      setParentCharacters([]);
    }
  }, [activeCharacter]);

  // Bucket parent characters by frequency (memoized for performance)
  const bucketedParents = useMemo(() => {
    const buckets = {
      top1000: [] as Array<{
        char: string;
        pinyin: string[];
        meaning: string | null;
      }>,
      mid: [] as Array<{
        char: string;
        pinyin: string[];
        meaning: string | null;
      }>,
      rest: [] as Array<{
        char: string;
        pinyin: string[];
        meaning: string | null;
      }>,
    };

    for (const parent of parentCharacters) {
      const rank = parent.frequencyRank;
      if (rank && rank <= 1000) {
        buckets.top1000.push(parent);
      } else if (rank && rank <= 2000) {
        buckets.mid.push(parent);
      } else {
        buckets.rest.push(parent);
      }
    }

    return buckets;
  }, [parentCharacters]);

  if (!activeCharacter && !activeLoading) return null;

  const data = activeCharacter;

  const handleSave = () => {
    if (data) {
      saveCharacter(data, notes);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Loading state */}
      {activeLoading && (
        <div className="flex flex-col items-center gap-4 py-16">
          <div className="w-12 h-12 border-4 border-gray-200 border-t-primary rounded-full animate-spin" />
          <p className="text-gray-500">Loading character...</p>
        </div>
      )}

      {data && !activeLoading && (
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
                        <div className="w-full p-3 rounded-xl bg-gray-50 border border-gray-200">
                          <p className="font-mono text-base text-gray-800">
                            {data.decomposition}
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="flex-1 text-center md:text-left space-y-3">
                      <p className="text-3xl font-semibold text-gray-700">
                        {data.pinyin}
                      </p>
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

            {/* Right: Radical & Component cards */}
            <div className="space-y-6">
              {/* Semantic Radical */}
              {data.semanticRadical && (
                <div
                  className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 cursor-pointer hover:opacity-75 transition-opacity"
                  onClick={() =>
                    navigate(`/character/${data.semanticRadical!.radical}`)
                  }
                >
                  <h3 className="text-xs font-semibold text-emerald-700 uppercase tracking-wider mb-2">
                    Semantic Radical
                  </h3>
                  <div className="flex items-center gap-3">
                    <span className="text-4xl font-bold text-emerald-800">
                      {data.semanticRadical?.radical}
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-emerald-900">
                        {data.semanticRadical?.meaning}
                      </p>
                      {data.semanticRadical?.pinyin && (
                        <p className="text-xs text-emerald-600">
                          {data.semanticRadical.pinyin}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Phonetic Component */}
              {data.phoneticComponent && (
                <div
                  className="p-4 rounded-xl bg-blue-50 border border-blue-200 cursor-pointer hover:opacity-75 transition-opacity"
                  onClick={() =>
                    navigate(`/character/${data.phoneticComponent!.component}`)
                  }
                >
                  <h3 className="text-xs font-semibold text-blue-700 uppercase tracking-wider mb-2">
                    Phonetic Component
                  </h3>
                  <div className="flex items-center gap-3">
                    <span className="text-4xl font-bold text-blue-800">
                      {data.phoneticComponent?.component}
                    </span>
                    <div>
                      {data.phoneticComponent?.meaning && (
                        <p className="text-sm font-semibold text-blue-900">
                          {data.phoneticComponent.meaning}
                        </p>
                      )}
                      {data.phoneticComponent?.pinyin && (
                        <p className="text-xs text-blue-600">
                          {data.phoneticComponent.pinyin}
                        </p>
                      )}
                      {!data.phoneticComponent?.meaning &&
                        !data.phoneticComponent?.pinyin && (
                          <p className="text-sm font-semibold text-blue-900">
                            Sound: {data.phoneticComponent?.sound}
                          </p>
                        )}
                    </div>
                  </div>
                </div>
              )}

              {/* Notes + Save */}
              <div className="p-6 rounded-xl bg-white border border-gray-200 space-y-3">
                <h3 className="text-sm font-semibold text-gray-700">
                  Personal Notes
                </h3>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add your learning notes..."
                  className="w-full h-24 px-3 py-2 text-sm rounded-xl border border-gray-300 bg-white
                    focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary
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

          {/* Related characters - Full width below */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Phonetic Family */}
            <CharacterGrid title={`Phonetic Family ${data.phoneticComponent?.component ?? ""}`} data={data.phoneticFamily} />

            {/* Semantic Family */}
            <CharacterGrid title={`Semantic Family ${data.semanticRadical?.radical ?? ""}`} data={data.semanticFamily} />
          </div>

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
