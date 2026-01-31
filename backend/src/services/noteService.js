import * as noteRepo from "../repositories/noteRepository.js";

/**
 * Service for managing user's saved notes/characters
 */

export async function getAll(userId) {
    return noteRepo.findByUserId(userId);
}

export async function getOne(userId, character) {
    return noteRepo.findByUserAndCharacter(userId, character);
}

export async function saveNote(userId, noteData) {
    const {
        character,
        pinyin,
        meaning,
        semanticComponent,
        phoneticComponent,
        frequencyRank,
        noteContent,
    } = noteData;

    return noteRepo.upsert(userId, {
        character,
        pinyin,
        meaning,
        semanticComponent,
        phoneticComponent,
        frequencyRank,
        noteContent: noteContent || "",
    });
}

export async function deleteNote(userId, noteId) {
    return noteRepo.deleteByIdAndUser(noteId, userId);
}
