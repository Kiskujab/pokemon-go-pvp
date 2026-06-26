import type { PokemonType } from "../types";
import { useT } from "../i18n";
import { typeColor, textOn } from "../lib/typeColors";

interface Props {
  types: PokemonType[];
  size?: "sm" | "xs";
}

export default function TypePills({ types, size = "sm" }: Props) {
  const { typeName } = useT();
  const pad = size === "xs" ? "px-1.5 py-0 text-[10px]" : "px-2 py-0.5 text-xs";
  return (
    <span className="flex gap-1">
      {types.map((ty) => (
        <span
          key={ty}
          className={`rounded font-semibold uppercase tracking-wide ${pad}`}
          style={{ background: typeColor(ty), color: textOn(typeColor(ty)) }}
        >
          {typeName(ty)}
        </span>
      ))}
    </span>
  );
}
