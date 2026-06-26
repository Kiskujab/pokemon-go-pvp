import type { League, TeamMember } from "../types";

// Thin, fail-safe localStorage wrapper. All user state lives here — no backend.

const PREFIX = "pogo-pvp.";

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(PREFIX + key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write<T>(key: string, value: T): void {
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify(value));
  } catch {
    /* private mode / quota — ignore, state just won't persist */
  }
}

export function getLeague(): League | null {
  return read<League | null>("league", null);
}

export function setLeague(league: League): void {
  write("league", league);
}

/** Teams are keyed per league, so each format keeps its own roster. */
export function getTeam(league: League): TeamMember[] {
  return read<TeamMember[]>(`team.${league}`, []);
}

export function setTeam(league: League, team: TeamMember[]): void {
  write(`team.${league}`, team);
}
