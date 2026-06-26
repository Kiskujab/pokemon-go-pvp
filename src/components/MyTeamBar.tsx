import type { TeamMember } from "../types";
import { getPokemon } from "../lib/data";
import Sprite from "./Sprite";
import TypePills from "./TypePills";

interface Props {
  team: TeamMember[];
  activeIndex: number;
  /** Type-best pick vs the current opponent, or -1 when none. */
  recommendedIndex: number;
  onSelect: (index: number) => void;
}

/** Bottom bar: my 3 pokemon. Tap to set the active one; the type-recommended
 *  pick against the current opponent gets a green call-out. */
export default function MyTeamBar({
  team,
  activeIndex,
  recommendedIndex,
  onSelect,
}: Props) {
  return (
    <div className="grid grid-cols-3 gap-2">
      {team.map((member, i) => {
        const mon = getPokemon(member.id);
        if (!mon) return <div key={i} />;
        const active = i === activeIndex;
        const recommended = i === recommendedIndex;
        return (
          <button
            key={`${member.id}-${i}`}
            type="button"
            onClick={() => onSelect(i)}
            className={`relative flex flex-col items-center gap-1 rounded-xl border bg-[#1a1a1a] p-2 transition ${
              active
                ? "border-sky-400 ring-2 ring-sky-400/60"
                : "border-white/10 hover:border-white/30"
            }`}
          >
            {recommended && (
              <span className="absolute -top-2 left-1/2 -translate-x-1/2 rounded-full bg-emerald-500 px-2 py-0.5 text-[10px] font-bold uppercase text-black shadow">
                ✓ ajánlott
              </span>
            )}
            <Sprite
              dex={mon.sprite}
              name={mon.name}
              className={`h-14 w-14 object-contain ${
                recommended ? "drop-shadow-[0_0_8px_rgba(16,185,129,0.7)]" : ""
              }`}
            />
            <span className="line-clamp-1 text-center text-xs font-semibold">
              {mon.name}
            </span>
            <TypePills types={mon.types} size="xs" />
          </button>
        );
      })}
    </div>
  );
}
