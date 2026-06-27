import { WEATHER } from "../../data/weather";
import { useT } from "../../i18n";
import LanguagePicker from "../LanguagePicker";
import TypeChip from "../TypeChip";

interface Props {
  onExit: () => void;
}

/** Static reference: which in-game weather boosts which attack types. */
export default function WeatherGuide({ onExit }: Props) {
  const { t } = useT();
  return (
    <div className="mx-auto flex min-h-dvh max-w-2xl flex-col gap-4 p-3">
      <header className="flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={onExit}
          className="rounded-lg bg-white/5 px-3 py-1.5 text-sm hover:bg-white/10"
        >
          ← {t("common.menu")}
        </button>
        <h1 className="truncate text-lg font-bold">{t("weather.title")}</h1>
        <LanguagePicker variant="compact" />
      </header>

      <p className="text-sm text-white/55">{t("weather.intro")}</p>

      <div className="grid gap-3 sm:grid-cols-2">
        {WEATHER.map((w) => (
          <div
            key={w.id}
            className="flex flex-col gap-2 rounded-2xl border border-white/10 bg-[#1a1a1a] p-4"
          >
            <div className="flex items-center gap-2">
              <span className="text-2xl">{w.icon}</span>
              <span className="font-bold">{t(`weather.${w.id}` as "weather.sunny")}</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {w.boosts.map((type) => (
                <TypeChip key={type} type={type} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
