import type { PokemonEntry } from "../lib/data";
import Sprite from "./Sprite";

interface Props {
  entries: PokemonEntry[];
  onPick: (id: string) => void;
  className?: string;
}

/** Tappable sprite grid — the touch fallback for the keystroke search. */
export default function PokemonGrid({ entries, onPick, className }: Props) {
  return (
    <div
      className={`grid grid-cols-3 gap-2 sm:grid-cols-4 ${className ?? ""}`}
    >
      {entries.map((entry) => (
        <button
          key={entry.id}
          type="button"
          onClick={() => onPick(entry.id)}
          className="flex flex-col items-center gap-1 rounded-lg bg-white/5 p-2 text-center hover:bg-white/10"
        >
          <Sprite
            dex={entry.mon.sprite}
            name={entry.mon.name}
            className="h-12 w-12 object-contain"
          />
          <span className="line-clamp-1 text-[11px] text-white/70">
            {entry.mon.name}
          </span>
        </button>
      ))}
    </div>
  );
}
