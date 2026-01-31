import * as characterService from "../services/characterService.js";

/**
 * GET /api/characters/:char - Get complete character details
 */
export const getCharacter = async (req, res) => {
  try {
    const { char } = req.params;

    if (!char || [...char].length !== 1) {
      return res
        .status(400)
        .json({ message: "Please provide exactly one character" });
    }

    const result = await characterService.getCharacterDetails(char);

    if (!result) {
      return res
        .status(404)
        .json({ message: "Character not found in dictionary" });
    }

    return res.status(200).json(result);
  } catch (error) {
    console.error("Error in getCharacter:", error);
    return res.status(500).json({ message: "System error" });
  }
};

/**
 * GET /api/characters/search?q=query - Search characters
 */
export const searchCharacters = async (req, res) => {
  try {
    const query = req.query.q;
    if (!query || query.trim().length === 0) {
      return res.status(400).json({ message: "Please provide a search query" });
    }

    const results = await characterService.searchCharacters(query.trim());
    return res.status(200).json(results);
  } catch (error) {
    console.error("Error in searchCharacters:", error);
    return res.status(500).json({ message: "System error" });
  }
};
