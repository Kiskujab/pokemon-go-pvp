import { useMemo, useState, type ReactNode } from "react";
import { allPokemon, getMove, getPokemon } from "../../lib/data";
import { defensiveProfile } from "../../lib/analysis";
import { dpe, dpt, ept } from "../../lib/moveStats";
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

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex-1 rounded-lg bg-white/5 p-2 text-center">
      <div className="text-lg font-bold tabular-nums">{value}</div>
      <div className="text-[10px] uppercase text-white/40">{label}</div>
    </div>
  );
}

/** Full-dex browser: search any pokemon, read its stats, moves and profile. */
export default function DexScreen({ onExit }: Props) {
  const { t, name } = useT();
  const pool = useMemo(() => allPokemon(), []);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const mon = selectedId ? getPokemon(selectedId) : null;

  const profile = useMemo(() => (mon ? defensiveProfile(mon) : null), [mon]);
  const fastMoves = mon ? mon.fastMoves.map(getMove).filter(Boolean) : [];
  const chargedMoves = mon ? mon.chargedMoves.map(getMove).filter(Boolean) : [];

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
        <h1 className="truncate text-lg font-bold">{t("dex.title")}</h1>
        <LanguagePicker variant="compact" />
      </header>

      <div className="rounded-2xl border border-white/10 bg-[#1a1a1a] p-3">
        <PokemonSearch
          pool={pool}
          onPick={setSelectedId}
          active
          hint={t("dex.search")}
        />
      </div>

      {mon && profile ? (
        <div className="animate-fade-up flex flex-col gap-4 rounded-2xl border border-white/10 bg-[#1a1a1a] p-4">
          <div className="flex items-center gap-3">
            <Sprite
              dex={mon.sprite}
              name={mon.name}
              className="h-16 w-16 shrink-0 object-contain"
            />
            <div className="min-w-0 flex-1">
              <div className="truncate text-xl font-bold">{name(mon)}</div>
              <div className="mt-1">
                <TypePills types={mon.types} />
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <Stat label="ATK" value={mon.stats.atk} />
            <Stat label="DEF" value={mon.stats.def} />
            <Stat label="HP" value={mon.stats.hp} />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Section title={t("analysis.weakTo")}>
              <div className="flex flex-wrap gap-1.5">
                {profile.weak.length ? (
                  profile.weak.map((w) => (
                    <TypeChip key={w.type} type={w.type} mult={w.mult} />
                  ))
                ) : (
                  <span className="text-sm text-white/40">{t("analysis.none")}</span>
                )}
              </div>
            </Section>
            <Section title={t("analysis.resists")}>
              <div className="flex flex-wrap gap-1.5">
                {profile.resist.length ? (
                  profile.resist.map((w) => (
                    <TypeChip key={w.type} type={w.type} mult={w.mult} />
                  ))
                ) : (
                  <span className="text-sm text-white/40">{t("analysis.none")}</span>
                )}
              </div>
            </Section>
          </div>

          <Section title={t("analysis.moveStats")}>
            <div className="flex flex-col gap-1.5">
              {[...chargedMoves]
                .sort((a, b) => dpe(b!) - dpe(a!))
                .map((m) => {
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
        </div>
      ) : (
        <div className="flex min-h-40 flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 p-6 text-center text-white/40">
          <span className="text-3xl">📒</span>
          <p className="mt-2">{t("dex.hint")}</p>
        </div>
      )}
    </div>
  );
}
