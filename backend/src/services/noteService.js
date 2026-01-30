import * as noteRepo from "../repositories/noteRepository.js";

/**
 * Service for managing user's saved notes/characters
 */

export async function getAll(userId) {
    return noteRepo.findByUserId(userId);
}

export async function save(userId, characterData) {
    const {
        character,
        pinyin,
        meaning,
        semanticRadical,
        phoneticComponent,
        frequencyRank,
        noteContent,
    } = characterData;

    return noteRepo.upsert(userId, {
        character,
        pinyin,
        meaning,
        semanticRadical,
        phoneticComponent,
        frequencyRank,
        noteContent: noteContent || "",
    });
}

export async function remove(userId, characterId) {
    return noteRepo.deleteByIdAndUser(characterId, userId);
}
