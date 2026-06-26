/**
 * build-data.ts — regenerates src/data/{types,moves,pokemon}.json from the
 * canonical PvPoke gamemaster + league rankings (open data on GitHub).
 *
 *   npm run build-data
 *
 * Adding/refreshing pokemon is a data concern: re-run this, no code changes.
 * If the network fetch fails it falls back to a small hand seed so the app
 * still builds and demos. Tune TOP_PER_LEAGUE to widen/narrow the meta pool.
 */
import { writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_DIR = join(__dirname, "..", "src", "data");

const BASE = "https://raw.githubusercontent.com/pvpoke/pvpoke/master/src/data";
const GM_URL = `${BASE}/gamemaster.json`;
const RANK_URLS: Record<string, string> = {
  great: `${BASE}/rankings/all/overall/rankings-1500.json`,
  ultra: `${BASE}/rankings/all/overall/rankings-2500.json`,
  master: `${BASE}/rankings/all/overall/rankings-10000.json`,
};
// Process order = global meta order; first league a mon appears in wins its
// stats/moveset, the rest just extend its `leagues` list.
const LEAGUE_ORDER = ["great", "ultra", "master"] as const;
const TOP_PER_LEAGUE = 70;

// Canonical GO type chart (immunities collapse to double-resist). Written out
// so `npm run build-data` regenerates all three data files together.
const TYPE_CHART: Record<string, { superEffective: string[]; notVeryEffective: string[] }> = {
  normal: { superEffective: [], notVeryEffective: ["rock", "steel", "ghost"] },
  fire: { superEffective: ["grass", "ice", "bug", "steel"], notVeryEffective: ["fire", "water", "rock", "dragon"] },
  water: { superEffective: ["fire", "ground", "rock"], notVeryEffective: ["water", "grass", "dragon"] },
  electric: { superEffective: ["water", "flying"], notVeryEffective: ["electric", "grass", "dragon", "ground"] },
  grass: { superEffective: ["water", "ground", "rock"], notVeryEffective: ["fire", "grass", "poison", "flying", "bug", "dragon", "steel"] },
  ice: { superEffective: ["grass", "ground", "flying", "dragon"], notVeryEffective: ["fire", "water", "ice", "steel"] },
  fighting: { superEffective: ["normal", "ice", "rock", "dark", "steel"], notVeryEffective: ["poison", "flying", "psychic", "bug", "fairy", "ghost"] },
  poison: { superEffective: ["grass", "fairy"], notVeryEffective: ["poison", "ground", "rock", "ghost", "steel"] },
  ground: { superEffective: ["fire", "electric", "poison", "rock", "steel"], notVeryEffective: ["grass", "bug", "flying"] },
  flying: { superEffective: ["grass", "fighting", "bug"], notVeryEffective: ["electric", "rock", "steel"] },
  psychic: { superEffective: ["fighting", "poison"], notVeryEffective: ["psychic", "steel", "dark"] },
  bug: { superEffective: ["grass", "psychic", "dark"], notVeryEffective: ["fire", "fighting", "poison", "flying", "ghost", "steel", "fairy"] },
  rock: { superEffective: ["fire", "ice", "flying", "bug"], notVeryEffective: ["fighting", "ground", "steel"] },
  ghost: { superEffective: ["psychic", "ghost"], notVeryEffective: ["dark", "normal"] },
  dragon: { superEffective: ["dragon"], notVeryEffective: ["steel", "fairy"] },
  dark: { superEffective: ["psychic", "ghost"], notVeryEffective: ["fighting", "dark", "fairy"] },
  steel: { superEffective: ["ice", "rock", "fairy"], notVeryEffective: ["fire", "water", "electric", "steel"] },
  fairy: { superEffective: ["fighting", "dragon", "dark"], notVeryEffective: ["fire", "poison", "steel"] },
};

async function fetchJson(url: string): Promise<any> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  return res.json();
}

const round1 = (n: number) => Math.round(n * 10) / 10;

function transformMove(m: any) {
  const isCharged = (m.energy ?? 0) > 0;
  if (isCharged) {
    return {
      name: m.name,
      nameHu: m.name,
      type: m.type,
      category: "charged" as const,
      power: m.power ?? 0,
      energyCost: m.energy,
    };
  }
  return {
    name: m.name,
    nameHu: m.name,
    type: m.type,
    category: "fast" as const,
    power: m.power ?? 0,
    energyGain: m.energyGain ?? 0,
    turns: m.turns ?? Math.max(1, Math.round((m.cooldown ?? 500) / 500)),
  };
}

async function buildFromNetwork() {
  console.log("Fetching gamemaster…");
  const gm = await fetchJson(GM_URL);
  const gmById = new Map<string, any>();
  for (const p of gm.pokemon) gmById.set(p.speciesId, p);
  const moveById = new Map<string, any>();
  for (const m of gm.moves) moveById.set(m.moveId, m);

  const lookupGm = (speciesId: string) =>
    gmById.get(speciesId) ?? gmById.get(speciesId.replace(/_shadow$/, ""));

  const pokemonOut: Record<string, any> = {};
  const usedMoveIds = new Set<string>();

  for (const league of LEAGUE_ORDER) {
    console.log(`Fetching ${league} rankings…`);
    const ranks: any[] = await fetchJson(RANK_URLS[league]);
    for (const entry of ranks.slice(0, TOP_PER_LEAGUE)) {
      const id = entry.speciesId;
      if (pokemonOut[id]) {
        if (!pokemonOut[id].leagues.includes(league)) pokemonOut[id].leagues.push(league);
        continue;
      }
      const base = lookupGm(id);
      if (!base) continue;

      const types: string[] = (base.types || []).filter((t: string) => t && t !== "none");

      const fastSorted = [...(entry.moves?.fastMoves || [])].sort((a, b) => b.uses - a.uses);
      const maxFast = fastSorted[0]?.uses || 1;
      let fastMoves = fastSorted
        .filter((x) => x.uses >= 0.2 * maxFast)
        .slice(0, 2)
        .map((x) => x.moveId);
      if (fastMoves.length === 0) fastMoves = (base.fastMoves || []).slice(0, 1);

      const chargedSorted = [...(entry.moves?.chargedMoves || [])]
        .filter((x) => x.moveId && x.moveId !== "NONE")
        .sort((a, b) => b.uses - a.uses);
      const maxCharged = chargedSorted[0]?.uses || 1;
      let chargedMoves = chargedSorted
        .filter((x) => x.uses >= 0.03 * maxCharged)
        .slice(0, 4)
        .map((x) => x.moveId);
      if (chargedMoves.length === 0) chargedMoves = (base.chargedMoves || []).slice(0, 2);

      for (const mid of [...fastMoves, ...chargedMoves]) usedMoveIds.add(mid);

      pokemonOut[id] = {
        name: entry.speciesName,
        nameHu: entry.speciesName,
        types,
        stats: {
          atk: round1(entry.stats?.atk ?? 0),
          def: round1(entry.stats?.def ?? 0),
          hp: Math.round(entry.stats?.hp ?? 0),
        },
        fastMoves,
        chargedMoves,
        leagues: [league],
        sprite: base.dex,
      };
    }
  }

  const movesOut: Record<string, any> = {};
  for (const mid of [...usedMoveIds].sort()) {
    const m = moveById.get(mid);
    if (m) movesOut[mid] = transformMove(m);
  }

  return { pokemonOut, movesOut, count: Object.keys(pokemonOut).length };
}

async function writeAll(types: any, moves: any, pokemon: any) {
  await writeFile(join(DATA_DIR, "types.json"), JSON.stringify(types, null, 2) + "\n");
  await writeFile(join(DATA_DIR, "moves.json"), JSON.stringify(moves, null, 2) + "\n");
  await writeFile(join(DATA_DIR, "pokemon.json"), JSON.stringify(pokemon, null, 2) + "\n");
}

async function main() {
  try {
    const { pokemonOut, movesOut, count } = await buildFromNetwork();
    await writeAll(TYPE_CHART, movesOut, pokemonOut);
    console.log(`✓ Wrote ${count} pokemon, ${Object.keys(movesOut).length} moves from PvPoke.`);
  } catch (err) {
    console.warn("Network build failed, writing offline seed instead:", (err as Error).message);
    const { SEED_MOVES, SEED_POKEMON } = await import("./seed-data.ts");
    await writeAll(TYPE_CHART, SEED_MOVES, SEED_POKEMON);
    console.log(`✓ Wrote ${Object.keys(SEED_POKEMON).length} seed pokemon (offline).`);
  }
}

main();
