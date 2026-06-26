// PokeAPI open sprite CDN. `dex` is the national dex number stored on each
// pokemon. Home sprites are clean and reasonably sized; fall back to the
// low-res default if a dex has no home render.
const ROOT =
  "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon";

export function spriteUrl(dex: number): string {
  return `${ROOT}/other/home/${dex}.png`;
}

export function spriteFallbackUrl(dex: number): string {
  return `${ROOT}/${dex}.png`;
}
