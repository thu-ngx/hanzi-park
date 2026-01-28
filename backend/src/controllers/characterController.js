import Character from "../models/Character.js";
import {
  analyzeCharacter,
  searchCharacters,
} from "../services/dictionaryService.js";

// POST /api/characters/lookup - lookup a single character
export const lookup = async (req, res) => {
  try {
    const { character } = req.body;
    if (!character || character.length !== 1) {
      return res
        .status(400)
        .json({ message: "Please provide exactly one Chinese character" });
    }
    const result = await analyzeCharacter(character);
    if (!result) {
      return res
        .status(404)
        .json({ message: "Character not found in dictionary" });
    }
    return res.status(200).json(result);
  } catch (error) {
    console.error("Error in lookup:", error);
    return res.status(500).json({ message: "System error" });
  }
};

// GET /api/characters/search?q=query - search characters
export const search = async (req, res) => {
  try {
    const query = req.query.q;
    if (!query || query.trim().length === 0) {
      return res.status(400).json({ message: "Please provide a search query" });
    }
    const results = await searchCharacters(query.trim());
    return res.status(200).json(results);
  } catch (error) {
    console.error("Error in search:", error);
    return res.status(500).json({ message: "System error" });
  }
};

// GET /api/characters/saved - get user's saved characters
export const getSaved = async (req, res) => {
  try {
    const userId = req.user._id;
    const characters = await Character.find({ userId }).sort({ createdAt: -1 });
    return res.status(200).json(characters);
  } catch (error) {
    console.error("Error in getSaved:", error);
    return res.status(500).json({ message: "System error" });
  }
};

// POST /api/characters/save - save a character to user's collection
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

    // check if already saved
    const existing = await Character.findOne({ userId, character });
    if (existing) {
      return res.status(409).json({ message: "Character already saved" });
    }

    const saved = await Character.create({
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

    return res.status(201).json(saved);
  } catch (error) {
    console.error("Error in save:", error);
    return res.status(500).json({ message: "System error" });
  }
};

// PUT /api/characters/:id/notes - update notes for a saved character
export const updateNotes = async (req, res) => {
  try {
    const userId = req.user._id;
    const { id } = req.params;
    const { notes } = req.body;

    const character = await Character.findOneAndUpdate(
      { _id: id, userId },
      { notes },
      { new: true },
    );

    if (!character) {
      return res.status(404).json({ message: "Character not found" });
    }

    return res.status(200).json(character);
  } catch (error) {
    console.error("Error in updateNotes:", error);
    return res.status(500).json({ message: "System error" });
  }
};

// DELETE /api/characters/:id - delete a saved character
export const remove = async (req, res) => {
  try {
    const userId = req.user._id;
    const { id } = req.params;

    const character = await Character.findOneAndDelete({ _id: id, userId });

    if (!character) {
      return res.status(404).json({ message: "Character not found" });
    }

    return res.sendStatus(204);
  } catch (error) {
    console.error("Error in remove:", error);
    return res.status(500).json({ message: "System error" });
  }
};
