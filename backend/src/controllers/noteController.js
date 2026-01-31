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
    const {
      character,
      pinyin,
      meaning,
      semanticRadical,
      phoneticComponent,
      frequencyRank,
      noteContent,
    } = req.body;

    if (!character) {
      return res.status(400).json({ message: "Character is required" });
    }

    const saved = await noteService.save(userId, {
      character,
      pinyin,
      meaning,
      semanticRadical,
      phoneticComponent,
      frequencyRank,
      noteContent,
    });

    return res.status(200).json(saved);
  } catch (error) {
    console.error("Error in save:", error);
    return res.status(500).json({ message: "System error" });
  }
};

// DELETE /api/notes/:id - delete a saved note
export const remove = async (req, res) => {
  try {
    const userId = req.user._id;
    const { id } = req.params;

    const note = await noteService.remove(userId, id);

    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    return res.sendStatus(204);
  } catch (error) {
    console.error("Error in remove:", error);
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
