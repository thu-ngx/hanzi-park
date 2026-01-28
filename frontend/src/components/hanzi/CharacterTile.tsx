import { useNavigate } from "react-router";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip";

interface CharacterTileProps {
    char: string;
    pinyin?: string | string[];
    meaning?: string | null;
}

const CharacterTile = ({ char, pinyin, meaning }: CharacterTileProps) => {
    const navigate = useNavigate();

    // Build tooltip text from pinyin and meaning
    const pinyinText = Array.isArray(pinyin) ? pinyin.join(", ") : pinyin;
    const tooltipText = [pinyinText, meaning].filter(Boolean).join(" — ");

    const button = (
        <button
            onClick={() => navigate(`/character/${char}`)}
            className="group relative w-12 h-12 rounded-lg border flex items-center justify-center
        text-2xl font-bold transition-all shadow-sm hover:shadow-md cursor-pointer
        bg-white border-gray-200 text-black hover:bg-primary hover:border-primary hover:text-white"
        >
            {char}
        </button>
    );

    // If no tooltip text, just return the button
    if (!tooltipText) {
        return button;
    }

    return (
        <Tooltip>
            <TooltipTrigger asChild>{button}</TooltipTrigger>
            <TooltipContent className="bg-primary text-primary-foreground">
                {tooltipText}
            </TooltipContent>
        </Tooltip>
    );
};

export default CharacterTile;
