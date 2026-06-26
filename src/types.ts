// ---------------------------------------------------------------------------
// Domain types. These describe the shape of the JSON data in /src/data and the
// runtime objects derived from it. Adding a new pokemon or move means editing
// the JSON only — never these types or the components.
// ---------------------------------------------------------------------------

export const TYPES = [
  "normal",
  "fire",
  "water",
  "electric",
  "grass",
  "ice",
  "fighting",
  "poison",
  "ground",
  "flying",
  "psychic",
  "bug",
  "rock",
  "ghost",
  "dragon",
  "dark",
  "steel",
  "fairy",
] as const;

export type PokemonType = (typeof TYPES)[number];

/** A league / battle format. Kept as a string-enum so new formats (premier,
 *  cups…) can be added by extending data, not the UI. */
export type League = "great" | "ultra" | "master";

export const LEAGUES: { id: League; name: string; cp: string; cpCap: number }[] = [
  { id: "great", name: "Great League", cp: "CP 1500", cpCap: 1500 },
  { id: "ultra", name: "Ultra League", cp: "CP 2500", cpCap: 2500 },
  { id: "master", name: "Master League", cp: "No cap", cpCap: 10000 },
];

export type MoveCategory = "fast" | "charged";

export interface Move {
  name: string;
  nameHu: string;
  type: PokemonType;
  category: MoveCategory;
  /** Always present, used by the (future) v2 damage formula. */
  power: number;
  /** Fast moves only. */
  energyGain?: number;
  /** Fast moves only — duration in 0.5s turns. */
  turns?: number;
  /** Charged moves only. */
  energyCost?: number;
}

export type MovesData = Record<string, Move>;

export interface PokemonStats {
  atk: number;
  def: number;
  hp: number;
}

export interface Pokemon {
  name: string;
  nameHu: string;
  types: PokemonType[];
  stats: PokemonStats;
  fastMoves: string[];
  /** Order matters: most-seen first, spammier (cheaper) to the left. */
  chargedMoves: string[];
  leagues: League[];
  /** PokeAPI national dex number, used to build the sprite URL. */
  sprite: number;
}

export type PokemonData = Record<string, Pokemon>;

export interface TypeRelation {
  superEffective: PokemonType[];
  notVeryEffective: PokemonType[];
}

export type TypesData = Record<PokemonType, TypeRelation>;

// --- runtime helpers -------------------------------------------------------

/** A pokemon id + its currently-selected moves (used for the player's team). */
export interface TeamMember {
  id: string;
  fastMove: string;
  chargedMoves: string[];
}
