import Character from "../models/Character.js";

/**
 * Repository for accessing master Chinese character data
 */

export async function findOne(character) {
    return Character.findOne({ character }).lean();
}

export async function findOneWithFields(character, fields) {
    return Character.findOne({ character }, fields).lean();
}

export async function findBySemanticComponent(semanticComponent, excludeChar, limit = 100) {
    return Character.find(
        {
            "etymology.semantic": semanticComponent,
            character: { $ne: excludeChar },
        },
        { character: 1, frequencyRank: 1, pinyin: 1, definitions: 1, _id: 0 }
    )
        .limit(limit)
        .lean();
}

export async function findByPhoneticComponent(phoneticComponent, excludeChar, limit = 100) {
    return Character.find(
        {
            "etymology.phonetic": phoneticComponent,
            character: { $ne: excludeChar },
        },
        { character: 1, frequencyRank: 1, pinyin: 1, definitions: 1, _id: 0 }
    )
        .limit(limit)
        .lean();
}

export async function findContainingComponent(component, limit = 50) {
    return Character.find(
        { components: component },
        { character: 1, pinyin: 1, definitions: 1, frequencyRank: 1, _id: 0 }
    )
        .limit(limit)
        .lean();
}

export async function searchByText(query, limit = 50) {
    return Character.find(
        {
            $or: [
                { pinyin: { $regex: query, $options: "i" } },
                { definitions: { $regex: query, $options: "i" } },
            ],
        },
        { character: 1, pinyin: 1, definitions: 1, frequencyRank: 1, _id: 0 }
    )
        .sort({ frequencyRank: 1 })
        .limit(limit)
        .lean();
}

export async function findOneBasic(character) {
    return Character.findOne(
        { character },
        { character: 1, pinyin: 1, definitions: 1, frequencyRank: 1, _id: 0 }
    ).lean();
}
