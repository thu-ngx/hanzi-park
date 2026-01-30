export interface SemanticRadical {
  radical: string;
  meaning: string;
  pinyin?: string;
}

export interface PhoneticComponent {
  component: string;
  sound: string;
  meaning?: string;
  pinyin?: string;
}

export interface RichFamilyCharacter {
  char: string;
  pinyin: string[];
  meaning: string | null;
}

export interface FrequencyBucketedFamily {
  top1000: RichFamilyCharacter[];
  mid: RichFamilyCharacter[];
  rest: RichFamilyCharacter[];
}

export interface CharacterAnalysis {
  character: string;
  pinyin: string;
  meaning: string;
  strokeCount: number;
  frequencyRank: number | null;
  semanticRadical: SemanticRadical | null;
  phoneticComponent: PhoneticComponent | null;
  phoneticFamily: FrequencyBucketedFamily;
  semanticFamily: FrequencyBucketedFamily;
  etymology?: {
    type?: string;
    phonetic?: string;
    semantic?: string;
    hint?: string;
  };
  decomposition?: string;
}

export interface Note {
  _id: string;
  userId: string;
  character: string;
  pinyin: string;
  meaning: string;
  semanticRadical: SemanticRadical | null;
  phoneticComponent: PhoneticComponent | null;
  frequencyRank: number | null;
  noteContent: string;
  createdAt: string;
  updatedAt: string;
}

// Composition Graph types (from /api/dictionary)

export interface TreeNode {
  char: string;
  role: "semantic" | "phonetic" | "component";
  pinyin: string | null;
  meaning: string | null;
}

export interface CompositionTree {
  char: string;
  children: TreeNode[];
}

export interface ParentCharacter {
  char: string;
  pinyin: string[];
  meaning: string | null;
}

export interface DictionaryEntry {
  character: string;
  pinyin: string[];
  definitions: string[];
  decomposition: string;
  etymology: {
    type?: string;
    phonetic?: string;
    semantic?: string;
    hint?: string;
  };
  tree: CompositionTree | null;
  parents: ParentCharacter[];
}

export interface SearchResult {
  character: string;
  pinyin: string;
  meaning: string;
  frequencyRank: number | null;
}
