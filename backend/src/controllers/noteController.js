import * as noteService from "../services/noteService.js";

// GET /api/notes - get user's saved notes
export const getSaved = async (req, res) => {
  try {
    const userId = req.user._id;
    const notes = await noteService.getAll(userId);
    return res.status(200).json(notes);
  } catch (error) {
    console.error("Error in getSaved:", error);
    return res.status(500).json({ message: "System error" });
  }
};

// POST /api/notes - save or update a character note (upsert)
export const save = async (req, res) => {
  try {
    const userId = req.user._id;
    const noteData = req.body;

    if (!noteData.character) {
      return res.status(400).json({ message: "Character is required" });
    }

    const savedNote = await noteService.saveNote(userId, noteData);

    return res.status(200).json(savedNote);
  } catch (error) {
    console.error("Error in save:", error);
    return res.status(500).json({ message: "System error" });
  }
};

// DELETE /api/notes/:noteId - delete a saved note
export const deleteNote = async (req, res) => {
  try {
    const userId = req.user._id;
    const { noteId } = req.params;

    const deletedNote = await noteService.deleteNote(userId, noteId);

    if (!deletedNote) {
      return res.status(404).json({ message: "Note not found" });
    }

    return res.sendStatus(204);
  } catch (error) {
    console.error("Error in deleteNote:", error);
    return res.status(500).json({ message: "System error" });
  }
};

// GET /api/notes/character/:character - get a single note by character
export const getNoteByCharacter = async (req, res) => {
  try {
    const userId = req.user._id;
    const { character } = req.params;

    const note = await noteService.getOne(userId, character);

    return res.status(200).json(note);
  } catch (error) {
    console.error("Error in getNoteByCharacter:", error);
    return res.status(500).json({ message: "System error" });
  }
};
