import { describe, expect, it } from "vitest";
import type { Move, Pokemon } from "../types";
import { rotationDps } from "./raid";

const mon = (types: Pokemon["types"], atk: number, def: number): Pokemon => ({
  name: "M",
  nameHu: "M",
  types,
  stats: { atk, def, hp: 100 },
  fastMoves: [],
  chargedMoves: [],
  leagues: ["master"],
  sprite: 1,
});

const fast = (
  type: Move["type"],
  power: number,
  energyGain: number,
  turns: number
): Move => ({
  name: "F",
  nameHu: "F",
  type,
  category: "fast",
  power,
  energyGain,
  turns,
});

const charged = (type: Move["type"], power: number, energyCost: number): Move => ({
  name: "C",
  nameHu: "C",
  type,
  category: "charged",
  power,
  energyCost,
});

describe("rotationDps", () => {
  it("computes total damage over total rotation time", () => {
    const attacker = mon(["water"], 100, 100);
    const boss = mon(["fire"], 100, 100); // water SE on fire
    const f = fast("water", 10, 25, 2); // dmg, +25e, 1.0s
    const c = charged("water", 50, 50); // costs 50e → 2 fast moves to charge
    // fastDmg = 10·1·1.2·1.6·0.5·1.3 +1 ... use the engine: ratio 1, STAB 1.2, eff 1.6
    // fastDmg: floor(10·1.2·1.6·0.5·1.3)+1 = floor(12.48)+1 = 13
    // chargedDmg: floor(50·1.2·1.6·0.5·1.3)+1 = floor(62.4)+1 = 63
    // fastPerCharge = ceil(50/25) = 2; rotDmg = 2·13 + 63 = 89
    // rotTime = 2·1.0 + 0.5 = 2.5; dps = 35.6
    expect(rotationDps(f, c, attacker, boss)).toBeCloseTo(89 / 2.5, 5);
  });

  it("rewards super-effective typing over neutral", () => {
    const water = mon(["water"], 100, 100);
    const normal = mon(["normal"], 100, 100);
    const boss = mon(["fire"], 100, 100);
    const f = fast("water", 10, 25, 2);
    const c = charged("water", 50, 50);
    const fN = fast("normal", 10, 25, 2);
    const cN = charged("normal", 50, 50);
    expect(rotationDps(f, c, water, boss)).toBeGreaterThan(
      rotationDps(fN, cN, normal, boss)
    );
  });

  it("returns 0 for an unusable moveset", () => {
    const attacker = mon(["water"], 100, 100);
    const boss = mon(["fire"], 100, 100);
    expect(rotationDps(fast("water", 10, 0, 2), charged("water", 50, 50), attacker, boss)).toBe(0);
    expect(rotationDps(fast("water", 10, 25, 2), charged("water", 50, 0), attacker, boss)).toBe(0);
  });
});
