import type { Move } from "../types";

export const ENERGY_CAP = 100;

/**
 * How many fast moves a single throw of `chargedMove` needs to "double-spam".
 *
 * Energy carries over after a charged move fires, and energy is capped at 100,
 * so the count for the 2nd/3rd/4th consecutive throw can differ from the 1st.
 * We simulate it rather than store it — this reproduces patterns like
 * [14,13,13,13] or [8,7,8,7] exactly.
 */
export function chargeCounts(
  fastMove: Pick<Move, "energyGain">,
  chargedMove: Pick<Move, "energyCost">,
  n = 4
): number[] {
  const gain = fastMove.energyGain ?? 0;
  const cost = chargedMove.energyCost ?? 0;
  const counts: number[] = [];
  if (gain <= 0 || cost <= 0) return new Array(n).fill(0);

  let energy = 0;
  for (let i = 0; i < n; i++) {
    let fast = 0;
    while (energy < cost) {
      energy = Math.min(ENERGY_CAP, energy + gain);
      fast++;
    }
    counts.push(fast);
    energy -= cost; // leftover energy carries to the next cycle
  }
  return counts;
}

/**
 * The relative-notation pieces for the 2nd..nth throws, compared to the FIRST
 * count (not the previous one), matching the reference infographic:
 *   "-" → base − 1
 *   "*" → same as base
 *   "12" → that literal value (any other delta)
 */
export function relativeMarks(counts: number[]): string[] {
  if (counts.length === 0) return [];
  const base = counts[0];
  return counts.slice(1).map((c) => {
    if (c === base) return "*";
    if (c === base - 1) return "-";
    return String(c);
  });
}

export interface ChargeCountDisplay {
  /** Raw counts, e.g. [8,7,8,7]. */
  counts: number[];
  /** The first/base count shown large, e.g. 8. */
  base: number;
  /** Relative marks for throws 2..n, e.g. "-*-". Empty when all equal. */
  marks: string;
  /** Full label, e.g. "8-*-" or just "15" when every throw is equal. */
  label: string;
}

export function chargeCountDisplay(
  fastMove: Pick<Move, "energyGain">,
  chargedMove: Pick<Move, "energyCost">,
  n = 4
): ChargeCountDisplay {
  const counts = chargeCounts(fastMove, chargedMove, n);
  const base = counts[0] ?? 0;
  const markArr = relativeMarks(counts);
  const allEqual = markArr.every((m) => m === "*");
  const marks = allEqual ? "" : markArr.join("");
  return {
    counts,
    base,
    marks,
    label: marks ? `${base}${marks}` : String(base),
  };
}
