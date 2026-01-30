import { useNavigate } from "react-router";
import { BookOpen, Music2 } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface CharacterTileProps {
  char: string;
  pinyin?: string | string[];
  meaning?: string | null;
  role?: "semantic" | "phonetic" | "component";
  variant?: "default" | "inline";
}

const CharacterTile = ({
  char,
  pinyin,
  meaning,
  role,
  variant = "default",
}: CharacterTileProps) => {
  const navigate = useNavigate();

  // Build tooltip text from pinyin and meaning
  const pinyinText = Array.isArray(pinyin) ? pinyin.join(", ") : pinyin;
  const tooltipText = [pinyinText, meaning].filter(Boolean).join(" — ");

  const tile = (
    <div className="flex flex-col items-center gap-1">
      <button
        onClick={() => navigate(`/character/${char}`)}
        className={`group relative w-12 h-12 rounded-lg border flex items-center justify-center
                    text-2xl font-chinese shadow-sm hover:shadow-md cursor-pointer
                    hover:bg-primary hover:border-primary hover:text-white
                    ${
                      variant === "inline"
                        ? "bg-muted border-gray-200 text-black" // tile in character details
                        : "bg-white border-gray-200 text-black" // tile in character grid
                    }`}
      >
        {char}
      </button>
      {role === "phonetic" && <Music2 className="w-4 h-4 text-gray-600" />}
      {role === "semantic" && <BookOpen className="w-4 h-4 text-gray-600" />}
    </div>
  );

  // If no tooltip text, just return the tile
  if (!tooltipText) {
    return tile;
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>{tile}</TooltipTrigger>
      <TooltipContent className="bg-primary text-primary-foreground">
        {tooltipText}
      </TooltipContent>
    </Tooltip>
  );
};

export default CharacterTile;
