import { useEffect, useState } from "react";
import { characterService } from "../services/characterService";

interface ExampleCharData {
  pinyin: string[];
  meaning: string | null;
}

const EXAMPLE_CHARS = ["清", "想", "妈", "红", "房", "船"];

export const useExampleCharacters = () => {
  const [exampleChars, setExampleChars] = useState<
    Record<string, ExampleCharData>
  >({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchExampleChars = async () => {
      const entries: Record<string, ExampleCharData> = {};

      await Promise.all(
        EXAMPLE_CHARS.map(async (char) => {
          try {
            const entry = await characterService.getDictionaryEntry(char);
            entries[char] = {
              pinyin: entry.pinyin,
              meaning: entry.definitions?.[0] || null,
            };
          } catch (error) {
            console.error(`Failed to fetch data for ${char}:`, error);
          }
        }),
      );

      setExampleChars(entries);
      setIsLoading(false);
    };

    fetchExampleChars();
  }, []);

  return { exampleChars, exampleCharsList: EXAMPLE_CHARS, isLoading };
};
