import type { Pokemon } from "../types";
import type { ShieldVerdict } from "../lib/shield";
import { getMove } from "../lib/data";
import { getAggregateShieldAdvice, getShieldAdvice } from "../lib/shield";
import { typeColor } from "../lib/typeColors";

interface Props {
  activeMyMon: Pokemon;
  opp: Pokemon;
}

// Solid colours for the big unified call.
const BIG_CLASS: Record<ShieldVerdict, string> = {
  shield: "bg-red-500 text-white",
  consider: "bg-amber-400 text-black",
  no: "bg-emerald-500 text-black",
};

// Subtle tints for the per-move chips.
const CHIP_CLASS: Record<ShieldVerdict, string> = {
  shield: "bg-red-500/20 text-red-200 ring-red-500/40",
  consider: "bg-amber-400/20 text-amber-100 ring-amber-400/40",
  no: "bg-emerald-500/20 text-emerald-200 ring-emerald-500/40",
};

const fmtMult = (n: number) => `×${n.toFixed(2).replace(/\.?0+$/, "")}`;

/** Compact shield panel (sits above the board): one big unified verdict for
 *  split-second calls, plus per-move chips side-by-side for detail. */
export default function ShieldAdvice({ activeMyMon, opp }: Props) {
  const moves = opp.chargedMoves
    .map((id) => getMove(id))
    .filter((m): m is NonNullable<typeof m> => Boolean(m));

  const overall = getAggregateShieldAdvice(activeMyMon, moves);

  return (
    <div className="rounded-2xl border border-white/10 bg-[#1a1a1a] p-2.5">
      {/* unified verdict */}
      <div className="flex items-center gap-3">
        <div
          className={`flex shrink-0 items-baseline gap-2 rounded-xl px-3 py-2 ${BIG_CLASS[overall.verdict]}`}
        >
          <span className="text-lg font-extrabold uppercase leading-none">
            {overall.label}
          </span>
          <span className="text-xs font-bold tabular-nums opacity-80">
            {fmtMult(overall.multiplier)}
          </span>
        </div>
        <div className="min-w-0 text-xs leading-tight text-white/55">
          <div className="truncate">
            <span className="font-semibold text-white/80">{activeMyMon.name}</span>{" "}
            vs {opp.name}
          </div>
          {overall.worstMove && (
            <div className="truncate">
              legveszélyesebb: {overall.worstMove.nameHu || overall.worstMove.name}
            </div>
          )}
        </div>
      </div>

      {/* per-move chips, side by side */}
      <div className="mt-2 grid grid-cols-2 gap-1.5 sm:grid-cols-4">
        {moves.map((m) => {
          const advice = getShieldAdvice(activeMyMon, m);
          return (
            <div
              key={m.name}
              className={`flex items-center gap-1.5 rounded-lg px-2 py-1 ring-1 ${CHIP_CLASS[advice.verdict]}`}
              title={`${m.nameHu || m.name} · ${advice.label} (${fmtMult(advice.multiplier)})`}
            >
              <span
                className="h-2.5 w-2.5 shrink-0 rounded-full"
                style={{ background: typeColor(m.type) }}
              />
              <span className="min-w-0 flex-1 truncate text-[11px] font-medium">
                {m.nameHu || m.name}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
