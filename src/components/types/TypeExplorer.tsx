import { useMemo, useState } from "react";
import { TYPES, type PokemonType } from "../../types";
import { defensiveProfileForTypes } from "../../lib/analysis";
import { effectiveness, SE, NVE } from "../../lib/effectiveness";
import { useT } from "../../i18n";
import { typeColor, textOn } from "../../lib/typeColors";
import LanguagePicker from "../LanguagePicker";
import TypeChip from "../TypeChip";

interface Props {
  onExit: () => void;
}

/** Interactive type tool: a 1–2 type weakness calculator + the full 18×18 chart. */
export default function TypeExplorer({ onExit }: Props) {
  const { t, typeName } = useT();
  const [picked, setPicked] = useState<PokemonType[]>([]);

  const toggle = (type: PokemonType) =>
    setPicked((p) =>
      p.includes(type)
        ? p.filter((x) => x !== type)
        : p.length >= 2
        ? [p[1], type]
        : [...p, type]
    );

  const profile = useMemo(
    () => (picked.length ? defensiveProfileForTypes(picked) : null),
    [picked]
  );
  // Double weaknesses (mult > single super-effective) deserve a callout.
  const doubleWeak = profile?.weak.filter((w) => w.mult > SE + 0.001) ?? [];

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
        <h1 className="truncate text-lg font-bold">{t("types.title")}</h1>
        <LanguagePicker variant="compact" />
      </header>

      {/* type picker */}
      <div className="rounded-2xl border border-white/10 bg-[#1a1a1a] p-3">
        <div className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-white/40">
          {t("types.pick")}
        </div>
        <div className="flex flex-wrap gap-1.5">
          {TYPES.map((type) => {
            const on = picked.includes(type);
            const bg = typeColor(type);
            return (
              <button
                key={type}
                type="button"
                onClick={() => toggle(type)}
                className={`rounded-md px-2 py-1 text-xs font-semibold transition ${
                  on ? "ring-2 ring-white" : "opacity-60 hover:opacity-100"
                }`}
                style={{ background: bg, color: textOn(bg) }}
              >
                {typeName(type)}
              </button>
            );
          })}
        </div>
      </div>

      {/* result */}
      {profile && (
        <div className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-[#1a1a1a] p-4">
          {doubleWeak.length > 0 && (
            <div>
              <div className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-red-300/70">
                {t("types.doubleWeak")}
              </div>
              <div className="flex flex-wrap gap-1.5">
                {doubleWeak.map((w) => (
                  <TypeChip key={w.type} type={w.type} mult={w.mult} />
                ))}
              </div>
            </div>
          )}
          <div>
            <div className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-white/40">
              {t("analysis.weakTo")}
            </div>
            <div className="flex flex-wrap gap-1.5">
              {profile.weak.length ? (
                profile.weak.map((w) => (
                  <TypeChip key={w.type} type={w.type} mult={w.mult} />
                ))
              ) : (
                <span className="text-sm text-white/40">{t("analysis.none")}</span>
              )}
            </div>
          </div>
          <div>
            <div className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-white/40">
              {t("analysis.resists")}
            </div>
            <div className="flex flex-wrap gap-1.5">
              {profile.resist.length ? (
                profile.resist.map((w) => (
                  <TypeChip key={w.type} type={w.type} mult={w.mult} />
                ))
              ) : (
                <span className="text-sm text-white/40">{t("analysis.none")}</span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* full chart */}
      <div className="rounded-2xl border border-white/10 bg-[#1a1a1a] p-3">
        <div className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-white/40">
          {t("types.chart")}
        </div>
        <div className="overflow-x-auto">
          <table className="border-separate border-spacing-0.5 text-center">
            <thead>
              <tr>
                <th className="sticky left-0 z-10 bg-[#1a1a1a]" />
                {TYPES.map((def) => (
                  <th key={def} title={typeName(def)} className="p-0">
                    <span
                      className="block h-4 w-4 rounded-sm"
                      style={{ background: typeColor(def) }}
                    />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {TYPES.map((atk) => (
                <tr key={atk}>
                  <th
                    title={typeName(atk)}
                    className="sticky left-0 z-10 bg-[#1a1a1a] pr-1 text-right"
                  >
                    <span
                      className="inline-block h-4 w-4 rounded-sm align-middle"
                      style={{ background: typeColor(atk) }}
                    />
                  </th>
                  {TYPES.map((def) => {
                    const m = effectiveness(atk, [def]);
                    const cls =
                      m >= SE
                        ? "bg-emerald-500/80 text-black"
                        : m <= NVE
                        ? "bg-red-500/70 text-white"
                        : "bg-white/5 text-white/30";
                    const glyph = m >= SE ? "+" : m <= NVE ? "−" : "";
                    return (
                      <td key={def} className="p-0">
                        <span
                          title={`${typeName(atk)} → ${typeName(def)}: ×${m
                            .toFixed(3)
                            .replace(/\.?0+$/, "")}`}
                          className={`grid h-4 w-4 place-items-center rounded-sm text-[10px] font-bold ${cls}`}
                        >
                          {glyph}
                        </span>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-2 text-[10px] text-white/40">
          {t("types.chartHint")}
        </p>
      </div>
    </div>
  );
}
