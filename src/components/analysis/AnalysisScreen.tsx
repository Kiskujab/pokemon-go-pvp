import { useEffect, useMemo, useState } from "react";
import { LEAGUES, type League } from "../../types";
import { leaguePool } from "../../lib/data";
import { getBuilder, getLeague, setBuilder } from "../../lib/storage";
import { useT } from "../../i18n";
import LanguagePicker from "../LanguagePicker";
import PokemonSearch from "../PokemonSearch";
import MonAnalysis from "./MonAnalysis";
import TeamBuilder from "./TeamBuilder";

interface Props {
  onExit: () => void;
}

type Tab = "explorer" | "builder";

/** Meta explorer + team builder. League-scoped, fully data-driven from the pool. */
export default function AnalysisScreen({ onExit }: Props) {
  const { t } = useT();
  const [league, setLeague] = useState<League>(() => getLeague() ?? "great");
  const [tab, setTab] = useState<Tab>("explorer");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [teamIds, setTeamIds] = useState<string[]>(() => getBuilder(league));

  const pool = useMemo(() => leaguePool(league), [league]);

  // Reload the builder roster and clear the selection when the league changes.
  useEffect(() => {
    setTeamIds(getBuilder(league));
    setSelectedId(null);
  }, [league]);

  const updateTeam = (ids: string[]) => {
    setTeamIds(ids);
    setBuilder(league, ids);
  };
  const addToTeam = (id: string) => {
    if (teamIds.length >= 3 || teamIds.includes(id)) return;
    updateTeam([...teamIds, id]);
  };

  const cap = LEAGUES.find((l) => l.id === league);

  return (
    <div className="mx-auto flex min-h-dvh max-w-2xl flex-col gap-4 p-3">
      {/* top bar */}
      <header className="flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={onExit}
          className="rounded-lg bg-white/5 px-3 py-1.5 text-sm hover:bg-white/10"
        >
          ← {t("common.menu")}
        </button>
        <h1 className="truncate text-lg font-bold">{t("analysis.title")}</h1>
        <LanguagePicker variant="compact" />
      </header>

      {/* league selector */}
      <div className="flex gap-2">
        {LEAGUES.map((l) => (
          <button
            key={l.id}
            type="button"
            onClick={() => setLeague(l.id)}
            className={`flex-1 rounded-xl border px-2 py-2 text-sm font-semibold transition ${
              league === l.id
                ? "border-sky-400 bg-sky-500/20"
                : "border-white/10 bg-white/5 hover:bg-white/10"
            }`}
          >
            {t(`league.${l.id}` as "league.great")}
          </button>
        ))}
      </div>

      {/* tabs */}
      <div className="grid grid-cols-2 gap-1 rounded-xl bg-white/5 p-1">
        {(["explorer", "builder"] as Tab[]).map((tb) => (
          <button
            key={tb}
            type="button"
            onClick={() => setTab(tb)}
            className={`rounded-lg py-2 text-sm font-semibold transition ${
              tab === tb ? "bg-sky-500 text-black" : "text-white/60 hover:text-white"
            }`}
          >
            {t(tb === "explorer" ? "analysis.tab.explorer" : "analysis.tab.builder")}
            {tb === "builder" && teamIds.length > 0 && (
              <span className="ml-1 opacity-70">({teamIds.length}/3)</span>
            )}
          </button>
        ))}
      </div>

      {tab === "explorer" ? (
        <div className="flex flex-col gap-4">
          <div className="rounded-2xl border border-white/10 bg-[#1a1a1a] p-3">
            <PokemonSearch
              key={league}
              pool={pool}
              onPick={setSelectedId}
              active
              hint={t("analysis.search.hint")}
            />
          </div>
          <MonAnalysis
            selectedId={selectedId}
            pool={pool}
            league={league}
            cpLabel={cap ? t(`league.cp.${league}` as "league.cp.great") : ""}
            inTeam={selectedId ? teamIds.includes(selectedId) : false}
            teamFull={teamIds.length >= 3}
            onAdd={addToTeam}
          />
        </div>
      ) : (
        <TeamBuilder teamIds={teamIds} pool={pool} onChange={updateTeam} />
      )}
    </div>
  );
}
