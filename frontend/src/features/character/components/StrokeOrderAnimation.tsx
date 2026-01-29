import { useEffect, useRef, useCallback } from "react";
import HanziWriter from "hanzi-writer";
import { RotateCcw } from "lucide-react";

interface StrokeOrderAnimationProps {
  character: string;
  size?: number;
  showOutline?: boolean;
  autoAnimate?: boolean;
}

const StrokeOrderAnimation = ({
  character,
  size = 400,
  showOutline = true,
  autoAnimate = true,
}: StrokeOrderAnimationProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const writerRef = useRef<HanziWriter | null>(null);

  useEffect(() => {
    if (!containerRef.current || !character) return;

    // Cancel any ongoing animation before clearing
    if (writerRef.current) {
      writerRef.current.cancelQuiz();
      writerRef.current.hideCharacter();
      writerRef.current = null;
    }

    // Clear previous content
    containerRef.current.innerHTML = "";

    try {
      const writer = HanziWriter.create(containerRef.current, character, {
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
      // Character not found in hanzi-writer database - show fallback
      if (containerRef.current) {
        containerRef.current.innerHTML = `<div style="width:${size}px;height:${size}px;display:flex;align-items:center;justify-content:center;font-size:${size * 0.6}px;color:#000000">${character}</div>`;
      }
    }

    return () => {
      // Cancel any ongoing animation before cleanup
      if (writerRef.current) {
        writerRef.current.cancelQuiz();
        writerRef.current.hideCharacter();
        writerRef.current = null;
      }
    };
  }, [character, size, showOutline, autoAnimate]);

  const handleAnimate = useCallback(() => {
    writerRef.current?.animateCharacter();
  }, []);

  return (
    <div className="relative">
      <div
        ref={containerRef}
        className="rounded-2xl border-2 border-gray-200 bg-white shadow-lg"
        style={{ width: size, height: size }}
      />
      <button
        onClick={handleAnimate}
        className="absolute top-2 right-2 p-1 transition-all cursor-pointer group hover:scale-110"
        title="Replay Animation"
      >
        <RotateCcw className="w-4 h-4 text-gray-400 group-hover:text-primary transition-colors" />
      </button>
    </div>
  );
};

export default StrokeOrderAnimation;
