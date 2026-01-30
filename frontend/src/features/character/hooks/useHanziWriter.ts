import { useEffect, useRef, useState, useCallback, type RefObject } from "react";
import HanziWriter from "hanzi-writer";

interface UseHanziWriterOptions {
    character: string;
    size: number;
    showOutline: boolean;
    autoAnimate: boolean;
}

interface UseHanziWriterResult {
    hasError: boolean;
    animate: () => void;
}

export function useHanziWriter(
    containerRef: RefObject<HTMLDivElement | null>,
    options: UseHanziWriterOptions,
): UseHanziWriterResult {
    const { character, size, showOutline, autoAnimate } = options;
    const writerRef = useRef<HanziWriter | null>(null);
    const [hasError, setHasError] = useState(false);

    useEffect(() => {
        const container = containerRef.current;
        if (!container || !character) return;

        // Reset error state for new character
        setHasError(false);

        // Cancel any ongoing animation before clearing
        if (writerRef.current) {
            writerRef.current.cancelQuiz();
            writerRef.current.hideCharacter();
            writerRef.current = null;
        }

        // Clear previous content
        while (container.firstChild) {
            container.removeChild(container.firstChild);
        }

        try {
            const writer = HanziWriter.create(container, character, {
                width: size,
                height: size,
                padding: 20,
                showOutline,
                strokeAnimationSpeed: 1,
                delayBetweenStrokes: 200,
                strokeColor: "#000000",
                radicalColor: "#06402B",
                outlineColor: "#DDD",
                drawingColor: "#000000",
            });

            writerRef.current = writer;

            if (autoAnimate) {
                writer.animateCharacter();
            }
        } catch {
            // Character not found in hanzi-writer database
            setHasError(true);
        }

        return () => {
            // Cancel any ongoing animation before cleanup
            if (writerRef.current) {
                writerRef.current.cancelQuiz();
                writerRef.current.hideCharacter();
                writerRef.current = null;
            }
        };
    }, [containerRef, character, size, showOutline, autoAnimate]);

    const animate = useCallback(() => {
        writerRef.current?.animateCharacter();
    }, []);

    return { hasError, animate };
}
