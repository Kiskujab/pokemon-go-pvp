import { useState } from "react";
import { spriteUrl, spriteFallbackUrl } from "../lib/sprites";

interface Props {
  dex: number;
  name: string;
  className?: string;
}

/** Pokemon sprite with a graceful fallback when the home render is missing. */
export default function Sprite({ dex, name, className }: Props) {
  const [stage, setStage] = useState<0 | 1 | 2>(0);
  if (stage === 2) {
    // both URLs failed — show a neutral placeholder
    return (
      <div
        className={`flex items-center justify-center bg-white/5 text-white/30 ${className ?? ""}`}
        aria-label={name}
      >
        ?
      </div>
    );
  }
  const src = stage === 0 ? spriteUrl(dex) : spriteFallbackUrl(dex);
  return (
    <img
      src={src}
      alt={name}
      loading="lazy"
      draggable={false}
      className={className}
      onError={() => setStage((s) => (s + 1) as 0 | 1 | 2)}
    />
  );
}
