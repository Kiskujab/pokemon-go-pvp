import type { Move, Pokemon } from "../types";
import { damage } from "./damage";
import { resolveMoves, type PokemonEntry } from "./data";

// A charged throw costs roughly half a second of animation in PvE.
const CHARGED_ANIM = 0.5;

export interface RaidCounter {
  entry: PokemonEntry;
  /** Best rotation DPS this attacker can sustain vs the boss (relative metric). */
  dps: number;
  /** The fast/charged moves that achieve that best rotation. */
  fast: Move;
  charged: Move;
}

/**
 * Sustained DPS of one fast/charged rotation vs the boss: fire fast moves until
 * the charged move is paid for, then throw it — DPS = total damage / total time.
 * Reuses the PvP damage() formula; its constant PvP bonus scales every candidate
 * equally, so it cancels in the ranking. A *relative* metric for ordering
 * counters, not an absolute PvE number. Returns 0 for an unusable moveset.
 */
export function rotationDps(
  fast: Move,
  charged: Move,
  attacker: Pokemon,
  boss: Pokemon
): number {
  const energyGain = fast.energyGain ?? 0;
  const fastTime = (fast.turns ?? 0) * 0.5;
  const cost = charged.energyCost ?? 0;
  if (energyGain <= 0 || fastTime <= 0 || cost <= 0) return 0;
  const fastDmg = damage(fast, attacker, boss);
  const chargedDmg = damage(charged, attacker, boss);
  const fastPerCharge = Math.ceil(cost / energyGain);
  const rotDmg = fastPerCharge * fastDmg + chargedDmg;
  const rotTime = fastPerCharge * fastTime + CHARGED_ANIM;
  return rotDmg / rotTime;
}

/** Best fast×charged rotation for `attacker` vs `boss`, with the moveset used. */
function bestRotation(
  attacker: Pokemon,
  boss: Pokemon
): { dps: number; fast: Move; charged: Move } | null {
  const fasts = resolveMoves(attacker.fastMoves);
  const chargeds = resolveMoves(attacker.chargedMoves);
  let best: { dps: number; fast: Move; charged: Move } | null = null;

  for (const fast of fasts) {
    for (const charged of chargeds) {
      const dps = rotationDps(fast, charged, attacker, boss);
      if (dps > 0 && (!best || dps > best.dps)) best = { dps, fast, charged };
    }
  }
  return best;
}

/**
 * Best counters to a raid boss, ranked by rotation DPS. Pool is the whole
 * dataset (raids aren't league-bound). The boss itself is excluded.
 */
export function raidCounters(
  boss: Pokemon,
  pool: PokemonEntry[],
  bossId: string,
  limit = 12
): RaidCounter[] {
  const out: RaidCounter[] = [];
  for (const entry of pool) {
    if (entry.id === bossId) continue;
    const r = bestRotation(entry.mon, boss);
    if (r) out.push({ entry, ...r });
  }
  return out.sort((a, b) => b.dps - a.dps).slice(0, limit);
}
