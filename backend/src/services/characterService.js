import * as characterRepo from "../repositories/characterRepository.js";

/**
 * Service for Chinese character lookup, analysis, and search
 */

function bucketByFrequency(characters) {
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

async function getSemanticFamily(semanticComponent, excludeChar) {
    if (!semanticComponent) return { top1000: [], mid: [], rest: [] };

    const docs = await characterRepo.findBySemanticComponent(
        semanticComponent,
        excludeChar
    );
    return bucketByFrequency(docs);
}

async function getPhoneticFamily(phoneticComponent, excludeChar) {
    if (!phoneticComponent) return { top1000: [], mid: [], rest: [] };

    const docs = await characterRepo.findByPhoneticComponent(
        phoneticComponent,
        excludeChar
    );
    return bucketByFrequency(docs);
}

async function buildTree(character) {
    const doc = await characterRepo.findByCharacter(character);
    if (!doc) return null;

    const children = [];
    for (const comp of doc.components) {
        const childDoc = await characterRepo.findByCharacterWithFields(comp, {
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

async function findParents(character) {
    const parents = await characterRepo.findByComponent(character);

    return parents.map((p) => ({
        char: p.character,
        pinyin: p.pinyin || [],
        meaning: p.definitions?.[0] || null,
        frequencyRank: p.frequencyRank || null,
    }));
}

/**
 * Get detailed character analysis with semantic/phonetic families
 * Used by: POST /api/characters/lookup
 */
export async function getAnalysis(character) {
    const doc = await characterRepo.findByCharacter(character);
    if (!doc) return null;

    const semanticComponent = doc.etymology?.semantic || null;
    const phoneticComponent = doc.etymology?.phonetic || null;

    const [semanticFamily, phoneticFamily] = await Promise.all([
        getSemanticFamily(semanticComponent, character),
        getPhoneticFamily(phoneticComponent, character),
    ]);

    let semanticRadical = null;
    if (semanticComponent) {
        const radDoc = await characterRepo.findByCharacterWithFields(semanticComponent, {
            pinyin: 1,
            definitions: 1,
            _id: 0,
        });
        semanticRadical = {
            radical: semanticComponent,
            meaning: radDoc?.definitions?.[0] || "",
            pinyin: radDoc?.pinyin?.[0] || "",
            position: "",
        };
    }

    let phoneticComponentInfo = null;
    if (phoneticComponent) {
        const phonDoc = await characterRepo.findByCharacterWithFields(phoneticComponent, {
            pinyin: 1,
            _id: 0,
        });
        phoneticComponentInfo = {
            component: phoneticComponent,
            sound: phonDoc?.pinyin?.[0] || "",
        };
    }

    return {
        character: doc.character,
        pinyin: doc.pinyin?.[0] || "",
        meaning: doc.definitions?.join("; ") || "",
        strokeCount: doc.matches?.[0]?.length || 0,
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
 * Get character entry with component tree and parent characters
 * Used by: GET /api/dictionary/:char
 */
export async function getEntry(character) {
    const doc = await characterRepo.findByCharacter(character);
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
 * Search characters by character, pinyin, or definition
 * Used by: GET /api/characters/search
 */
export async function search(query) {
    const trimmed = query.trim();

    if (trimmed.length === 1) {
        const exact = await characterRepo.findExactMatch(trimmed);
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

    const results = await characterRepo.searchByPinyinOrDefinition(trimmed);

    return results.map((r) => ({
        character: r.character,
        pinyin: r.pinyin?.[0] || "",
        meaning: r.definitions?.[0] || "",
        frequencyRank: r.frequencyRank,
    }));
}
