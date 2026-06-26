import { useState } from "react";
import type { League, TeamMember } from "./types";
import {
  getLeague,
  getTeam,
  setLeague as persistLeague,
  setTeam as persistTeam,
} from "./lib/storage";
import LeagueSelect from "./components/LeagueSelect";
import TeamSetup from "./components/TeamSetup";
import BattleScreen from "./components/BattleScreen";

type Phase = "league" | "team" | "battle";

function initialPhase(league: League | null): Phase {
  if (!league) return "league";
  return getTeam(league).length === 3 ? "battle" : "team";
}

export default function App() {
  const [league, setLeagueState] = useState<League | null>(() => getLeague());
  const [team, setTeamState] = useState<TeamMember[]>(() => {
    const l = getLeague();
    return l ? getTeam(l) : [];
  });
  const [phase, setPhase] = useState<Phase>(() => initialPhase(getLeague()));

  const chooseLeague = (l: League) => {
    persistLeague(l);
    setLeagueState(l);
    const t = getTeam(l);
    setTeamState(t);
    setPhase(t.length === 3 ? "battle" : "team");
  };

  const confirmTeam = (t: TeamMember[]) => {
    if (!league) return;
    persistTeam(league, t);
    setTeamState(t);
    setPhase("battle");
  };

  if (phase === "league" || !league) {
    return <LeagueSelect current={league} onSelect={chooseLeague} />;
  }

  if (phase === "team") {
    return (
      <TeamSetup
        league={league}
        initialTeam={team}
        onConfirm={confirmTeam}
        onBack={() => setPhase("league")}
      />
    );
  }

  return (
    <BattleScreen
      league={league}
      team={team}
      onEditTeam={() => setPhase("team")}
      onChangeLeague={() => setPhase("league")}
    />
  );
}
