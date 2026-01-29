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

// POST /api/notes - save a character to user's collection
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
      strokeCount,
      notes,
    } = req.body;

    if (!character) {
      return res.status(400).json({ message: "Character is required" });
    }

    const result = await noteService.add(userId, {
      character,
      pinyin,
      meaning,
      semanticRadical,
      phoneticComponent,
      frequencyRank,
      strokeCount,
      notes,
    });

    if (result.error === "already_exists") {
      return res.status(409).json({ message: "Character already saved" });
    }

    return res.status(201).json(result.data);
  } catch (error) {
    console.error("Error in save:", error);
    return res.status(500).json({ message: "System error" });
  }
};

// PUT /api/notes/:id/notes - update notes for a saved character
export const updateNotes = async (req, res) => {
  try {
    const userId = req.user._id;
    const { id } = req.params;
    const { notes } = req.body;

    const note = await noteService.updateNotes(userId, id, notes);

    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    return res.status(200).json(note);
  } catch (error) {
    console.error("Error in updateNotes:", error);
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
