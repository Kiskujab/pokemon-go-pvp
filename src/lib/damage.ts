import type { League, Move, Pokemon } from "../types";
import { effectiveness } from "./effectiveness";

// --- Pokémon GO PvP damage constants ---------------------------------------

export const STAB = 1.2; // same-type attack bonus
export const PVP_BONUS = 1.3; // fixed PvP damage multiplier (Niantic constant)

/**
 * Representative Combat Power Multiplier per league. Real effective stats are
 * (base + IV) · CPM, but the dataset has no IVs or levels. The CPM cancels in
 * the attacker-Atk / defender-Def ratio, so it only matters for normalizing
 * damage against a defender's HP. We assume an average level for each league
 * (IVs ≈ 0). These are approximations — good enough for shield calls.
 */
export const LEAGUE_CPM: Record<League, number> = {
  great: 0.667, // ~level 25
  ultra: 0.79, // ~level 45
  master: 0.846, // level 50
};

/** Effective (CPM-scaled) HP a pokemon brings to the given league. */
export function effectiveHp(mon: Pokemon, league: League): number {
  return Math.floor(mon.stats.hp * LEAGUE_CPM[league]);
}

/**
 * Damage one move deals from attacker to defender, using GO's PvP formula:
 *   dmg = floor(power · (Atk/Def) · STAB · effectiveness · 0.5 · 1.3) + 1
 *
 * Base stats are used directly: the CPM is identical on both sides at a given
 * level, so it cancels in the Atk/Def ratio and the absolute damage is correct.
 */
export function damage(
  move: Move,
  attacker: Pokemon,
  defender: Pokemon
): number {
  const power = move.power ?? 0;
  if (power <= 0) return 0;
  const stab = attacker.types.includes(move.type) ? STAB : 1;
  const eff = effectiveness(move.type, defender.types);
  const raw =
    power *
    (attacker.stats.atk / defender.stats.def) *
    stab *
    eff *
    0.5 *
    PVP_BONUS;
  return Math.floor(raw) + 1;
}

/** Fraction (0–1) of the defender's effective HP that one move removes. */
export function damagePercent(
  move: Move,
  attacker: Pokemon,
  defender: Pokemon,
  league: League
): number {
  const hp = effectiveHp(defender, league);
  if (hp <= 0) return 0;
  return damage(move, attacker, defender) / hp;
}
