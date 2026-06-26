import { useEffect, useMemo, useState } from "react";
import { searchPokemon, type PokemonEntry } from "../lib/data";
import { useKeystrokeSearch } from "../hooks/useKeystrokeSearch";
import MatchList from "./MatchList";
import PokemonGrid from "./PokemonGrid";

interface Props {
  pool: PokemonEntry[];
  onPick: (id: string) => void;
  active: boolean;
  exclude?: string[];
  hint?: string;
}

const clamp = (n: number, lo: number, hi: number) =>
  Math.max(lo, Math.min(hi, n));

/** Reusable keystroke picker: type a name prefix, pick with Enter/number/click.
 *  Falls back to a tappable grid (mobile) while nothing is typed. */
export default function PokemonSearch({
  pool,
  onPick,
  active,
  exclude = [],
  hint,
}: Props) {
  const [selected, setSelected] = useState(0);

  const filtered = useMemo(
    () => pool.filter((e) => !exclude.includes(e.id)),
    [pool, exclude]
  );

  const pick = (id: string) => {
    onPick(id);
    clear();
  };

  const { buffer, clear } = useKeystrokeSearch({
    active,
    onMove: (d) => setSelected((i) => clamp(i + d, 0, results.length - 1)),
    onSelectIndex: (i) => results[i] && pick(results[i].id),
    onConfirm: () => results[selected] && pick(results[selected].id),
  });

  const results = useMemo(
    () => searchPokemon(filtered, buffer, 8),
    [filtered, buffer]
  );

  useEffect(() => setSelected(0), [buffer]);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-baseline gap-3">
        <span className="font-mono text-2xl tracking-wider text-sky-300">
          {buffer || <span className="text-white/30">{hint ?? "gépelj egy nevet…"}</span>}
          {active && <span className="ml-0.5 animate-pulse text-sky-400">|</span>}
        </span>
        {buffer && (
          <span className="text-xs text-white/40">
            {results.length} találat · Enter / 1-9
          </span>
        )}
      </div>

      {buffer ? (
        results.length ? (
          <MatchList results={results} selectedIndex={selected} onPick={pick} />
        ) : (
          <p className="text-sm text-white/40">Nincs találat „{buffer}”.</p>
        )
      ) : (
        // touch fallback grid (mobile / no keyboard)
        <div className="max-h-72 overflow-y-auto pr-1">
          <PokemonGrid entries={filtered} onPick={pick} />
        </div>
      )}
    </div>
  );
}
