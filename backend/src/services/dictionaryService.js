import DictionaryCharacter from "../models/DictionaryCharacter.js";

export async function buildTree(character) {
  const doc = await DictionaryCharacter.findOne({ character }).lean();
  if (!doc) return null;

  const children = [];
  for (const comp of doc.components) {
    const childDoc = await DictionaryCharacter.findOne(
      { character: comp },
      { pinyin: 1, definitions: 1, _id: 0 },
    ).lean();

    let role = "component";
    if (doc.etymology?.type === "pictophonetic") {
      if (doc.etymology.semantic === comp) role = "semantic";
      else if (doc.etymology.phonetic === comp) role = "phonetic";
    }

    children.push({
      char: comp,
      role,
      pinyin: childDoc?.pinyin?.[0] || null,
      meaning: childDoc?.definitions?.[0] || null,
    });
  }

  return { char: character, children };
}

export async function findParents(character) {
  const parents = await DictionaryCharacter.find(
    { components: character },
    { character: 1, pinyin: 1, definitions: 1, frequencyRank: 1, _id: 0 },
  )
    .limit(50)
    .lean();

  return parents.map((p) => ({
    char: p.character,
    pinyin: p.pinyin || [],
    meaning: p.definitions?.[0] || null,
    frequencyRank: p.frequencyRank || null,
  }));
}

export async function lookupCharacter(character) {
  const doc = await DictionaryCharacter.findOne({ character }).lean();
  if (!doc) return null;

  const tree = await buildTree(character);
  const parents = await findParents(character);

  return {
    character: doc.character,
    pinyin: doc.pinyin,
    definitions: doc.definitions,
    decomposition: doc.decomposition,
    etymology: doc.etymology,
    matches: doc.matches,
    frequencyRank: doc.frequencyRank,
    tree,
    parents,
  };
}

/**
 * Bucket characters by frequency rank
 */
function bucketByFrequency(characters) {
  const top1000 = [];
  const mid = [];
  const rest = [];

  for (const char of characters) {
    const rank = char.frequencyRank;
    if (rank && rank <= 1000) {
      top1000.push(char.character);
    } else if (rank && rank <= 2000) {
      mid.push(char.character);
    } else {
      rest.push(char.character);
    }
  }

  return { top1000, mid, rest };
}

/**
 * Get characters sharing the same semantic component (radical)
 */
async function getSemanticFamily(semanticComponent, excludeChar) {
  if (!semanticComponent) return { top1000: [], mid: [], rest: [] };

  const docs = await DictionaryCharacter.find(
    {
      "etymology.semantic": semanticComponent,
      character: { $ne: excludeChar },
    },
    { character: 1, frequencyRank: 1, _id: 0 },
  )
    .limit(100)
    .lean();

  return bucketByFrequency(docs);
}

/**
 * Get characters sharing the same phonetic component
 */
async function getPhoneticFamily(phoneticComponent, excludeChar) {
  if (!phoneticComponent) return { top1000: [], mid: [], rest: [] };

  const docs = await DictionaryCharacter.find(
    {
      "etymology.phonetic": phoneticComponent,
      character: { $ne: excludeChar },
    },
    { character: 1, frequencyRank: 1, _id: 0 },
  )
    .limit(100)
    .lean();

  return bucketByFrequency(docs);
}

/**
 * Lookup a character - main function for the lookup endpoint
 * Returns character analysis with frequency-bucketed families
 */
export async function analyzeCharacter(character) {
  const doc = await DictionaryCharacter.findOne({ character }).lean();
  if (!doc) return null;

  const semanticComponent = doc.etymology?.semantic || null;
  const phoneticComponent = doc.etymology?.phonetic || null;

  // Get family members bucketed by frequency
  const [semanticFamily, phoneticFamily] = await Promise.all([
    getSemanticFamily(semanticComponent, character),
    getPhoneticFamily(phoneticComponent, character),
  ]);

  // Build semantic radical info
  let semanticRadical = null;
  if (semanticComponent) {
    const radDoc = await DictionaryCharacter.findOne(
      { character: semanticComponent },
      { pinyin: 1, definitions: 1, _id: 0 },
    ).lean();
    semanticRadical = {
      radical: semanticComponent,
      meaning: radDoc?.definitions?.[0] || "",
      pinyin: radDoc?.pinyin?.[0] || "",
      position: "", // Position info not available in current data
    };
  }

  // Build phonetic component info
  let phoneticComponentInfo = null;
  if (phoneticComponent) {
    const phonDoc = await DictionaryCharacter.findOne(
      { character: phoneticComponent },
      { pinyin: 1, _id: 0 },
    ).lean();
    phoneticComponentInfo = {
      component: phoneticComponent,
      sound: phonDoc?.pinyin?.[0] || "",
    };
  }

  return {
    character: doc.character,
    pinyin: doc.pinyin?.[0] || "",
    meaning: doc.definitions?.join("; ") || "",
    strokeCount: doc.matches?.[0]?.length || 0, // Matches array length approximates strokes
    frequencyRank: doc.frequencyRank || null,
    semanticRadical,
    phoneticComponent: phoneticComponentInfo,
    phoneticFamily,
    semanticFamily,
    etymology: doc.etymology,
    decomposition: doc.decomposition,
  };
}

/**
 * Search characters by character, pinyin, or definition
 */
export async function searchCharacters(query) {
  const trimmed = query.trim();

  // If single character, do exact match first
  if (trimmed.length === 1) {
    const exact = await DictionaryCharacter.findOne(
      { character: trimmed },
      { character: 1, pinyin: 1, definitions: 1, frequencyRank: 1, _id: 0 },
    ).lean();
    if (exact) {
      return [
        {
          character: exact.character,
          pinyin: exact.pinyin?.[0] || "",
          meaning: exact.definitions?.[0] || "",
          frequencyRank: exact.frequencyRank,
        },
      ];
    }
  }

  // Search by pinyin or definition
  const results = await DictionaryCharacter.find(
    {
      $or: [
        { pinyin: { $regex: trimmed, $options: "i" } },
        { definitions: { $regex: trimmed, $options: "i" } },
      ],
    },
    { character: 1, pinyin: 1, definitions: 1, frequencyRank: 1, _id: 0 },
  )
    .sort({ frequencyRank: 1 }) // Most common first
    .limit(50)
    .lean();

  return results.map((r) => ({
    character: r.character,
    pinyin: r.pinyin?.[0] || "",
    meaning: r.definitions?.[0] || "",
    frequencyRank: r.frequencyRank,
  }));
}
