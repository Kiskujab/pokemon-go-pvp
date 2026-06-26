import type { Pokemon, PokemonType } from "../types";
import { TYPES } from "../types";
import { effectiveness, bestEffectiveness, SE } from "./effectiveness";
import { monAttackTypes, resolveMoves, type PokemonEntry } from "./data";

export interface TypeMult {
  type: PokemonType;
  mult: number;
}

/** How each attacking type fares against this mon: what it's weak to / resists. */
export function defensiveProfile(mon: Pokemon): {
  weak: TypeMult[];
  resist: TypeMult[];
} {
  const weak: TypeMult[] = [];
  const resist: TypeMult[] = [];
  for (const t of TYPES) {
    const m = effectiveness(t, mon.types);
    if (m > 1.001) weak.push({ type: t, mult: m });
    else if (m < 0.999) resist.push({ type: t, mult: m });
  }
  weak.sort((a, b) => b.mult - a.mult);
  resist.sort((a, b) => a.mult - b.mult);
  return { weak, resist };
}

/** Defender types that at least one of this mon's move types hits super-effectively. */
export function strongVsTypes(mon: Pokemon): PokemonType[] {
  const atk = monAttackTypes(mon);
  return TYPES.filter((d) => atk.some((a) => effectiveness(a, [d]) >= SE));
}

function chargedTypes(mon: Pokemon): PokemonType[] {
  return [...new Set(resolveMoves(mon.chargedMoves).map((m) => m.type))];
}

/** Type-only score for how good `candidate` is into `target` (higher = better). */
export function counterScore(candidate: Pokemon, target: Pokemon): number {
  const offensive = bestEffectiveness(monAttackTypes(candidate), target.types);
  const defensive = bestEffectiveness(chargedTypes(target), candidate.types);
  return offensive - defensive;
}

export interface Counter {
  entry: PokemonEntry;
  score: number;
}

/** Best type-counters to `target` drawn from the league pool, meta order breaking ties. */
export function topCounters(
  pool: PokemonEntry[],
  target: Pokemon,
  targetId: string,
  limit = 8
): Counter[] {
  return pool
    .filter((e) => e.id !== targetId)
    .map((entry) => ({ entry, score: counterScore(entry.mon, target) }))
    .filter((c) => c.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

// --- team builder ----------------------------------------------------------

/** Defender types the team can hit super-effectively (combined offense). */
export function teamCoverage(team: Pokemon[]): PokemonType[] {
  const set = new Set<PokemonType>();
  for (const mon of team) for (const t of strongVsTypes(mon)) set.add(t);
  return TYPES.filter((t) => set.has(t));
}

export interface SharedWeakness {
  type: PokemonType;
  count: number;
}

/** Attacking types that are super-effective against 2+ team members. */
export function teamWeaknesses(team: Pokemon[]): SharedWeakness[] {
  const out: SharedWeakness[] = [];
  for (const t of TYPES) {
    let count = 0;
    for (const mon of team) if (effectiveness(t, mon.types) > 1.001) count++;
    if (count >= 2) out.push({ type: t, count });
  }
  return out.sort((a, b) => b.count - a.count);
}
