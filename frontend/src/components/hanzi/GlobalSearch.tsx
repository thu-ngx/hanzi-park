import { useState, useCallback } from "react";
import { useNavigate } from "react-router";
import { X, Search } from "lucide-react";

interface GlobalSearchProps {
  compact?: boolean;
}

const GlobalSearch = ({ compact = false }: GlobalSearchProps) => {
  const [input, setInput] = useState("");
  const navigate = useNavigate();

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const char = input.trim();
      if (char.length === 1) {
        navigate(`/character/${char}`);
        setInput("");
      }
    },
    [input, navigate],
  );

  return (
    <form onSubmit={handleSubmit} className="relative flex items-center w-full">
      <div className="relative w-full">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={compact ? "" : "Enter a Chinese character..."}
          maxLength={1}
          className="w-full h-10 pl-9 pr-8 text-sm rounded-lg border border-gray-300 bg-white
            focus:outline-none focus:border-primary
            placeholder:text-muted-foreground text-center font-medium"
        />
        {input && (
          <button
            type="button"
            onClick={() => setInput("")}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-gray-100 text-muted-foreground cursor-pointer"
          >
            <X className="w-3 h-3" />
          </button>
        )}
      </div>
    </form>
  );
};

export default GlobalSearch;
