import { useEffect, useState } from "react";
import LoadingScreen from "./components/LoadingScreen";
import MainMenu from "./components/MainMenu";
import PvpFlow from "./components/PvpFlow";
import AnalysisScreen from "./components/analysis/AnalysisScreen";
import RaidScreen from "./components/raid/RaidScreen";
import TypeExplorer from "./components/types/TypeExplorer";
import DexScreen from "./components/dex/DexScreen";
import WeatherGuide from "./components/weather/WeatherGuide";

export type Mode =
  | "menu"
  | "pvp"
  | "analysis"
  | "raid"
  | "types"
  | "dex"
  | "weather";

export default function App() {
  // Brief animated splash on first load, then the menu.
  const [booting, setBooting] = useState(true);
  const [mode, setMode] = useState<Mode>("menu");

  useEffect(() => {
    const id = setTimeout(() => setBooting(false), 1100);
    return () => clearTimeout(id);
  }, []);

  if (booting) return <LoadingScreen />;

  const toMenu = () => setMode("menu");

  return (
    <div key={mode} className="animate-fade-in">
      {mode === "menu" && <MainMenu onPick={setMode} />}
      {mode === "pvp" && <PvpFlow onExit={toMenu} />}
      {mode === "analysis" && <AnalysisScreen onExit={toMenu} />}
      {mode === "raid" && <RaidScreen onExit={toMenu} />}
      {mode === "types" && <TypeExplorer onExit={toMenu} />}
      {mode === "dex" && <DexScreen onExit={toMenu} />}
      {mode === "weather" && <WeatherGuide onExit={toMenu} />}
    </div>
  );
}
