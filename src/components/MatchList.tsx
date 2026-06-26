import type { PokemonEntry } from "../lib/data";
import { useT } from "../i18n";
import Sprite from "./Sprite";
import TypePills from "./TypePills";

interface Props {
  results: PokemonEntry[];
  selectedIndex: number;
  onPick: (id: string) => void;
}

/** Shared result list for the keystroke matcher: sprite + name + types, with
 *  the active row highlighted and a 1-9 number hint for quick selection. */
export default function MatchList({ results, selectedIndex, onPick }: Props) {
  const { name } = useT();
  return (
    <ul className="flex flex-col gap-1">
      {results.map((entry, i) => {
        const active = i === selectedIndex;
        return (
          <li key={entry.id}>
            <button
              type="button"
              onClick={() => onPick(entry.id)}
              className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left transition ${
                active
                  ? "bg-sky-500/20 ring-1 ring-sky-400"
                  : "bg-white/5 hover:bg-white/10"
              }`}
            >
              {i < 9 && (
                <kbd
                  className={`grid h-5 w-5 place-items-center rounded text-xs font-bold ${
                    active ? "bg-sky-400 text-black" : "bg-white/10 text-white/60"
                  }`}
                >
                  {i + 1}
                </kbd>
              )}
              <Sprite
                dex={entry.mon.sprite}
                name={entry.mon.name}
                className="h-9 w-9 shrink-0 object-contain"
              />
              <span className="min-w-0 flex-1 truncate font-semibold">
                {name(entry.mon)}
              </span>
              <TypePills types={entry.mon.types} size="xs" />
            </button>
          </li>
        );
      })}
    </ul>
  );
}
