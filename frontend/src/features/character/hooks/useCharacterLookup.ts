import { useState, useEffect, useMemo } from "react";
import { toast } from "@/lib/toast";
import { characterService } from "../services/characterService";
import type { CharacterAnalysis } from "../types/character";

interface LoadedData {
  character: string;
  result: CharacterAnalysis;
}

interface CharacterLookupResult {
  data: CharacterAnalysis | null;
  isLoading: boolean;
}

export function useCharacterLookup(
  character: string | undefined,
): CharacterLookupResult {
  const [loadedData, setLoadedData] = useState<LoadedData | null>(null);
  const [loadingFor, setLoadingFor] = useState<string | null>(null);

  useEffect(() => {
    if (!character) return;

    let cancelled = false;

    // Start loading asynchronously to avoid lint warning
    Promise.resolve().then(() => {
      if (!cancelled) {
        setLoadingFor(character);
      }
    });

    characterService
      .lookup(character)
      .then((result) => {
        if (!cancelled) {
          setLoadedData({ character, result });
          setLoadingFor(null);
        }
      })
      .catch(() => {
        if (!cancelled) {
          toast.error("Failed to load character");
          setLoadedData(null);
          setLoadingFor(null);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [character]);

  // Return null if no character or data is for a different character
  const data = useMemo(() => {
    if (!character || !loadedData || loadedData.character !== character) {
      return null;
    }
    return loadedData.result;
  }, [character, loadedData]);

  // Loading if we're fetching for the current character
  const isLoading = loadingFor === character;

  return { data, isLoading };
}
