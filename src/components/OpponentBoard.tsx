import type { Pokemon } from "../types";
import { getMove } from "../lib/data";
import { getShieldAdvice } from "../lib/shield";
import { useT } from "../i18n";
import { typeColor, textOn } from "../lib/typeColors";
import ChargedMoveTile from "./ChargedMoveTile";
import Sprite from "./Sprite";
import TypePills from "./TypePills";

interface Props {
  opp: Pokemon;
  /** My active pokemon — drives the per-move shield advice when present. */
  activeMyMon?: Pokemon | null;
}

/** Opponent battle board, reference-infographic style: dark card, fast-move
 *  header(s) coloured by type, and a charged-move grid with move counts. */
export default function OpponentBoard({ opp, activeMyMon }: Props) {
  const { name } = useT();
  const fastMoves = opp.fastMoves
    .map((id) => getMove(id))
    .filter((m): m is NonNullable<typeof m> => Boolean(m));
  const chargedMoves = opp.chargedMoves
    .map((id) => getMove(id))
    .filter((m): m is NonNullable<typeof m> => Boolean(m));

  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#1a1a1a] shadow-xl">
      {/* identity */}
      <div className="flex items-center gap-3 border-b border-white/10 bg-black/30 px-4 py-3">
        <Sprite
          dex={opp.sprite}
          name={opp.name}
          className="h-16 w-16 shrink-0 object-contain"
        />
        <div className="min-w-0">
          <div className="truncate text-xl font-bold">{name(opp)}</div>
          <div className="mt-1">
            <TypePills types={opp.types} />
          </div>
        </div>
      </div>

      {/* one section per viable fast move (counts differ per fast move) */}
      <div className="flex flex-col gap-3 p-3">
        {fastMoves.map((fm) => {
          const cap = fm.energyGain ? Math.floor(100 / fm.energyGain) : 0;
          const fbg = typeColor(fm.type);
          return (
            <div key={fm.name} className="rounded-lg bg-black/20 p-2">
              <div
                className="mb-2 flex items-center justify-between rounded-md px-3 py-1.5 text-sm font-bold uppercase tracking-wide"
                style={{ background: fbg, color: textOn(fbg) }}
              >
                <span className="truncate">{name(fm)}</span>
                <span className="ml-2 shrink-0 tabular-nums opacity-90">
                  ({fm.turns ?? "?"} , {cap})
                </span>
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                {chargedMoves.map((cm) => (
                  <ChargedMoveTile
                    key={cm.name}
                    move={cm}
                    fastMove={fm}
                    shield={
                      activeMyMon ? getShieldAdvice(activeMyMon, cm) : undefined
                    }
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
