import type { PokemonType } from "../types";
import { bestEffectiveness } from "./effectiveness";

export interface MatchupSides {
  /** Types my pokemon can attack with (fast + charged move types). */
  myAttackTypes: PokemonType[];
  /** My pokemon's own types (what the opponent hits). */
  myTypes: PokemonType[];
  /** Opponent's types (what I hit). */
  oppTypes: PokemonType[];
  /** Types the opponent threatens with (its charged move types). */
  oppThreatTypes: PokemonType[];
}

/**
 * v1 type-only matchup score. Higher is better for me.
 *   offensive = best multiplier my moves get on the opponent
 *   defensive = best multiplier the opponent's charged moves get on me
 *   score = offensive − defensive
 */
export function matchupScore(s: MatchupSides): number {
  const offensive = bestEffectiveness(s.myAttackTypes, s.oppTypes);
  const defensive = bestEffectiveness(s.oppThreatTypes, s.myTypes);
  return offensive - defensive;
}

/**
 * Index of the best pokemon in `sides` against the opponent, or -1 if empty.
 * Ties keep the earlier entry (stable, matches team order).
 */
export function recommendBestIndex(sides: MatchupSides[]): number {
  let bestIdx = -1;
  let bestScore = -Infinity;
  sides.forEach((s, i) => {
    const score = matchupScore(s);
    if (score > bestScore) {
      bestScore = score;
      bestIdx = i;
    }
  });
  return bestIdx;
}
