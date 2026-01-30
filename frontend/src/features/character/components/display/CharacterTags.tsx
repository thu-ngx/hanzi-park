import type { SemanticRadical, PhoneticComponent } from "../../types/character";

interface CharacterTagsProps {
  semanticRadical?: SemanticRadical | null;
  phoneticComponent?: PhoneticComponent | null;
  frequencyRank?: number | null;
}

const CharacterTags = ({
  semanticRadical,
  phoneticComponent,
  frequencyRank,
}: CharacterTagsProps) => {
  const hasTags = semanticRadical || phoneticComponent || frequencyRank;

  if (!hasTags) return null;

  return (
    <div className="mt-2 flex flex-wrap gap-1.5">
      {semanticRadical && (
        <span className="text-xs px-2 py-0.5 rounded bg-emerald-100 text-emerald-700">
          {semanticRadical.radical} {semanticRadical.meaning}
        </span>
      )}
      {phoneticComponent && (
        <span className="text-xs px-2 py-0.5 rounded bg-blue-100 text-blue-700">
          {phoneticComponent.component} {phoneticComponent.sound}
        </span>
      )}
      {frequencyRank && (
        <span className="text-xs px-2 py-0.5 rounded bg-gray-100 text-gray-600">
          #{frequencyRank}
        </span>
      )}
    </div>
  );
};

export default CharacterTags;
