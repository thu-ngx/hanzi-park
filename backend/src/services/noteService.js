import * as noteRepo from "../repositories/noteRepository.js";

/**
 * Service for managing user's saved notes/characters
 */

export async function getAll(userId) {
    return noteRepo.findByUserId(userId);
}

export async function add(userId, characterData) {
    const {
        character,
        pinyin,
        meaning,
        semanticRadical,
        phoneticComponent,
        frequencyRank,
        strokeCount,
        notes,
    } = characterData;

    // Check if already saved
    const existing = await noteRepo.findByUserAndCharacter(userId, character);
    if (existing) {
        return { error: "already_exists", data: existing };
    }

    const saved = await noteRepo.create({
        userId,
        character,
        pinyin,
        meaning,
        semanticRadical,
        phoneticComponent,
        frequencyRank,
        strokeCount,
        notes: notes || "",
    });

    return { error: null, data: saved };
}

export async function updateNotes(userId, characterId, notes) {
    return noteRepo.updateNotes(characterId, userId, notes);
}

export async function remove(userId, characterId) {
    return noteRepo.deleteByIdAndUser(characterId, userId);
}
