// ============================================
// CHARACTER TYPES
// ============================================

export interface RelatedCharacter {
  char: string;
  pinyin: string[];
  meaning: string | null;
}

export interface FrequencyGroupedList {
  top1000: RelatedCharacter[];
  mid: RelatedCharacter[];
  rest: RelatedCharacter[];
}

export interface ComponentNode {
  char: string;
  role: "semantic" | "phonetic" | "component";
  pinyin: string | null;
  meaning: string | null;
}

export interface ComponentTree {
  char: string;
  children: ComponentNode[];
}

export interface Character {
  character: string;
  pinyin: string[];
  definitions: string[];
  decomposition: string | null;
  etymology: {
    type?: string;
    phonetic?: string;
    semantic?: string;
    hint?: string;
  } | null;
  matches: (number[] | null)[];
  frequencyRank: number | null;

  componentTree: ComponentTree | null;

  usedInCharacters: FrequencyGroupedList;

  semanticComponent: {
    char: string;
    pinyin: string;
    meaning: string;
  } | null;
  semanticSiblings: FrequencyGroupedList;

  phoneticComponent: {
    char: string;
    pinyin: string;
    meaning: string;
  } | null;
  phoneticSiblings: FrequencyGroupedList;
}

export interface CharacterSearchResult {
  character: string;
  pinyin: string;
  meaning: string;
  frequencyRank: number | null;
}

// ============================================
// NOTE TYPES
// ============================================

export interface Note {
  _id: string;
  userId: string;
  character: string;
  pinyin: string;
  meaning: string;
  semanticComponent: {
    char: string;
    pinyin: string;
    meaning: string;
  } | null;
  phoneticComponent: {
    char: string;
    pinyin: string;
    meaning: string;
  } | null;
  frequencyRank: number | null;
  noteContent: string;
  createdAt: string;
  updatedAt: string;
}
