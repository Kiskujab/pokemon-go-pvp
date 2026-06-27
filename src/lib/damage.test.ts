import { describe, expect, it } from "vitest";
import type { Move, Pokemon } from "../types";
import { damage, damagePercent, effectiveHp } from "./damage";

const mon = (
  types: Pokemon["types"],
  atk: number,
  def: number,
  hp: number
): Pokemon => ({
  name: "Test",
  nameHu: "Teszt",
  types,
  stats: { atk, def, hp },
  fastMoves: [],
  chargedMoves: [],
  leagues: ["great"],
  sprite: 1,
});

const move = (
  type: Move["type"],
  power: number,
  extra: Partial<Move> = {}
): Move => ({
  name: "M",
  nameHu: "M",
  type,
  category: "charged",
  power,
  ...extra,
});

describe("damage", () => {
  it("applies STAB and super-effectiveness to the GO PvP formula", () => {
    // power 50, atk=def=100 → ratio 1, STAB 1.2 (water mon, water move),
    // water vs fire = 1.6 SE. raw = 50·1·1.2·1.6·0.5·1.3 = 62.4 → floor+1 = 63
    const atk = mon(["water"], 100, 100, 100);
    const def = mon(["fire"], 100, 100, 100);
    expect(damage(move("water", 50), atk, def)).toBe(63);
  });

  it("omits STAB when the move type is off-type", () => {
    // no STAB: raw = 50·1·1.6·0.5·1.3 = 52 → floor+1 = 53
    const atk = mon(["normal"], 100, 100, 100);
    const def = mon(["fire"], 100, 100, 100);
    expect(damage(move("water", 50), atk, def)).toBe(53);
  });

  it("scales with the attacker-Atk / defender-Def ratio", () => {
    // off-type (no STAB), neutral matchup, atk 200 / def 100 → ratio 2.
    // raw = 50·2·1·1·0.5·1.3 = 65 → floor+1 = 66
    const atk = mon(["water"], 200, 100, 100);
    const def = mon(["normal"], 100, 100, 100);
    expect(damage(move("normal", 50), atk, def)).toBe(66);
  });

  it("returns 0 for a zero-power move", () => {
    const atk = mon(["water"], 100, 100, 100);
    const def = mon(["fire"], 100, 100, 100);
    expect(damage(move("water", 0), atk, def)).toBe(0);
  });
});

describe("effectiveHp", () => {
  it("scales base HP by the league CPM", () => {
    expect(effectiveHp(mon(["water"], 100, 100, 100), "great")).toBe(66);
    expect(effectiveHp(mon(["water"], 100, 100, 200), "master")).toBe(169);
  });
});

describe("damagePercent", () => {
  it("is damage divided by the defender's effective HP", () => {
    const atk = mon(["water"], 100, 100, 100);
    const def = mon(["fire"], 100, 100, 100);
    // damage 63, effHp(fire mon) great = floor(66.7) = 66
    expect(damagePercent(move("water", 50), atk, def, "great")).toBeCloseTo(
      63 / 66,
      5
    );
  });
});
