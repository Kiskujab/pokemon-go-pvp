import type { PokemonType } from "../types";
import { typeColor, textOn } from "../lib/typeColors";

interface Props {
  types: PokemonType[];
  size?: "sm" | "xs";
}

export default function TypePills({ types, size = "sm" }: Props) {
  const pad = size === "xs" ? "px-1.5 py-0 text-[10px]" : "px-2 py-0.5 text-xs";
  return (
    <span className="flex gap-1">
      {types.map((t) => (
        <span
          key={t}
          className={`rounded font-semibold uppercase tracking-wide ${pad}`}
          style={{ background: typeColor(t), color: textOn(typeColor(t)) }}
        >
          {t}
        </span>
      ))}
    </span>
  );
}
