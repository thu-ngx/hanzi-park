import Note from "../models/Note.js";

/**
 * Repository for accessing user's saved notes/characters
 */

export async function findByUserId(userId) {
    return Note.find({ userId }).sort({ createdAt: -1 });
}

export async function findByUserAndCharacter(userId, character) {
    return Note.findOne({ userId, character });
}

export async function findByIdAndUser(id, userId) {
    return Note.findOne({ _id: id, userId });
}

export async function create(data) {
    return Note.create(data);
}

export async function updateNotes(id, userId, notes) {
    return Note.findOneAndUpdate(
        { _id: id, userId },
        { notes },
        { new: true }
    );
}

export async function deleteByIdAndUser(id, userId) {
    return Note.findOneAndDelete({ _id: id, userId });
}
