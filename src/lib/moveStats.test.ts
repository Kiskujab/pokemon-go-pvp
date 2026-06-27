import { describe, expect, it } from "vitest";
import type { Move } from "../types";
import { dpe, dpt, ept } from "./moveStats";

const charged = (power: number, energyCost: number): Move => ({
  name: "C",
  nameHu: "C",
  type: "water",
  category: "charged",
  power,
  energyCost,
});

const fast = (power: number, energyGain: number, turns: number): Move => ({
  name: "F",
  nameHu: "F",
  type: "water",
  category: "fast",
  power,
  energyGain,
  turns,
});

describe("dpe", () => {
  it("is power / energyCost", () => {
    expect(dpe(charged(90, 60))).toBeCloseTo(1.5);
  });
  it("guards against zero/missing energy cost", () => {
    expect(dpe(charged(90, 0))).toBe(0);
  });
});

describe("dpt", () => {
  it("is power / turns", () => {
    expect(dpt(fast(8, 10, 2))).toBe(4);
  });
  it("guards against zero turns", () => {
    expect(dpt(fast(8, 10, 0))).toBe(0);
  });
});

describe("ept", () => {
  it("is energyGain / turns", () => {
    expect(ept(fast(8, 10, 2))).toBe(5);
  });
  it("guards against zero turns", () => {
    expect(ept(fast(8, 10, 0))).toBe(0);
  });
});
