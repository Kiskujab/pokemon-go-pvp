/**
 * Offline seed — used by build-data.ts only when the PvPoke fetch fails, so the
 * app still builds and demos with a handful of Master League staples. The live
 * fetch produces a far richer pool; this is just a safety net.
 */

export const SEED_MOVES: Record<string, any> = {
  // fast moves
  DRAGON_BREATH: { name: "Dragon Breath", nameHu: "Dragon Breath", type: "dragon", category: "fast", power: 4, energyGain: 4, turns: 1 },
  MUD_SHOT: { name: "Mud Shot", nameHu: "Mud Shot", type: "ground", category: "fast", power: 3, energyGain: 9, turns: 1 },
  DRAGON_TAIL: { name: "Dragon Tail", nameHu: "Dragon Tail", type: "dragon", category: "fast", power: 9, energyGain: 12, turns: 3 },
  WATERFALL: { name: "Waterfall", nameHu: "Waterfall", type: "water", category: "fast", power: 16, energyGain: 8, turns: 2 },
  SHADOW_CLAW: { name: "Shadow Claw", nameHu: "Shadow Claw", type: "ghost", category: "fast", power: 6, energyGain: 8, turns: 2 },
  PSYCHO_CUT: { name: "Psycho Cut", nameHu: "Psycho Cut", type: "psychic", category: "fast", power: 3, energyGain: 9, turns: 1 },
  BULLET_PUNCH: { name: "Bullet Punch", nameHu: "Bullet Punch", type: "steel", category: "fast", power: 5, energyGain: 6, turns: 2 },
  CHARM: { name: "Charm", nameHu: "Charm", type: "fairy", category: "fast", power: 16, energyGain: 6, turns: 3 },

  // charged moves
  IRON_HEAD: { name: "Iron Head", nameHu: "Iron Head", type: "steel", category: "charged", power: 70, energyCost: 50 },
  THUNDER: { name: "Thunder", nameHu: "Thunder", type: "electric", category: "charged", power: 100, energyCost: 60 },
  DRACO_METEOR: { name: "Draco Meteor", nameHu: "Draco Meteor", type: "dragon", category: "charged", power: 150, energyCost: 65 },
  PRECIPICE_BLADES: { name: "Precipice Blades", nameHu: "Precipice Blades", type: "ground", category: "charged", power: 130, energyCost: 60 },
  FIRE_PUNCH: { name: "Fire Punch", nameHu: "Fire Punch", type: "fire", category: "charged", power: 55, energyCost: 40 },
  EARTHQUAKE: { name: "Earthquake", nameHu: "Earthquake", type: "ground", category: "charged", power: 120, energyCost: 65 },
  SURF: { name: "Surf", nameHu: "Surf", type: "water", category: "charged", power: 65, energyCost: 40 },
  BLIZZARD: { name: "Blizzard", nameHu: "Blizzard", type: "ice", category: "charged", power: 140, energyCost: 75 },
  ORIGIN_PULSE: { name: "Origin Pulse", nameHu: "Origin Pulse", type: "water", category: "charged", power: 130, energyCost: 60 },
  SHADOW_BALL: { name: "Shadow Ball", nameHu: "Shadow Ball", type: "ghost", category: "charged", power: 100, energyCost: 55 },
  DRAGON_CLAW: { name: "Dragon Claw", nameHu: "Dragon Claw", type: "dragon", category: "charged", power: 50, energyCost: 35 },
  PSYSTRIKE: { name: "Psystrike", nameHu: "Psystrike", type: "psychic", category: "charged", power: 90, energyCost: 45 },
  FOCUS_BLAST: { name: "Focus Blast", nameHu: "Focus Blast", type: "fighting", category: "charged", power: 150, energyCost: 75 },
  HURRICANE: { name: "Hurricane", nameHu: "Hurricane", type: "flying", category: "charged", power: 110, energyCost: 65 },
  METEOR_MASH: { name: "Meteor Mash", nameHu: "Meteor Mash", type: "steel", category: "charged", power: 100, energyCost: 50 },
  PSYCHIC: { name: "Psychic", nameHu: "Psychic", type: "psychic", category: "charged", power: 90, energyCost: 55 },
  FLAMETHROWER: { name: "Flamethrower", nameHu: "Flamethrower", type: "fire", category: "charged", power: 90, energyCost: 55 },
  ANCIENT_POWER: { name: "Ancient Power", nameHu: "Ancient Power", type: "rock", category: "charged", power: 70, energyCost: 45 },
  AERIAL_ACE: { name: "Aerial Ace", nameHu: "Aerial Ace", type: "flying", category: "charged", power: 55, energyCost: 45 },
};

export const SEED_POKEMON: Record<string, any> = {
  dialga: { name: "Dialga", nameHu: "Dialga", types: ["steel", "dragon"], stats: { atk: 209.6, def: 174.4, hp: 167 }, fastMoves: ["DRAGON_BREATH"], chargedMoves: ["IRON_HEAD", "THUNDER", "DRACO_METEOR"], leagues: ["master"], sprite: 483 },
  groudon: { name: "Groudon", nameHu: "Groudon", types: ["ground"], stats: { atk: 239.4, def: 204.1, hp: 184 }, fastMoves: ["MUD_SHOT", "DRAGON_TAIL"], chargedMoves: ["PRECIPICE_BLADES", "FIRE_PUNCH", "EARTHQUAKE"], leagues: ["master"], sprite: 383 },
  kyogre: { name: "Kyogre", nameHu: "Kyogre", types: ["water"], stats: { atk: 235.6, def: 187.6, hp: 188 }, fastMoves: ["WATERFALL"], chargedMoves: ["SURF", "BLIZZARD", "ORIGIN_PULSE"], leagues: ["master"], sprite: 382 },
  giratina_origin: { name: "Giratina (Origin)", nameHu: "Giratina (Origin)", types: ["ghost", "dragon"], stats: { atk: 187.4, def: 196.1, hp: 205 }, fastMoves: ["SHADOW_CLAW"], chargedMoves: ["SHADOW_BALL", "DRAGON_CLAW"], leagues: ["master"], sprite: 487 },
  mewtwo: { name: "Mewtwo", nameHu: "Mewtwo", types: ["psychic"], stats: { atk: 248.1, def: 161.6, hp: 180 }, fastMoves: ["PSYCHO_CUT"], chargedMoves: ["PSYSTRIKE", "SHADOW_BALL", "FOCUS_BLAST"], leagues: ["master"], sprite: 150 },
  dragonite: { name: "Dragonite", nameHu: "Dragonite", types: ["dragon", "flying"], stats: { atk: 209.4, def: 168.1, hp: 175 }, fastMoves: ["DRAGON_BREATH"], chargedMoves: ["DRAGON_CLAW", "HURRICANE"], leagues: ["master"], sprite: 149 },
  metagross: { name: "Metagross", nameHu: "Metagross", types: ["steel", "psychic"], stats: { atk: 220.5, def: 198.6, hp: 165 }, fastMoves: ["BULLET_PUNCH"], chargedMoves: ["METEOR_MASH", "EARTHQUAKE", "PSYCHIC"], leagues: ["master"], sprite: 376 },
  togekiss: { name: "Togekiss", nameHu: "Togekiss", types: ["fairy", "flying"], stats: { atk: 186.6, def: 181.4, hp: 190 }, fastMoves: ["CHARM"], chargedMoves: ["FLAMETHROWER", "ANCIENT_POWER", "AERIAL_ACE"], leagues: ["master"], sprite: 468 },
};
