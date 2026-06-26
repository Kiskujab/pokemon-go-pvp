import type { PokemonType, TypesData } from "../types";
import typesData from "../data/types.json";

// Pokémon GO type-effectiveness multipliers (different from the main series).
export const SE = 1.6; // super effective
export const NEUTRAL = 1.0;
export const NVE = 0.625; // not very effective (1 / 1.6)
// GO has no immunity — a doubly-resisted hit is just NVE squared (0.390625).

const TABLE = typesData as TypesData;

/**
 * Multiplier for a single attacking type hitting a defender that may have one
 * or two types. Walks each defender type and stacks the per-type modifier, so
 * a dual-type that resists twice yields 0.625² and a dual-type weak twice
 * yields 1.6².
 */
export function effectiveness(
  attackType: PokemonType,
  defenderTypes: PokemonType[]
): number {
  const rel = TABLE[attackType];
  if (!rel) return NEUTRAL;
  let mult = 1;
  for (const def of defenderTypes) {
    if (rel.superEffective.includes(def)) mult *= SE;
    else if (rel.notVeryEffective.includes(def)) mult *= NVE;
  }
  return mult;
}

/** Best (highest) multiplier across a set of attacking types — i.e. the most
 *  damage this attacker can threaten with its available move types. */
export function bestEffectiveness(
  attackTypes: PokemonType[],
  defenderTypes: PokemonType[]
): number {
  let best = 0;
  for (const t of attackTypes) {
    best = Math.max(best, effectiveness(t, defenderTypes));
  }
  return best;
}

export type EffectivenessTier = "super" | "neutral" | "resist" | "double-resist";

export function effectivenessTier(mult: number): EffectivenessTier {
  if (mult >= SE) return "super";
  if (mult > NVE) return "neutral";
  if (mult > NVE * NVE) return "resist";
  return "double-resist";
}
