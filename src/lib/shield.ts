import type { League, Move, Pokemon } from "../types";
import { damage, effectiveHp } from "./damage";

export type ShieldVerdict = "shield" | "consider" | "no";

export interface ShieldAdvice {
  verdict: ShieldVerdict;
  /** Actual damage this move deals to my active mon (GO PvP formula). */
  damage: number;
  /** Fraction (0–1) of my active mon's effective HP that damage represents. */
  hpPercent: number;
  /** Short Hungarian label (kept for back-compat; UI translates via i18n). */
  label: string;
}

const LABELS: Record<ShieldVerdict, string> = {
  shield: "Pajzsolj!",
  consider: "Mérlegelj",
  no: "Ne pajzsolj",
};

// v2 — HP%-based thresholds: a hit that removes a big chunk is worth a shield.
// Single place to tune the verdict boundaries.
const SHIELD_AT = 0.35; // ≥35% of my HP → shield
const CONSIDER_AT = 0.18; // 18–35% → judgement call

function classify(damageVal: number, hpPercent: number): ShieldAdvice {
  let verdict: ShieldVerdict;
  if (hpPercent >= SHIELD_AT) verdict = "shield";
  else if (hpPercent >= CONSIDER_AT) verdict = "consider";
  else verdict = "no";
  return { verdict, damage: damageVal, hpPercent, label: LABELS[verdict] };
}

/**
 * v2 — should I shield this opponent charged move? Driven by the real GO PvP
 * damage formula: how much of my active mon's HP the hit actually removes.
 */
export function getShieldAdvice(
  myMon: Pokemon,
  oppMove: Move,
  opp: Pokemon,
  league: League
): ShieldAdvice {
  const dmg = damage(oppMove, opp, myMon);
  const hp = effectiveHp(myMon, league);
  return classify(dmg, hp > 0 ? dmg / hp : 0);
}

export interface AggregateShieldAdvice extends ShieldAdvice {
  /** The single hardest-hitting charged move that drives the verdict. */
  worstMove: Move | null;
}

/**
 * One-glance overall call: do I generally need to shield this mon? Worst-case —
 * driven by the opponent's hardest-hitting charged move, the one you'd burn a
 * shield on. Lets the player decide instantly without reading every move.
 */
export function getAggregateShieldAdvice(
  myMon: Pokemon,
  oppMoves: Move[],
  opp: Pokemon,
  league: League
): AggregateShieldAdvice {
  let worstMove: Move | null = null;
  let worst: ShieldAdvice = classify(0, 0);
  for (const m of oppMoves) {
    const a = getShieldAdvice(myMon, m, opp, league);
    if (a.damage > worst.damage) {
      worst = a;
      worstMove = m;
    }
  }
  return { ...worst, worstMove };
}
