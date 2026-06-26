import type { Move } from "../types";
import type { ShieldAdvice, ShieldVerdict } from "../lib/shield";
import { chargeCountDisplay } from "../lib/moveCounts";
import { useT } from "../i18n";
import { typeColor, textOn } from "../lib/typeColors";

const VERDICT_KEY: Record<ShieldVerdict, "shield.shield"> = {
  shield: "shield.shield",
  consider: "shield.consider" as "shield.shield",
  no: "shield.no" as "shield.shield",
};

interface Props {
  move: Move;
  /** Fast move used to compute the energy counts for this charged move. */
  fastMove: Move;
  shield?: ShieldAdvice;
}

const SHIELD_STYLE: Record<ShieldVerdict, { dot: string; ring: string }> = {
  shield: { dot: "bg-red-500", ring: "ring-red-400" },
  consider: { dot: "bg-amber-400", ring: "ring-amber-300" },
  no: { dot: "bg-emerald-500", ring: "ring-emerald-400" },
};

export default function ChargedMoveTile({ move, fastMove, shield }: Props) {
  const { t, name, typeName } = useT();
  const bg = typeColor(move.type);
  const fg = textOn(bg);
  const { base, marks } = chargeCountDisplay(fastMove, move);
  const sv = shield ? SHIELD_STYLE[shield.verdict] : null;

  return (
    <div
      className={`relative flex flex-col justify-between overflow-hidden rounded-md px-2 py-1.5 ${
        sv ? `ring-2 ${sv.ring}` : ""
      }`}
      style={{ background: bg, color: fg }}
      title={`${name(move)} · ${typeName(move.type)}${
        shield ? ` · ${t(VERDICT_KEY[shield.verdict])}` : ""
      }`}
    >
      <div className="flex items-start leading-none">
        <span className="text-2xl font-extrabold tabular-nums">{base}</span>
        {marks && (
          <span className="ml-0.5 mt-0.5 font-mono text-sm font-bold opacity-90">
            {marks}
          </span>
        )}
        {shield && sv && (
          <span
            className={`ml-auto grid h-4 w-4 place-items-center rounded-full text-[9px] ${sv.dot}`}
            title={t(VERDICT_KEY[shield.verdict])}
          >
            🛡
          </span>
        )}
      </div>
      <div className="mt-1 truncate text-[11px] font-bold uppercase leading-tight">
        {name(move)}
      </div>
    </div>
  );
}
