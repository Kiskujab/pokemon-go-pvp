import { useMemo, useState } from "react";
import { allPokemon, getPokemon } from "../../lib/data";
import { defensiveProfile } from "../../lib/analysis";
import { raidCounters } from "../../lib/raid";
import { useT } from "../../i18n";
import { typeColor, textOn } from "../../lib/typeColors";
import LanguagePicker from "../LanguagePicker";
import PokemonSearch from "../PokemonSearch";
import Sprite from "../Sprite";
import TypePills from "../TypePills";
import TypeChip from "../TypeChip";

interface Props {
  onExit: () => void;
}

/** Raid counter finder: pick a boss, get the best attackers by rotation DPS. */
export default function RaidScreen({ onExit }: Props) {
  const { t, name } = useT();
  const pool = useMemo(() => allPokemon(), []);
  const [bossId, setBossId] = useState<string | null>(null);
  const boss = bossId ? getPokemon(bossId) : null;

  const counters = useMemo(
    () => (boss && bossId ? raidCounters(boss, pool, bossId, 12) : []),
    [boss, bossId, pool]
  );
  const weak = useMemo(() => (boss ? defensiveProfile(boss).weak : []), [boss]);
  const topDps = counters[0]?.dps ?? 1;

  return (
    <div className="mx-auto flex min-h-dvh max-w-2xl flex-col gap-4 p-3">
      <header className="flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={onExit}
          className="rounded-lg bg-white/5 px-3 py-1.5 text-sm hover:bg-white/10"
        >
          ← {t("common.menu")}
        </button>
        <h1 className="truncate text-lg font-bold">{t("raid.title")}</h1>
        <LanguagePicker variant="compact" />
      </header>

      <div className="rounded-2xl border border-white/10 bg-[#1a1a1a] p-3">
        <PokemonSearch
          pool={pool}
          onPick={setBossId}
          active
          hint={t("raid.pickBoss")}
        />
      </div>

      {boss ? (
        <div className="flex flex-col gap-3">
          {/* boss identity + weaknesses */}
          <div className="rounded-2xl border border-white/10 bg-[#1a1a1a] p-4">
            <div className="flex items-center gap-3">
              <Sprite
                dex={boss.sprite}
                name={boss.name}
                className="h-16 w-16 shrink-0 object-contain"
              />
              <div className="min-w-0">
                <div className="truncate text-xl font-bold">{name(boss)}</div>
                <div className="mt-1">
                  <TypePills types={boss.types} />
                </div>
              </div>
            </div>
            <div className="mt-3">
              <div className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-white/40">
                {t("analysis.weakTo")}
              </div>
              <div className="flex flex-wrap gap-1.5">
                {weak.length ? (
                  weak.map((w) => (
                    <TypeChip key={w.type} type={w.type} mult={w.mult} />
                  ))
                ) : (
                  <span className="text-sm text-white/40">{t("analysis.none")}</span>
                )}
              </div>
            </div>
          </div>

          {/* counter ranking */}
          <div className="rounded-2xl border border-white/10 bg-[#1a1a1a] p-3">
            <div className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-white/40">
              {t("raid.counters")}
            </div>
            <div className="flex flex-col gap-1.5">
              {counters.map(({ entry, dps, fast, charged }, i) => {
                const fbg = typeColor(fast.type);
                const cbg = typeColor(charged.type);
                return (
                  <div
                    key={entry.id}
                    className="flex items-center gap-2 rounded-lg bg-white/5 p-2"
                  >
                    <span className="w-4 shrink-0 text-center text-xs font-bold text-white/40">
                      {i + 1}
                    </span>
                    <Sprite
                      dex={entry.mon.sprite}
                      name={entry.mon.name}
                      className="h-10 w-10 shrink-0 object-contain"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm font-semibold">
                        {name(entry.mon)}
                      </div>
                      <div className="mt-1 flex flex-wrap gap-1">
                        <span
                          className="rounded px-1.5 py-0.5 text-[10px] font-semibold"
                          style={{ background: fbg, color: textOn(fbg) }}
                        >
                          {name(fast)}
                        </span>
                        <span
                          className="rounded px-1.5 py-0.5 text-[10px] font-semibold"
                          style={{ background: cbg, color: textOn(cbg) }}
                        >
                          {name(charged)}
                        </span>
                      </div>
                    </div>
                    <div className="flex shrink-0 flex-col items-end">
                      <span className="text-sm font-bold tabular-nums text-sky-300">
                        {dps.toFixed(1)}
                      </span>
                      <span className="text-[9px] uppercase text-white/40">
                        {t("raid.dps")}
                      </span>
                      <div className="mt-0.5 h-1 w-16 overflow-hidden rounded-full bg-white/10">
                        <div
                          className="h-full rounded-full bg-sky-400"
                          style={{ width: `${Math.round((dps / topDps) * 100)}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        <div className="flex min-h-40 flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 p-6 text-center text-white/40">
          <span className="text-3xl">🛡️</span>
          <p className="mt-2">{t("raid.hint")}</p>
        </div>
      )}
    </div>
  );
}
