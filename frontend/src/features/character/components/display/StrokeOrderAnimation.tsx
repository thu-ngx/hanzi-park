import { useRef } from "react";
import { RotateCcw } from "lucide-react";
import { useHanziWriter } from "../../hooks/useHanziWriter";

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
  const { hasError, animate } = useHanziWriter(containerRef, {
    character,
    size,
    showOutline,
    autoAnimate,
  });

  return (
    <div className="relative">
      {hasError ? (
        // Fallback for characters not in hanzi-writer database
        <div
          className="rounded-2xl border-2 border-gray-200 bg-white shadow-lg flex items-center justify-center"
          style={{ width: size, height: size, fontSize: size * 0.6 }}
        >
          <span className="text-black">{character}</span>
        </div>
      ) : (
        <div
          ref={containerRef}
          className="rounded-2xl border-2 border-gray-200 bg-white shadow-lg"
          style={{ width: size, height: size }}
        />
      )}
      <button
        onClick={animate}
        className="absolute top-2 right-2 p-1 transition-all cursor-pointer group hover:scale-110"
        title="Replay Animation"
      >
        <RotateCcw className="w-4 h-4 text-gray-400 group-hover:text-primary transition-colors" />
      </button>
    </div>
  );
};

export default StrokeOrderAnimation;
