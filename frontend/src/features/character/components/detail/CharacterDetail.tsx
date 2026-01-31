import { toast } from "@/lib/toast";
import {
  useParentCharacters,
  useDecompositionData,
} from "@/features/character/hooks";
import { useAuthStore } from "@/features/auth/store/useAuthStore";
import StrokeOrderAnimation from "../display/StrokeOrderAnimation";
import CharacterGrid from "./CharacterGrid";
import CharacterTile from "../display/CharacterTile";
import NoteCapture from "../note/NoteCapture";
import type { CharacterAnalysis } from "../../types/character";
import { useNote, useSaveNote } from "../../hooks/useNote";

interface CharacterDetailProps {
  data: CharacterAnalysis | null | undefined;
  isLoading: boolean;
}

const CharacterDetail = ({ data, isLoading }: CharacterDetailProps) => {
  const { accessToken } = useAuthStore();

  const { data: note } = useNote(data?.character);
  const saveNote = useSaveNote();

  const bucketedParents = useParentCharacters(data?.character);
  const decompositionData = useDecompositionData(data?.decomposition);

  const savedNoteContent = note?.noteContent || "";

  if (!data && !isLoading) return null;

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
                            {[
                              ...new Set(
                                [...data.decomposition].filter((char) =>
                                  /\p{Script=Han}/u.test(char),
                                ),
                              ),
                            ].map((char) => {
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
                            Hint: {data.etymology.hint}
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

            {/* Right: Notes Section */}
            <div className="h-full">
              <div className="h-full p-6 rounded-xl bg-white border border-gray-200 flex flex-col gap-3">
                <h3 className="text-sm font-semibold text-gray-700">
                  Personal note
                </h3>
                <NoteCapture
                  key={data.character}
                  initialNoteContent={savedNoteContent}
                  onSave={(noteContent) => {
                    if (!accessToken) {
                      toast.info("Please log in to save notes");
                      return;
                    }
                    saveNote.mutate({ data, noteContent });
                  }}
                />
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
