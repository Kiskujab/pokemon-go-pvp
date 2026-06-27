import type { PokemonType } from "../types";

/** A Pokémon GO in-game weather condition. */
export type Weather =
  | "sunny"
  | "rain"
  | "partlyCloudy"
  | "cloudy"
  | "windy"
  | "snow"
  | "fog";

/** Each weather, its icon, and the attack types it boosts (covers all 18). */
export const WEATHER: { id: Weather; icon: string; boosts: PokemonType[] }[] = [
  { id: "sunny", icon: "☀️", boosts: ["grass", "fire", "ground"] },
  { id: "rain", icon: "🌧️", boosts: ["water", "electric", "bug"] },
  { id: "partlyCloudy", icon: "⛅", boosts: ["normal", "rock"] },
  { id: "cloudy", icon: "☁️", boosts: ["fairy", "fighting", "poison"] },
  { id: "windy", icon: "🌬️", boosts: ["dragon", "flying", "psychic"] },
  { id: "snow", icon: "❄️", boosts: ["ice", "steel"] },
  { id: "fog", icon: "🌫️", boosts: ["dark", "ghost"] },
];
