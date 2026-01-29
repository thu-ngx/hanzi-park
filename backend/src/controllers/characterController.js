import * as characterService from "../services/characterService.js";

// GET /api/characters/:char - get dictionary entry with tree and parents
export const getEntry = async (req, res) => {
  try {
    const { char } = req.params;

    if (!char || [...char].length !== 1) {
      return res
        .status(400)
        .json({ message: "Please provide exactly one character" });
    }

    const result = await characterService.getEntry(char);

    if (!result) {
      return res
        .status(404)
        .json({ message: "Character not found in dictionary" });
    }

    return res.status(200).json(result);
  } catch (error) {
    console.error("Error in getEntry:", error);
    return res.status(500).json({ message: "System error" });
  }
};

// POST /api/characters/lookup - get detailed character analysis
export const lookup = async (req, res) => {
  try {
    const { character } = req.body;
    if (!character || character.length !== 1) {
      return res
        .status(400)
        .json({ message: "Please provide exactly one Chinese character" });
    }

    const result = await characterService.getAnalysis(character);
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

    const results = await characterService.search(query.trim());
    return res.status(200).json(results);
  } catch (error) {
    console.error("Error in search:", error);
    return res.status(500).json({ message: "System error" });
  }
};
