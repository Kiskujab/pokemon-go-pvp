import { useT } from "../i18n";
import Pokeball from "./Pokeball";

/** Animated splash shown briefly on startup. */
export default function LoadingScreen() {
  const { t } = useT();
  return (
    <div className="pogo-aurora flex min-h-dvh flex-col items-center justify-center gap-6 p-6 text-center">
      <Pokeball className="h-20 w-20 drop-shadow-[0_0_24px_rgba(56,189,248,0.45)]" spinning />
      <div className="animate-fade-in">
        <h1 className="text-2xl font-extrabold tracking-tight">{t("app.title")}</h1>
        <p className="mt-1 text-sm text-white/50">{t("loading.subtitle")}</p>
      </div>
    </div>
  );
}
