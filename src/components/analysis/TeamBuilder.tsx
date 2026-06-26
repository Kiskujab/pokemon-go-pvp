import { useMemo } from "react";
import { getPokemon, type PokemonEntry } from "../../lib/data";
import { suggestThird, teamCoverage, teamWeaknesses } from "../../lib/analysis";
import { useT } from "../../i18n";
import Sprite from "../Sprite";
import TypePills from "../TypePills";
import TypeChip from "../TypeChip";

interface Props {
  teamIds: string[];
  pool: PokemonEntry[];
  onChange: (ids: string[]) => void;
}

/** Coverage analysis for the roster assembled in the explorer. */
export default function TeamBuilder({ teamIds, pool, onChange }: Props) {
  const { t, name } = useT();
  const team = useMemo(
    () => teamIds.map(getPokemon).filter((m): m is NonNullable<typeof m> => Boolean(m)),
    [teamIds]
  );

  const coverage = useMemo(() => teamCoverage(team), [team]);
  const weaknesses = useMemo(() => teamWeaknesses(team), [team]);
  const suggestions = useMemo(
    () => (team.length === 2 ? suggestThird(team, pool, teamIds, 6) : []),
    [team, pool, teamIds]
  );

  if (team.length === 0) {
    return (
      <div className="flex min-h-40 flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 p-6 text-center text-white/40">
        <span className="text-3xl">🧩</span>
        <p className="mt-2">{t("analysis.builder.empty")}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {/* roster */}
      <div className="grid grid-cols-3 gap-2">
        {team.map((mon, i) => (
          <div
            key={teamIds[i]}
            className="relative flex flex-col items-center gap-1 rounded-xl border border-white/10 bg-[#1a1a1a] p-2"
          >
            <button
              type="button"
              onClick={() => onChange(teamIds.filter((_, j) => j !== i))}
              className="absolute right-1 top-1 grid h-5 w-5 place-items-center rounded-full bg-white/10 text-xs text-white/60 hover:bg-red-500/30 hover:text-red-200"
              aria-label={t("common.delete")}
            >
              ✕
            </button>
            <Sprite dex={mon.sprite} name={mon.name} className="h-14 w-14 object-contain" />
            <span className="line-clamp-1 text-center text-xs font-semibold">
              {name(mon)}
            </span>
            <TypePills types={mon.types} size="xs" />
          </div>
        ))}
      </div>

      {/* suggested 3rd pick (only with a 2-mon core) */}
      {suggestions.length > 0 && (
        <div className="animate-fade-up rounded-2xl border border-sky-400/30 bg-sky-500/10 p-4">
          <div className="flex items-center gap-2 text-sm font-bold">
            <span>✨</span>
            {t("analysis.builder.suggest")}
          </div>
          <div className="mb-2 text-[11px] text-white/50">
            {t("analysis.builder.suggestHint")}
          </div>
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
            {suggestions.map((entry, i) => (
              <button
                key={entry.id}
                type="button"
                onClick={() => onChange([...teamIds, entry.id])}
                style={{ animationDelay: `${i * 0.05}s` }}
                className="group flex animate-pop flex-col items-center gap-1 rounded-lg bg-white/5 p-2 text-center transition hover:bg-sky-500/20"
              >
                <Sprite
                  dex={entry.mon.sprite}
                  name={entry.mon.name}
                  className="h-12 w-12 object-contain transition group-hover:scale-110"
                />
                <span className="line-clamp-1 text-[10px] text-white/70">
                  {name(entry.mon)}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* coverage */}
      <div className="rounded-2xl border border-white/10 bg-[#1a1a1a] p-4">
        <div className="text-sm font-bold">{t("analysis.builder.coverage")}</div>
        <div className="mb-2 text-[11px] text-white/40">
          {t("analysis.builder.coverageHint")}
        </div>
        <div className="flex flex-wrap gap-1.5">
          {coverage.length ? (
            coverage.map((tp) => <TypeChip key={tp} type={tp} />)
          ) : (
            <span className="text-sm text-white/40">{t("analysis.none")}</span>
          )}
        </div>
      </div>

      {/* shared weaknesses */}
      <div className="rounded-2xl border border-white/10 bg-[#1a1a1a] p-4">
        <div className="text-sm font-bold">{t("analysis.builder.holes")}</div>
        <div className="mb-2 text-[11px] text-white/40">
          {t("analysis.builder.holesHint")}
        </div>
        {weaknesses.length ? (
          <div className="flex flex-wrap gap-1.5">
            {weaknesses.map((w) => (
              <span key={w.type} className="relative">
                <TypeChip type={w.type} />
                <span className="absolute -right-1 -top-1 grid h-4 w-4 place-items-center rounded-full bg-red-500 text-[9px] font-bold text-white">
                  {w.count}
                </span>
              </span>
            ))}
          </div>
        ) : (
          <span className="text-sm text-emerald-300/80">
            {t("analysis.builder.noHoles")}
          </span>
        )}
      </div>
    </div>
  );
}
