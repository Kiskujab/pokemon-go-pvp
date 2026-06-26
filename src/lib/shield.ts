import type { Move, Pokemon } from "../types";
import { effectiveness, SE, NVE } from "./effectiveness";

export type ShieldVerdict = "shield" | "consider" | "no";

export interface ShieldAdvice {
  verdict: ShieldVerdict;
  /** Effectiveness multiplier of the move's type vs the defender's types. */
  multiplier: number;
  /** Short Hungarian label for the UI. */
  label: string;
}

const LABELS: Record<ShieldVerdict, string> = {
  shield: "Pajzsolj!",
  consider: "Mérlegelj",
  no: "Ne pajzsolj",
};

/** Classify a damage multiplier into a shield verdict. Single place to swap the
 *  v1 type-heuristic thresholds for the v2 HP%-based ones. */
function classify(multiplier: number): ShieldAdvice {
  let verdict: ShieldVerdict;
  if (multiplier >= SE) verdict = "shield";
  else if (multiplier <= NVE) verdict = "no";
  else verdict = "consider";
  return { verdict, multiplier, label: LABELS[verdict] };
}

/**
 * v1 — type-based shield heuristic for one opponent charged move vs my active
 * pokemon. The whole body is swappable: in v2 plug in the real GO damage
 * formula (power, my def, STAB, my remaining HP%) without touching callers.
 *
 *   dmg = floor(0.5 * power * (Atk/Def) * STAB * effectiveness) + 1   // <- v2 here
 */
export function getShieldAdvice(myMon: Pokemon, oppMove: Move): ShieldAdvice {
  return classify(effectiveness(oppMove.type, myMon.types));
}

export interface AggregateShieldAdvice extends ShieldAdvice {
  /** The single most threatening charged move that drives the verdict. */
  worstMove: Move | null;
}

/**
 * One-glance overall call: do I generally need to shield this mon? Worst-case
 * heuristic — driven by the opponent's hardest-hitting charged move, because
 * that's the one you'd burn a shield on. Lets the player decide instantly
 * without reading every move.
 */
export function getAggregateShieldAdvice(
  myMon: Pokemon,
  oppMoves: Move[]
): AggregateShieldAdvice {
  let worstMove: Move | null = null;
  let max = -1;
  for (const m of oppMoves) {
    const e = effectiveness(m.type, myMon.types);
    if (e > max) {
      max = e;
      worstMove = m;
    }
  }
  return { ...classify(max < 0 ? 1 : max), worstMove };
}
