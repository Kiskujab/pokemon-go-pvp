import type { PokemonType } from "../types";
import { useT } from "../i18n";
import { typeColor, textOn } from "../lib/typeColors";

interface Props {
  type: PokemonType;
  /** Optional trailing multiplier badge, e.g. ×1.6. */
  mult?: number;
}

const fmt = (n: number) => `×${n.toFixed(2).replace(/\.?0+$/, "")}`;

/** A single localized, type-coloured chip used in matchup lists. */
export default function TypeChip({ type, mult }: Props) {
  const { typeName } = useT();
  const bg = typeColor(type);
  return (
    <span
      className="inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-semibold"
      style={{ background: bg, color: textOn(bg) }}
    >
      {typeName(type)}
      {mult !== undefined && (
        <span className="font-mono opacity-80">{fmt(mult)}</span>
      )}
    </span>
  );
}
