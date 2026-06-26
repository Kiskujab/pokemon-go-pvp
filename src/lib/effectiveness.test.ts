import { describe, it, expect } from "vitest";
import {
  effectiveness,
  bestEffectiveness,
  effectivenessTier,
} from "./effectiveness";

describe("effectiveness (GO multipliers)", () => {
  it("super effective → 1.6", () => {
    expect(effectiveness("dragon", ["dragon"])).toBeCloseTo(1.6);
    expect(effectiveness("water", ["fire"])).toBeCloseTo(1.6);
  });
  it("neutral → 1.0", () => {
    expect(effectiveness("normal", ["normal"])).toBeCloseTo(1.0);
    expect(effectiveness("water", ["normal"])).toBeCloseTo(1.0);
  });
  it("not very effective → 0.625", () => {
    expect(effectiveness("dragon", ["steel"])).toBeCloseTo(0.625);
  });
  it("former immunities are just NVE (no immunity in GO)", () => {
    expect(effectiveness("electric", ["ground"])).toBeCloseTo(0.625);
    expect(effectiveness("normal", ["ghost"])).toBeCloseTo(0.625);
  });
  it("double resist → 0.625² = 0.390625", () => {
    expect(effectiveness("dragon", ["steel", "fairy"])).toBeCloseTo(0.390625);
  });
  it("double weak → 1.6² = 2.56", () => {
    expect(effectiveness("fairy", ["dragon", "fighting"])).toBeCloseTo(2.56);
  });
  it("mixed SE + NVE cancels toward neutral", () => {
    // ground SE vs steel (×1.6), but the other type flying resists (×0.625)
    expect(effectiveness("ground", ["steel", "flying"])).toBeCloseTo(1.0);
  });
});

describe("bestEffectiveness", () => {
  it("picks the strongest attacking type", () => {
    expect(bestEffectiveness(["water", "grass"], ["fire"])).toBeCloseTo(1.6);
    expect(bestEffectiveness(["normal", "fighting"], ["steel"])).toBeCloseTo(1.6);
  });
});

describe("effectivenessTier", () => {
  it("classifies multipliers", () => {
    expect(effectivenessTier(1.6)).toBe("super");
    expect(effectivenessTier(1.0)).toBe("neutral");
    expect(effectivenessTier(0.625)).toBe("resist");
    expect(effectivenessTier(0.390625)).toBe("double-resist");
  });
});
