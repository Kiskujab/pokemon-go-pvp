import { describe, it, expect } from "vitest";
import { chargeCounts, chargeCountDisplay, relativeMarks } from "./moveCounts";

const fast = (energyGain: number) => ({ energyGain });
const charged = (energyCost: number) => ({ energyCost });

describe("chargeCounts", () => {
  it("all-equal pattern → [15,15,15,15]", () => {
    expect(chargeCounts(fast(1), charged(15))).toEqual([15, 15, 15, 15]);
  });
  it("X--- pattern → [14,13,13,13]", () => {
    expect(chargeCounts(fast(4), charged(53))).toEqual([14, 13, 13, 13]);
  });
  it("alternating -*- pattern → [8,7,8,7]", () => {
    expect(chargeCounts(fast(2), charged(15))).toEqual([8, 7, 8, 7]);
  });
  it("*-* pattern → [7,7,6,7]", () => {
    expect(chargeCounts(fast(3), charged(20))).toEqual([7, 7, 6, 7]);
  });
  it("Dragon Breath + Iron Head → [13,12,13,12]", () => {
    expect(chargeCounts(fast(4), charged(50))).toEqual([13, 12, 13, 12]);
  });
  it("Dragon Breath + Draco Meteor → [17,16,16,16]", () => {
    expect(chargeCounts(fast(4), charged(65))).toEqual([17, 16, 16, 16]);
  });
  it("returns zeros for invalid (no energy gain)", () => {
    expect(chargeCounts(fast(0), charged(50))).toEqual([0, 0, 0, 0]);
  });
});

describe("relativeMarks", () => {
  it("marks vs the FIRST count, not the previous", () => {
    expect(relativeMarks([8, 7, 8, 7])).toEqual(["-", "*", "-"]);
    expect(relativeMarks([14, 13, 13, 13])).toEqual(["-", "-", "-"]);
    expect(relativeMarks([7, 7, 6, 7])).toEqual(["*", "-", "*"]);
  });
  it("uses a literal number when the delta is not 0 or -1", () => {
    expect(relativeMarks([10, 8, 10, 10])).toEqual(["8", "*", "*"]);
  });
});

describe("chargeCountDisplay", () => {
  it("produces the reference labels", () => {
    expect(chargeCountDisplay(fast(1), charged(15)).label).toBe("15");
    expect(chargeCountDisplay(fast(4), charged(53)).label).toBe("14---");
    expect(chargeCountDisplay(fast(2), charged(15)).label).toBe("8-*-");
    expect(chargeCountDisplay(fast(3), charged(20)).label).toBe("7*-*");
    expect(chargeCountDisplay(fast(4), charged(65)).label).toBe("17---");
  });
  it("drops the marks when all four throws are equal", () => {
    const d = chargeCountDisplay(fast(1), charged(15));
    expect(d.base).toBe(15);
    expect(d.marks).toBe("");
  });
});
