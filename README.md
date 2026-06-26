# PoGo PvP Helper

Gyors, kliens-oldali (backend és login nélküli) segéd a Pokémon GO **GO Battle
League** PvP-hez. Harc közben valós időben mutatja az ellenfél mozdulatait +
move countokat, ajánl a 3 pokémonod közül, és megmondja, hogy pajzsolj-e —
minimális gombnyomással.

Minden user-state a böngészőben él (`localStorage`), minden domain-adat JSON-ból
töltődik. **Új pokémon / mozdulat = csak adat, kód nem.**

## Futtatás

```bash
npm install
npm run dev        # fejlesztői szerver (Vite) → http://localhost:5173
npm run build      # produkciós build a dist/-be
npm run preview    # a buildelt verzió kiszolgálása
npm test           # unit tesztek (effectiveness + move count szimuláció)
```

Tech stack: **Vite + React + TypeScript + Tailwind CSS v4**. Nincs backend.

## Használat (3 fázis)

1. **Liga** — Great / Ultra / Master (bővíthető, lásd lent). `localStorage`-ba mentve.
2. **Csapat** — 3 pokémon + mozdulataik, ligánként külön. Ugyanazzal a
   billentyűs gyorskeresővel, mint a harci felület.
3. **Harc** — gépeld az ellenfél nevének elejét (`gro` → Groudon). Megjelenik a
   boardja a move countokkal; a 3 közül kiemelődik a típus szerint legjobb; az
   aktív monodra mozdulatonként pajzs-tanács.

Billentyűk a harcban: **betűk** = keresés, **1-9 / nyilak** = választás,
**Enter** = fixálás, **Backspace** = törlés, **Esc** = buffer reset / ellenfél
elvetése. Mobilra a 🔍 gombbal van érintős picker.

## Adat

Három JSON a `src/data/` alatt:

| fájl           | tartalom |
|----------------|----------|
| `types.json`   | GO típushatékonysági tábla (`superEffective` / `notVeryEffective` listák típusonként) |
| `moves.json`   | minden mozdulat (`type`, `category`, `power`, `energyGain`+`turns` vagy `energyCost`) |
| `pokemon.json` | meta-releváns pokémonok (`types`, `stats`, `fastMoves`, `chargedMoves`, `leagues`, `sprite`) |

### Az adat frissítése / bővítése

```bash
npm run build-data
```

Ez a `scripts/build-data.ts`:

1. lehúzza a [PvPoke](https://github.com/pvpoke/pvpoke) `gamemaster.json`-t,
2. lehúzza a liga-rankingeket (great / ultra / master),
3. ligánként a top `TOP_PER_LEAGUE` (alapból 70) pokémonra szűrve generálja a
   `moves.json` + `pokemon.json` fájlokat (a `chargedMoves` használat szerint
   rendezve — a leggyakoribb legelöl), és kiírja a kanonikus `types.json`-t.

Ha a fetch nem megy, a `scripts/seed-data.ts` offline seedjével ír egy kisebb
Master League készletet, hogy az app demózható maradjon.

Kézi bővítés is mehet: vegyél fel egy mozdulatot a `moves.json`-be és/vagy egy
pokémont a `pokemon.json`-be — a komponensek semmit sem hardcode-olnak.

**Új liga / formátum** felvétele: a `League` típus és a `LEAGUES` lista a
[`src/types.ts`](src/types.ts)-ben él, az UI ebből generálódik. Új formátumhoz
egészítsd ki ezeket + a `pokemon.json` `leagues` mezőit (és a build script
`RANK_URLS`-jét, ha onnan jön az adat).

## Számítások (a lényeg)

- **Típushatékonyság** — [`src/lib/effectiveness.ts`](src/lib/effectiveness.ts).
  GO szorzók: SE ×1.6, neutral ×1.0, NVE ×0.625, dupla-rezisztencia ×0.390625
  (GO-ban nincs immunitás).
- **Move count** — [`src/lib/moveCounts.ts`](src/lib/moveCounts.ts). A
  `14---`, `8-*-`, `7*-*` mintázatok **szimulációból** jönnek (energia-átvitel +
  100-as cap), nem kézzel tárolva. A jelek mindig az **első** counthoz
  viszonyítanak (`-` = alap−1, `*` = alap, szám = literál).
- **Ajánlás** — [`src/lib/recommend.ts`](src/lib/recommend.ts).
  `offenzív − defenzív`, mindkettő típus-alapú.
- **Pajzs-tanács** — [`src/lib/shield.ts`](src/lib/shield.ts).

A move count és a típushatékonyság unit-tesztelve van
([`*.test.ts`](src/lib/)) — pont a fenti referencia-mintázatokra.

## v2 — valódi damage formula

A v1 tanácsadás **típus-alapú**. Az adat viszont kész a pontos GO képletre:
`moves.json`-ben ott a `power`, `pokemon.json`-ben az `atk/def/hp`.

A beillesztési pont a [`getShieldAdvice(myMon, oppMove)`](src/lib/shield.ts)
függvény belseje — a szignatúrát ne bántsd, csak a törzset cseréld:

```
dmg = floor(0.5 * power * (Atk / Def) * STAB * effectiveness) + 1
```

majd a tanács lehet „ez a HP-d X%-át viszi" alapú. Ugyanígy a
[`recommend.ts`](src/lib/recommend.ts) pontszáma is felokosítható tényleges
damage-re.

> Megjegyzés: a `pokemon.json` `stats` mezője ligánként egy értéket tárol (az
> első liga, ahol a mon szerepel). v2-höz érdemes lehet liga szerinti effektív
> statokat tárolni. A `sprite` a nemzeti pokédex-szám (PokeAPI CDN); a formák
> (origin/shadow) az alapfaj sprite-ját használják.
