import { toast } from "@/lib/toast";
import { useAuthStore } from "@/features/auth/store/useAuthStore";
import StrokeOrderAnimation from "../display/StrokeOrderAnimation";
import CharacterGrid from "./CharacterGrid";
import CharacterTile from "../display/CharacterTile";
import NoteCapture from "@/features/note/components/editor/NoteCapture";
import type { Character } from "../../types/character";
import { useNote, useSaveNote } from "@/features/note/hooks/useNote";

interface CharacterDetailProps {
  data: Character | null | undefined;
  isLoading: boolean;
}

const CharacterDetail = ({ data, isLoading }: CharacterDetailProps) => {
  const { accessToken } = useAuthStore();

  const { data: note } = useNote(data?.character);
  const saveNote = useSaveNote();

  const savedNoteContent = note?.noteContent || "";

  if (!data && !isLoading) return null;

  // Format pinyin and meaning for display
  const displayPinyin = data?.pinyin?.join(", ") || "";
  const displayMeaning = data?.definitions?.join("; ") || "";

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
                          <span className="italic">{displayPinyin}</span>
                        </p>
                        {data.componentTree &&
                          data.componentTree.children.length > 0 && (
                            <div className="flex items-start gap-2 ml-4">
                              {data.componentTree.children.map((comp) => (
                                <CharacterTile
                                  key={comp.char}
                                  char={comp.char}
                                  pinyin={
                                    comp.pinyin ? [comp.pinyin] : undefined
                                  }
                                  meaning={comp.meaning}
                                  role={
                                    comp.role === "component"
                                      ? undefined
                                      : comp.role
                                  }
                                  variant="inline"
                                />
                              ))}
                            </div>
                          )}
                      </div>
                      <p className="text-xl text-gray-600">{displayMeaning}</p>
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
                      toast.info("Please log in to save note");
                      return;
                    }
                    saveNote.mutate({
                      data: {
                        character: data.character,
                        pinyin: displayPinyin,
                        meaning: displayMeaning,
                        semanticComponent: data.semanticComponent,
                        phoneticComponent: data.phoneticComponent,
                        frequencyRank: data.frequencyRank,
                      },
                      noteContent,
                    });
                  }}
                />
              </div>
            </div>
          </div>

          {/* Phonetic Family */}
          <CharacterGrid
            title={`Phonetic Family ${data.phoneticComponent?.char ?? ""}`}
            data={data.phoneticSiblings}
          />

          {/* Semantic Family */}
          <CharacterGrid
            title={`Semantic Family ${data.semanticComponent?.char ?? ""}`}
            data={data.semanticSiblings}
          />

          {/* Parent Characters */}
          <CharacterGrid
            title={`${data.character} appears in`}
            data={data.usedInCharacters}
          />
        </>
      )}
    </div>
  );
};

export default CharacterDetail;
