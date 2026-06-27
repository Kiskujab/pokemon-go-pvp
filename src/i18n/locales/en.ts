// English — the base dictionary. Every other locale is a Partial<typeof en>
// merged over this, so a missing key anywhere falls back to English.
const en = {
  // --- generic ---
  "app.title": "PoGo PvP Helper",
  "app.tagline": "Battle smarter, not harder",
  "common.back": "Back",
  "common.delete": "Remove",
  "common.loading": "Loading…",
  "common.menu": "Menu",
  "common.close": "Close",

  // --- loading screen ---
  "loading.subtitle": "Spinning up the meta…",

  // --- main menu ---
  "menu.choose": "What do you want to do?",
  "menu.pvp.title": "PvP Helper",
  "menu.pvp.desc":
    "Live battle assistant — opponent moves & counts, shield calls and the best switch.",
  "menu.analysis.title": "Meta & Team Builder",
  "menu.analysis.desc":
    "Explore the meta, scout matchups and build a team with type coverage.",
  "menu.language": "Language",

  // --- leagues ---
  "league.choose": "Choose a league to start",
  "league.great": "Great League",
  "league.ultra": "Ultra League",
  "league.master": "Master League",
  "league.cp.great": "CP 1500",
  "league.cp.ultra": "CP 2500",
  "league.cp.master": "No cap",

  // --- shared search ---
  "search.hint": "type a name…",
  "search.results": "{n} matches · Enter / 1-9",
  "search.noResults": "No match for “{q}”.",
  "search.count": "{n} matches",

  // --- team setup ---
  "team.toLeague": "League",
  "team.title": "Team",
  "team.fastMove": "Fast move",
  "team.chargedMoves": "Charged moves (max 2)",
  "team.add": "Add a pokémon ({n}/3)",
  "team.toBattle": "To battle →",
  "team.needMore": "{n} more pokémon needed",
  "team.edit": "Edit team",

  // --- battle ---
  "battle.changeLeague": "{league} ▾",
  "battle.oppName": "opponent name…",
  "battle.browse": "🔍 browse",
  "battle.empty.title": "Type the start of the opponent's name",
  "battle.empty.hint": "e.g. {ex} → {mon} · or browse with 🔍",
  "battle.recommended": "✓ best",

  // --- shield advice ---
  "shield.shield": "Shield!",
  "shield.consider": "Maybe",
  "shield.no": "Don't shield",
  "shield.vs": "vs",
  "shield.mostDangerous": "most dangerous: {move}",

  // --- analysis ---
  "analysis.title": "Meta & Team Builder",
  "analysis.tab.explorer": "Meta explorer",
  "analysis.tab.builder": "Team builder",
  "analysis.search.hint": "search the meta…",
  "analysis.pick": "Pick a pokémon to analyze its matchups.",
  "analysis.weakTo": "Weak to",
  "analysis.resists": "Resists",
  "analysis.strongVs": "Strong against",
  "analysis.movepool": "Movepool",
  "analysis.moveStats": "Move efficiency",
  "analysis.fast": "Fast",
  "analysis.charged": "Charged",
  "analysis.counters": "Top counters in this meta",
  "analysis.none": "—",
  "analysis.builder.title": "Your team",
  "analysis.builder.add": "Add",
  "analysis.builder.added": "In team",
  "analysis.builder.full": "Team full",
  "analysis.builder.empty": "Add up to 3 pokémon to analyze your team's coverage.",
  "analysis.builder.coverage": "Offensive coverage",
  "analysis.builder.coverageHint": "Types your team hits super-effectively",
  "analysis.builder.holes": "Shared weaknesses",
  "analysis.builder.holesHint": "Types that hit 2+ of your team hard",
  "analysis.builder.noHoles": "No shared weaknesses — nicely balanced!",
  "analysis.builder.suggest": "Suggested 3rd pick",
  "analysis.builder.suggestHint": "Fills your team's gaps and weaknesses",

  // --- type names ---
  "type.normal": "Normal",
  "type.fire": "Fire",
  "type.water": "Water",
  "type.electric": "Electric",
  "type.grass": "Grass",
  "type.ice": "Ice",
  "type.fighting": "Fighting",
  "type.poison": "Poison",
  "type.ground": "Ground",
  "type.flying": "Flying",
  "type.psychic": "Psychic",
  "type.bug": "Bug",
  "type.rock": "Rock",
  "type.ghost": "Ghost",
  "type.dragon": "Dragon",
  "type.dark": "Dark",
  "type.steel": "Steel",
  "type.fairy": "Fairy",
};

export default en;
export type Dict = typeof en;
export type DictKey = keyof Dict;
