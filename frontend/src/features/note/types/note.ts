export interface NoteComponent {
  char: string;
  pinyin: string;
  meaning: string;
}

export interface Note {
  _id: string;
  userId: string;
  character: string;
  pinyin: string;
  meaning: string;
  semanticComponent: NoteComponent | null;
  phoneticComponent: NoteComponent | null;
  frequencyRank: number | null;
  noteContent: string;
  createdAt: string;
  updatedAt: string;
}
