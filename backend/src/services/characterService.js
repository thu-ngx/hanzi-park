import * as characterRepo from "../repositories/characterRepository.js";

/**
 * Service for Chinese character lookup, analysis, and search
 */

// ============================================
// HELPER FUNCTIONS (private - not exported)
// ============================================

/**
 * Groups characters into frequency tiers: top1000, mid (1001-2000), rest
 */
function groupByFrequencyTier(characters) {
  const top1000 = [];
  const mid = [];
  const rest = [];

  for (const char of characters) {
    const rank = char.frequencyRank;
    const richChar = {
      char: char.character,
      pinyin: char.pinyin || [],
      meaning: char.definitions?.[0] || null,
    };
    if (rank && rank <= 1000) {
      top1000.push(richChar);
    } else if (rank && rank <= 2000) {
      mid.push(richChar);
    } else {
      rest.push(richChar);
    }
  }

  return { top1000, mid, rest };
}

/**
 * Builds component tree showing the character's immediate components with roles
 */
async function buildComponentTree(character) {
  const doc = await characterRepo.findOne(character);
  if (!doc || !doc.components || doc.components.length === 0) return null;

  const children = [];
  for (const comp of doc.components) {
    const childDoc = await characterRepo.findOneWithFields(comp, {
      pinyin: 1,
      definitions: 1,
      _id: 0,
    });

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

/**
 * Finds characters that contain the given character as a component
 */
async function findCharactersContaining(character) {
  const parents = await characterRepo.findContainingComponent(character);
  return groupByFrequencyTier(parents);
}

/**
 * Finds sibling characters sharing the same semantic component
 */
async function findSemanticSiblings(semanticComponent, excludeChar) {
  if (!semanticComponent) return { top1000: [], mid: [], rest: [] };

  const docs = await characterRepo.findBySemanticComponent(
    semanticComponent,
    excludeChar,
  );
  return groupByFrequencyTier(docs);
}

/**
 * Finds sibling characters sharing the same phonetic component
 */
async function findPhoneticSiblings(phoneticComponent, excludeChar) {
  if (!phoneticComponent) return { top1000: [], mid: [], rest: [] };

  const docs = await characterRepo.findByPhoneticComponent(
    phoneticComponent,
    excludeChar,
  );
  return groupByFrequencyTier(docs);
}

// ============================================
// PUBLIC FUNCTIONS (exported - called from controller)
// ============================================

/**
 * Get complete character details including component analysis and related characters
 * @param {string} character - Single Chinese character
 * @returns {Object|null} Full character data or null if not found
 */
export async function getCharacterDetails(character) {
  const doc = await characterRepo.findOne(character);
  if (!doc) return null;

  const semanticComponent = doc.etymology?.semantic || null;
  const phoneticComponent = doc.etymology?.phonetic || null;

  // Fetch all related data in parallel
  const [
    componentTree,
    usedInCharacters,
    semanticSiblings,
    phoneticSiblings,
    semanticComponentInfo,
    phoneticComponentInfo,
  ] = await Promise.all([
    buildComponentTree(character),
    findCharactersContaining(character),
    findSemanticSiblings(semanticComponent, character),
    findPhoneticSiblings(phoneticComponent, character),
    semanticComponent
      ? characterRepo.findOneWithFields(semanticComponent, {
          pinyin: 1,
          definitions: 1,
          _id: 0,
        })
      : null,
    phoneticComponent
      ? characterRepo.findOneWithFields(phoneticComponent, {
          pinyin: 1,
          definitions: 1,
          _id: 0,
        })
      : null,
  ]);

  return {
    // Base data
    character: doc.character,
    pinyin: doc.pinyin || [],
    definitions: doc.definitions || [],
    decomposition: doc.decomposition || null,
    etymology: doc.etymology || null,
    matches: doc.matches || [],
    frequencyRank: doc.frequencyRank || null,

    // Component breakdown
    componentTree,

    // Characters containing this character
    usedInCharacters,

    // Semantic info and family
    semanticComponent: semanticComponent
      ? {
          char: semanticComponent,
          pinyin: semanticComponentInfo?.pinyin?.[0] || "",
          meaning: semanticComponentInfo?.definitions?.[0] || "",
        }
      : null,
    semanticSiblings,

    // Phonetic info and family
    phoneticComponent: phoneticComponent
      ? {
          char: phoneticComponent,
          pinyin: phoneticComponentInfo?.pinyin?.[0] || "",
          meaning: phoneticComponentInfo?.definitions?.[0] || "",
        }
      : null,
    phoneticSiblings,
  };
}

/**
 * Search characters by character, pinyin, or definition
 * @param {string} query - Search query string
 * @returns {Array} List of matching characters
 */
export async function searchCharacters(query) {
  const trimmed = query.trim();

  // For single character, try exact match first
  if (trimmed.length === 1) {
    const exact = await characterRepo.findOneBasic(trimmed);
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
  const results = await characterRepo.searchByText(trimmed);

  return results.map((r) => ({
    character: r.character,
    pinyin: r.pinyin?.[0] || "",
    meaning: r.definitions?.[0] || "",
    frequencyRank: r.frequencyRank,
  }));
}
