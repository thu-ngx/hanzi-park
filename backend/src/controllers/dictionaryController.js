import { lookupCharacter } from "../services/dictionaryService.js";

export const getDictionaryEntry = async (req, res) => {
  try {
    const { char } = req.params;

    if (!char || [...char].length !== 1) {
      return res.status(400).json({ message: "Please provide exactly one character" });
    }

    const result = await lookupCharacter(char);

    if (!result) {
      return res.status(404).json({ message: "Character not found in dictionary" });
    }

    return res.status(200).json(result);
  } catch (error) {
    console.error("Error in getDictionaryEntry:", error);
    return res.status(500).json({ message: "System error" });
  }
};
