import { useMemo, useState } from "react";
import { LEAGUES, type League, type TeamMember } from "../types";
import { defaultLoadout, getMove, getPokemon, leaguePool } from "../lib/data";
import { textOn, typeColor } from "../lib/typeColors";
import PokemonSearch from "./PokemonSearch";
import Sprite from "./Sprite";
import TypePills from "./TypePills";

interface Props {
  league: League;
  initialTeam: TeamMember[];
  onConfirm: (team: TeamMember[]) => void;
  onBack: () => void;
}

function MoveChip({
  moveId,
  selected,
  onClick,
}: {
  moveId: string;
  selected: boolean;
  onClick: () => void;
}) {
  const m = getMove(moveId);
  if (!m) return null;
  const bg = typeColor(m.type);
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-md px-2 py-1 text-xs font-semibold transition ${
        selected ? "" : "bg-white/5 text-white/50 hover:bg-white/10"
      }`}
      style={selected ? { background: bg, color: textOn(bg) } : undefined}
    >
      {m.nameHu || m.name}
    </button>
  );
}

/** Phase 2 — choose 3 pokemon for this league and their moves. Persisted per
 *  league by the caller. Uses the same keystroke picker as the battle screen. */
export default function TeamSetup({
  league,
  initialTeam,
  onConfirm,
  onBack,
}: Props) {
  const pool = useMemo(() => leaguePool(league), [league]);
  const [team, setTeam] = useState<TeamMember[]>(initialTeam.slice(0, 3));
  const leagueName = LEAGUES.find((l) => l.id === league)?.name ?? league;

  const add = (id: string) =>
    setTeam((t) => {
      if (t.length >= 3 || t.some((m) => m.id === id)) return t;
      const loadout = defaultLoadout(id);
      return loadout ? [...t, loadout] : t;
    });
  const remove = (i: number) =>
    setTeam((t) => t.filter((_, j) => j !== i));
  const setFast = (i: number, mv: string) =>
    setTeam((t) => t.map((m, j) => (j === i ? { ...m, fastMove: mv } : m)));
  const toggleCharged = (i: number, mv: string) =>
    setTeam((t) =>
      t.map((m, j) => {
        if (j !== i) return m;
        const has = m.chargedMoves.includes(mv);
        let next = has
          ? m.chargedMoves.filter((x) => x !== mv)
          : [...m.chargedMoves, mv];
        if (next.length === 0) return m; // keep at least one
        if (next.length > 2) next = next.slice(1); // max two; drop the oldest
        return { ...m, chargedMoves: next };
      })
    );

  const excluded = team.map((m) => m.id);
  const full = team.length === 3;

  return (
    <div className="mx-auto flex min-h-dvh max-w-2xl flex-col gap-4 p-4">
      <header className="flex items-center gap-3">
        <button
          type="button"
          onClick={onBack}
          className="rounded-lg bg-white/5 px-3 py-1.5 text-sm hover:bg-white/10"
        >
          ← Liga
        </button>
        <div>
          <h1 className="text-xl font-bold">Csapat</h1>
          <p className="text-sm text-white/50">{leagueName} · {team.length}/3</p>
        </div>
      </header>

      <div className="flex flex-col gap-3">
        {team.map((member, i) => {
          const mon = getPokemon(member.id);
          if (!mon) return null;
          return (
            <div
              key={`${member.id}-${i}`}
              className="rounded-2xl border border-white/10 bg-[#1a1a1a] p-3"
            >
              <div className="flex items-center gap-3">
                <Sprite
                  dex={mon.sprite}
                  name={mon.name}
                  className="h-12 w-12 object-contain"
                />
                <div className="min-w-0 flex-1">
                  <div className="truncate font-bold">{mon.name}</div>
                  <TypePills types={mon.types} size="xs" />
                </div>
                <button
                  type="button"
                  onClick={() => remove(i)}
                  className="rounded-lg bg-white/5 px-2 py-1 text-xs text-white/60 hover:bg-red-500/20 hover:text-red-300"
                >
                  Törlés
                </button>
              </div>

              <div className="mt-3 space-y-2">
                <div>
                  <div className="mb-1 text-[11px] uppercase tracking-wide text-white/40">
                    Gyors mozdulat
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {mon.fastMoves.map((mv) => (
                      <MoveChip
                        key={mv}
                        moveId={mv}
                        selected={member.fastMove === mv}
                        onClick={() => setFast(i, mv)}
                      />
                    ))}
                  </div>
                </div>
                <div>
                  <div className="mb-1 text-[11px] uppercase tracking-wide text-white/40">
                    Töltött mozdulatok (max 2)
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {mon.chargedMoves.map((mv) => (
                      <MoveChip
                        key={mv}
                        moveId={mv}
                        selected={member.chargedMoves.includes(mv)}
                        onClick={() => toggleCharged(i, mv)}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {!full && (
        <div className="rounded-2xl border border-dashed border-white/15 bg-black/20 p-3">
          <div className="mb-2 text-sm text-white/60">
            Adj hozzá pokémont ({team.length}/3)
          </div>
          <PokemonSearch
            pool={pool}
            onPick={add}
            active={!full}
            exclude={excluded}
            hint="gépelj egy nevet…"
          />
        </div>
      )}

      <div className="sticky bottom-0 -mx-4 mt-auto border-t border-white/10 bg-[#0e0e10]/90 p-4 backdrop-blur">
        <button
          type="button"
          disabled={!full}
          onClick={() => onConfirm(team)}
          className="w-full rounded-xl bg-sky-500 py-3 font-bold text-black transition enabled:hover:bg-sky-400 disabled:opacity-30"
        >
          {full ? "Csatába →" : `Még ${3 - team.length} pokémon kell`}
        </button>
      </div>
    </div>
  );
}
