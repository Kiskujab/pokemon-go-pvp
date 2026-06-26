import type {
  League,
  Move,
  Pokemon,
  PokemonType,
  TeamMember,
} from "../types";
import type { MatchupSides } from "./recommend";
import pokemonData from "../data/pokemon.json";
import movesData from "../data/moves.json";

// All domain data comes from JSON — never hardcoded in a component. The object
// key order is the meta order produced by the build script (most relevant
// first), which we preserve for search ranking.
const POKEMON = pokemonData as unknown as Record<string, Pokemon>;
const MOVES = movesData as unknown as Record<string, Move>;

export function getPokemon(id: string): Pokemon | undefined {
  return POKEMON[id];
}

export function getMove(id: string): Move | undefined {
  return MOVES[id];
}

export interface PokemonEntry {
  id: string;
  mon: Pokemon;
}

/** Every pokemon eligible for the given league, in meta order. */
export function leaguePool(league: League): PokemonEntry[] {
  const out: PokemonEntry[] = [];
  for (const id in POKEMON) {
    const mon = POKEMON[id];
    if (mon.leagues.includes(league)) out.push({ id, mon });
  }
  return out;
}

// --- search ----------------------------------------------------------------

function normalize(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[^a-z0-9]/g, "");
}

/**
 * Prefix matcher used by the keystroke search. Ranks: full-name prefix first,
 * then word-start prefix (so "Necrozma Dawn Wings" is reachable by "dawn"),
 * each group kept in the pool's existing meta order.
 */
export function searchPokemon(
  pool: PokemonEntry[],
  query: string,
  limit = 8
): PokemonEntry[] {
  const q = normalize(query);
  if (!q) return [];
  const prefix: PokemonEntry[] = [];
  const wordPrefix: PokemonEntry[] = [];
  for (const entry of pool) {
    const full = normalize(entry.mon.name);
    if (full.startsWith(q)) {
      prefix.push(entry);
      continue;
    }
    const words = entry.mon.name.toLowerCase().split(/[^a-z0-9]+/);
    if (words.some((w) => normalize(w).startsWith(q))) wordPrefix.push(entry);
  }
  return [...prefix, ...wordPrefix].slice(0, limit);
}

// --- type helpers ----------------------------------------------------------

function uniqueTypes(moveIds: string[]): PokemonType[] {
  const set = new Set<PokemonType>();
  for (const id of moveIds) {
    const m = MOVES[id];
    if (m) set.add(m.type);
  }
  return [...set];
}

/** Attack types over every move a pokemon could run (unknown opponent). */
export function monAttackTypes(mon: Pokemon): PokemonType[] {
  return uniqueTypes([...mon.fastMoves, ...mon.chargedMoves]);
}

/** Attack types from a specific selected loadout (my team member). */
export function memberAttackTypes(member: TeamMember): PokemonType[] {
  return uniqueTypes([member.fastMove, ...member.chargedMoves]);
}

/** Resolve a list of move ids to Move objects, skipping unknowns. */
export function resolveMoves(moveIds: string[]): Move[] {
  return moveIds.map((id) => MOVES[id]).filter((m): m is Move => Boolean(m));
}

/** Build the matchup inputs for one of my team members vs an opponent. */
export function buildSides(member: TeamMember, opp: Pokemon): MatchupSides {
  const myMon = POKEMON[member.id];
  return {
    myAttackTypes: memberAttackTypes(member),
    myTypes: myMon ? myMon.types : [],
    oppTypes: opp.types,
    oppThreatTypes: uniqueTypes(opp.chargedMoves),
  };
}

/** Default loadout for a pokemon: first fast move + up to two charged moves
 *  (the data is already ordered most-common first). */
export function defaultLoadout(id: string): TeamMember | null {
  const mon = POKEMON[id];
  if (!mon) return null;
  return {
    id,
    fastMove: mon.fastMoves[0] ?? "",
    chargedMoves: mon.chargedMoves.slice(0, 2),
  };
}

export function pokemonCount(): number {
  return Object.keys(POKEMON).length;
}
