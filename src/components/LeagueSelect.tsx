import { LEAGUES, type League } from "../types";

interface Props {
  current: League | null;
  onSelect: (league: League) => void;
}

const ACCENT: Record<League, string> = {
  great: "from-sky-500/30 to-sky-700/10 hover:border-sky-400",
  ultra: "from-amber-400/30 to-amber-600/10 hover:border-amber-300",
  master: "from-purple-500/30 to-purple-700/10 hover:border-purple-400",
};

/** Phase 1 — pick a league/format. Driven by the LEAGUES data so adding a new
 *  format (premier, cups…) is a data change, not a new button. */
export default function LeagueSelect({ current, onSelect }: Props) {
  return (
    <div className="mx-auto flex min-h-dvh max-w-2xl flex-col justify-center gap-6 p-6">
      <header className="text-center">
        <h1 className="text-3xl font-extrabold">PoGo PvP Helper</h1>
        <p className="mt-1 text-white/50">Válassz ligát a kezdéshez</p>
      </header>
      <div className="grid gap-3 sm:grid-cols-3">
        {LEAGUES.map((l) => (
          <button
            key={l.id}
            type="button"
            onClick={() => onSelect(l.id)}
            className={`flex flex-col items-center gap-1 rounded-2xl border bg-gradient-to-b p-6 text-center transition ${
              ACCENT[l.id]
            } ${
              current === l.id ? "border-white/60" : "border-white/10"
            }`}
          >
            <span className="text-lg font-bold">{l.name}</span>
            <span className="text-sm text-white/50">{l.cp}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
