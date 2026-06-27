import type { Move } from "../types";

// Pure move-data efficiency metrics — no IVs or levels needed, so these are
// exact. Used by the explorer to compare moves at a glance.

/** Damage per energy — charged-move value (higher = more damage per energy). */
export function dpe(move: Move): number {
  const cost = move.energyCost ?? 0;
  if (cost <= 0) return 0;
  return move.power / cost;
}

/** Damage per turn — fast-move pressure (1 turn = 0.5s). */
export function dpt(move: Move): number {
  const turns = move.turns ?? 0;
  if (turns <= 0) return 0;
  return move.power / turns;
}

/** Energy per turn — how fast a fast move builds charge. */
export function ept(move: Move): number {
  const turns = move.turns ?? 0;
  if (turns <= 0) return 0;
  return (move.energyGain ?? 0) / turns;
}
