import { useMemo, type ReactNode } from "react";
import type { League } from "../../types";
import { getMove, getPokemon, type PokemonEntry } from "../../lib/data";
import { defensiveProfile, strongVsTypes, topCounters } from "../../lib/analysis";
import { dpe, dpt, ept } from "../../lib/moveStats";
import { useT } from "../../i18n";
import { typeColor, textOn } from "../../lib/typeColors";
import Sprite from "../Sprite";
import TypePills from "../TypePills";
import TypeChip from "../TypeChip";

interface Props {
  selectedId: string | null;
  pool: PokemonEntry[];
  league: League;
  cpLabel: string;
  inTeam: boolean;
  teamFull: boolean;
  onAdd: (id: string) => void;
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div>
      <div className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-white/40">
        {title}
      </div>
      {children}
    </div>
  );
}

/** Detail card for the explorer's selected pokemon. */
export default function MonAnalysis({
  selectedId,
  pool,
  cpLabel,
  inTeam,
  teamFull,
  onAdd,
}: Props) {
  const { t, name } = useT();
  const mon = selectedId ? getPokemon(selectedId) : null;

  const profile = useMemo(() => (mon ? defensiveProfile(mon) : null), [mon]);
  const strong = useMemo(() => (mon ? strongVsTypes(mon) : []), [mon]);
  const counters = useMemo(
    () => (mon && selectedId ? topCounters(pool, mon, selectedId, 6) : []),
    [mon, selectedId, pool]
  );

  if (!mon || !selectedId) {
    return (
      <div className="flex min-h-40 flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 p-6 text-center text-white/40">
        <span className="text-3xl">📊</span>
        <p className="mt-2">{t("analysis.pick")}</p>
      </div>
    );
  }

  const fastMoves = mon.fastMoves.map(getMove).filter(Boolean);
  const chargedMoves = mon.chargedMoves.map(getMove).filter(Boolean);

  return (
    <div className="animate-fade-up flex flex-col gap-4 rounded-2xl border border-white/10 bg-[#1a1a1a] p-4">
      {/* identity */}
      <div className="flex items-center gap-3">
        <Sprite dex={mon.sprite} name={mon.name} className="h-16 w-16 shrink-0 object-contain" />
        <div className="min-w-0 flex-1">
          <div className="truncate text-xl font-bold">{name(mon)}</div>
          <div className="mt-1 flex items-center gap-2">
            <TypePills types={mon.types} />
            <span className="text-xs text-white/40">{cpLabel}</span>
          </div>
        </div>
        <button
          type="button"
          disabled={inTeam || teamFull}
          onClick={() => onAdd(selectedId)}
          className="shrink-0 rounded-lg bg-sky-500 px-3 py-2 text-sm font-bold text-black transition enabled:hover:bg-sky-400 disabled:opacity-30"
        >
          {inTeam
            ? t("analysis.builder.added")
            : teamFull
            ? t("analysis.builder.full")
            : `+ ${t("analysis.builder.add")}`}
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Section title={t("analysis.weakTo")}>
          <div className="flex flex-wrap gap-1.5">
            {profile!.weak.length ? (
              profile!.weak.map((w) => (
                <TypeChip key={w.type} type={w.type} mult={w.mult} />
              ))
            ) : (
              <span className="text-sm text-white/40">{t("analysis.none")}</span>
            )}
          </div>
        </Section>

        <Section title={t("analysis.resists")}>
          <div className="flex flex-wrap gap-1.5">
            {profile!.resist.length ? (
              profile!.resist.map((w) => (
                <TypeChip key={w.type} type={w.type} mult={w.mult} />
              ))
            ) : (
              <span className="text-sm text-white/40">{t("analysis.none")}</span>
            )}
          </div>
        </Section>
      </div>

      <Section title={t("analysis.strongVs")}>
        <div className="flex flex-wrap gap-1.5">
          {strong.length ? (
            strong.map((tp) => <TypeChip key={tp} type={tp} />)
          ) : (
            <span className="text-sm text-white/40">{t("analysis.none")}</span>
          )}
        </div>
      </Section>

      <Section title={t("analysis.movepool")}>
        <div className="flex flex-col gap-2">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="w-14 text-[11px] uppercase text-white/40">
              {t("analysis.fast")}
            </span>
            {fastMoves.map((m) => {
              const bg = typeColor(m!.type);
              return (
                <span
                  key={m!.name}
                  className="rounded-md px-2 py-0.5 text-xs font-semibold"
                  style={{ background: bg, color: textOn(bg) }}
                >
                  {name(m!)}
                </span>
              );
            })}
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="w-14 text-[11px] uppercase text-white/40">
              {t("analysis.charged")}
            </span>
            {chargedMoves.map((m) => {
              const bg = typeColor(m!.type);
              return (
                <span
                  key={m!.name}
                  className="rounded-md px-2 py-0.5 text-xs font-semibold"
                  style={{ background: bg, color: textOn(bg) }}
                >
                  {name(m!)}
                </span>
              );
            })}
          </div>
        </div>
      </Section>

      <Section title={t("analysis.moveStats")}>
        <div className="flex flex-col gap-1.5">
          {[...chargedMoves]
            .sort((a, b) => dpe(b!) - dpe(a!))
            .map((m) => {
              const bg = typeColor(m!.type);
              return (
                <div
                  key={m!.name}
                  className="flex items-center gap-2 text-xs"
                >
                  <span
                    className="min-w-0 flex-1 truncate rounded-md px-2 py-0.5 font-semibold"
                    style={{ background: bg, color: textOn(bg) }}
                  >
                    {name(m!)}
                  </span>
                  <span className="shrink-0 tabular-nums text-white/70">
                    {dpe(m!).toFixed(2)} DPE
                  </span>
                </div>
              );
            })}
          {fastMoves.map((m) => {
            const bg = typeColor(m!.type);
            return (
              <div key={m!.name} className="flex items-center gap-2 text-xs">
                <span
                  className="min-w-0 flex-1 truncate rounded-md px-2 py-0.5 font-semibold"
                  style={{ background: bg, color: textOn(bg) }}
                >
                  {name(m!)}
                </span>
                <span className="shrink-0 tabular-nums text-white/70">
                  {dpt(m!).toFixed(1)} DPT · {ept(m!).toFixed(1)} EPT
                </span>
              </div>
            );
          })}
        </div>
      </Section>

      <Section title={t("analysis.counters")}>
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
          {counters.map(({ entry }) => (
            <div
              key={entry.id}
              className="flex flex-col items-center gap-1 rounded-lg bg-white/5 p-2 text-center"
            >
              <Sprite
                dex={entry.mon.sprite}
                name={entry.mon.name}
                className="h-10 w-10 object-contain"
              />
              <span className="line-clamp-1 text-[10px] text-white/70">
                {name(entry.mon)}
              </span>
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
}
