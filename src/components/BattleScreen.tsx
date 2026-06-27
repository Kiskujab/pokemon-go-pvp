import { useEffect, useMemo, useState } from "react";
import { type League, type TeamMember } from "../types";
import { buildSides, getPokemon, leaguePool, searchPokemon } from "../lib/data";
import { recommendBestIndex } from "../lib/recommend";
import { useKeystrokeSearch } from "../hooks/useKeystrokeSearch";
import { useT } from "../i18n";
import LanguagePicker from "./LanguagePicker";
import OpponentBoard from "./OpponentBoard";
import ShieldAdvice from "./ShieldAdvice";
import MyTeamBar from "./MyTeamBar";
import MatchList from "./MatchList";
import PokemonGrid from "./PokemonGrid";

interface Props {
  league: League;
  team: TeamMember[];
  onEditTeam: () => void;
  onChangeLeague: () => void;
}

const clamp = (n: number, lo: number, hi: number) =>
  Math.max(lo, Math.min(hi, n));

/** Phase 3 — the battle loop. Type the opponent's name (keystroke matcher),
 *  read the board + move counts, see which of my 3 is recommended, and get
 *  per-move shield advice for my active mon. */
export default function BattleScreen({
  league,
  team,
  onEditTeam,
  onChangeLeague,
}: Props) {
  const { t } = useT();
  const pool = useMemo(() => leaguePool(league), [league]);
  const [opponentId, setOpponentId] = useState<string | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [selected, setSelected] = useState(0);
  const [browsing, setBrowsing] = useState(false);

  const setOpp = (id: string) => {
    setOpponentId(id);
    clear();
    setBrowsing(false);
  };

  const { buffer, clear } = useKeystrokeSearch({
    active: true,
    onMove: (d) => setSelected((i) => clamp(i + d, 0, results.length - 1)),
    onSelectIndex: (i) => results[i] && setOpp(results[i].id),
    onConfirm: () => results[selected] && setOpp(results[selected].id),
    onEscape: () => setOpponentId(null),
  });

  const results = useMemo(() => searchPokemon(pool, buffer, 8), [pool, buffer]);
  useEffect(() => setSelected(0), [buffer]);

  const opp = opponentId ? getPokemon(opponentId) : null;
  const activeMon = team[activeIndex]
    ? getPokemon(team[activeIndex].id)
    : null;

  const recommendedIndex = useMemo(() => {
    if (!opp) return -1;
    return recommendBestIndex(team.map((m) => buildSides(m, opp)));
  }, [opp, team]);

  const leagueName = t(`league.${league}` as "league.great");

  return (
    <div className="mx-auto flex min-h-dvh max-w-2xl flex-col gap-3 p-3">
      {/* top bar */}
      <header className="flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={onChangeLeague}
          className="rounded-lg bg-white/5 px-3 py-1.5 text-sm font-semibold hover:bg-white/10"
        >
          {t("battle.changeLeague", { league: leagueName })}
        </button>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onEditTeam}
            className="rounded-lg bg-white/5 px-3 py-1.5 text-sm hover:bg-white/10"
          >
            {t("team.edit")}
          </button>
          <LanguagePicker variant="compact" />
        </div>
      </header>

      {/* keystroke search bar */}
      <div className="rounded-2xl border border-white/10 bg-[#1a1a1a] p-3">
        <div className="flex items-center gap-3">
          <span className="font-mono text-2xl tracking-wider text-sky-300">
            {buffer || (
              <span className="text-white/30">{t("battle.oppName")}</span>
            )}
            <span className="ml-0.5 animate-pulse text-sky-400">|</span>
          </span>
          <div className="ml-auto flex items-center gap-2">
            {buffer && (
              <span className="text-xs text-white/40">
                {t("search.count", { n: results.length })}
              </span>
            )}
            <button
              type="button"
              onClick={() => setBrowsing((b) => !b)}
              className="rounded-lg bg-white/5 px-2 py-1 text-xs hover:bg-white/10"
            >
              {t("battle.browse")}
            </button>
          </div>
        </div>

        {buffer ? (
          results.length ? (
            <div className="mt-3">
              <MatchList
                results={results}
                selectedIndex={selected}
                onPick={setOpp}
              />
            </div>
          ) : (
            <p className="mt-3 text-sm text-white/40">
              {t("search.noResults", { q: buffer })}
            </p>
          )
        ) : (
          browsing && (
            <div className="mt-3 max-h-72 overflow-y-auto pr-1">
              <PokemonGrid entries={pool} onPick={setOpp} />
            </div>
          )
        )}
      </div>

      {/* board / empty state */}
      <div className="flex-1">
        {opp ? (
          <div className="flex flex-col gap-3">
            {activeMon && (
              <ShieldAdvice activeMyMon={activeMon} opp={opp} league={league} />
            )}
            <OpponentBoard opp={opp} activeMyMon={activeMon} league={league} />
          </div>
        ) : (
          <div className="flex h-full min-h-40 flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 p-6 text-center text-white/40">
            <p className="text-lg">{t("battle.empty.title")}</p>
            <p className="mt-1 text-sm">
              {t("battle.empty.hint", { ex: "gro", mon: "Groudon" })}
            </p>
          </div>
        )}
      </div>

      {/* my team */}
      <div className="sticky bottom-0 -mx-3 border-t border-white/10 bg-[#0e0e10]/90 px-3 py-3 backdrop-blur">
        <MyTeamBar
          team={team}
          activeIndex={activeIndex}
          recommendedIndex={recommendedIndex}
          onSelect={setActiveIndex}
        />
      </div>
    </div>
  );
}
