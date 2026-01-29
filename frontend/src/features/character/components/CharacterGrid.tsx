import { useState } from "react";
import { ChevronRight } from "lucide-react";
import CharacterTile from "./CharacterTile";
import type { RichFamilyCharacter, FrequencyBucketedFamily } from "@/features/character/types/character";

interface CharacterGridProps {
  title: string;
  data: FrequencyBucketedFamily;
}

interface SectionProps {
  label: string;
  chars: RichFamilyCharacter[];
}

const GridSection = ({ label, chars }: SectionProps) => {
  const [expanded, setExpanded] = useState(true);

  if (chars.length === 0) return null;

  return (
    <div className="mb-4">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-2 text-sm font-medium text-gray-600 mb-2 hover:text-gray-900 transition-colors cursor-pointer"
      >
        <ChevronRight
          className={`w-4 h-4 transition-transform ${expanded ? "rotate-90" : ""}`}
        />
        {label}
        <span className="text-gray-400">({chars.length})</span>
      </button>
      {expanded && (
        <div className="flex flex-wrap gap-2">
          {chars.map((item) => (
            <CharacterTile
              key={item.char}
              char={item.char}
              pinyin={item.pinyin}
              meaning={item.meaning}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const CharacterGrid = ({ title, data }: CharacterGridProps) => {
  const totalCount = data.top1000.length + data.mid.length + data.rest.length;

  if (totalCount === 0) return null;

  return (
    <div className="bg-muted rounded-xl p-6 border border-gray-200">
      <h4 className="text-lg font-semibold text-gray-900 mb-4">
        {title}
        <span className="ml-2 text-gray-500 font-normal text-sm">
          ({totalCount})
        </span>
      </h4>

      <GridSection label="Core (Top 1000)" chars={data.top1000} />
      <GridSection label="Common (1001-2000)" chars={data.mid} />
      <GridSection label="Less Common" chars={data.rest} />
    </div>
  );
};

export default CharacterGrid;
