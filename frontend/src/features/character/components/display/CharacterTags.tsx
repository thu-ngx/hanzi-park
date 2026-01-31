interface SemanticComponent {
  char: string;
  pinyin: string;
  meaning: string;
}

interface PhoneticComponent {
  char: string;
  pinyin: string;
  meaning: string;
}

interface CharacterTagsProps {
  semanticComponent?: SemanticComponent | null;
  phoneticComponent?: PhoneticComponent | null;
  frequencyRank?: number | null;
}

const CharacterTags = ({
  semanticComponent,
  phoneticComponent,
  frequencyRank,
}: CharacterTagsProps) => {
  const hasTags = semanticComponent || phoneticComponent || frequencyRank;

  if (!hasTags) return null;

  return (
    <div className="mt-2 flex flex-wrap gap-1.5">
      {semanticComponent && (
        <span className="text-xs px-2 py-0.5 rounded bg-emerald-100 text-emerald-700">
          {semanticComponent.char} {semanticComponent.meaning}
        </span>
      )}
      {phoneticComponent && (
        <span className="text-xs px-2 py-0.5 rounded bg-blue-100 text-blue-700">
          {phoneticComponent.char} {phoneticComponent.pinyin}
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
