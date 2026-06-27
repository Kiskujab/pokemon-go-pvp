import { useEffect, useState } from "react";
import LoadingScreen from "./LoadingScreen";
import MainMenu from "./MainMenu";

/** The chooser home page (site root): a brief animated splash, then the menu of
 *  tools. Each tool is its own route/page, reached by a link from the menu. */
export default function MenuPage() {
  const [booting, setBooting] = useState(true);

  useEffect(() => {
    const id = setTimeout(() => setBooting(false), 1100);
    return () => clearTimeout(id);
  }, []);

  if (booting) return <LoadingScreen />;

  return (
    <div className="animate-fade-in">
      <MainMenu />
    </div>
  );
}
