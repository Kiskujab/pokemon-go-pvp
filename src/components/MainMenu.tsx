import type { Mode } from "../App";
import type { DictKey } from "../i18n/locales/en";
import { useT } from "../i18n";
import LanguagePicker from "./LanguagePicker";
import Pokeball from "./Pokeball";

interface Props {
  onPick: (mode: Mode) => void;
}

const CARDS: {
  mode: Exclude<Mode, "menu">;
  icon: string;
  titleKey: DictKey;
  descKey: DictKey;
  accent: string;
}[] = [
  {
    mode: "pvp",
    icon: "⚔️",
    titleKey: "menu.pvp.title",
    descKey: "menu.pvp.desc",
    accent: "from-sky-500/25 to-sky-700/5 hover:border-sky-400/70",
  },
  {
    mode: "analysis",
    icon: "📊",
    titleKey: "menu.analysis.title",
    descKey: "menu.analysis.desc",
    accent: "from-purple-500/25 to-purple-700/5 hover:border-purple-400/70",
  },
  {
    mode: "raid",
    icon: "🛡️",
    titleKey: "menu.raid.title",
    descKey: "menu.raid.desc",
    accent: "from-rose-500/25 to-rose-700/5 hover:border-rose-400/70",
  },
  {
    mode: "types",
    icon: "🎯",
    titleKey: "menu.types.title",
    descKey: "menu.types.desc",
    accent: "from-emerald-500/25 to-emerald-700/5 hover:border-emerald-400/70",
  },
  {
    mode: "dex",
    icon: "📒",
    titleKey: "menu.dex.title",
    descKey: "menu.dex.desc",
    accent: "from-amber-500/25 to-amber-700/5 hover:border-amber-400/70",
  },
  {
    mode: "weather",
    icon: "⛅",
    titleKey: "menu.weather.title",
    descKey: "menu.weather.desc",
    accent: "from-cyan-500/25 to-cyan-700/5 hover:border-cyan-400/70",
  },
];

/** Top-level home screen: choose PvP helper vs Meta/Team builder, pick language. */
export default function MainMenu({ onPick }: Props) {
  const { t } = useT();
  return (
    <div className="pogo-aurora flex min-h-dvh flex-col items-center justify-center gap-8 p-6">
      <header className="flex animate-fade-up flex-col items-center text-center">
        <Pokeball className="h-14 w-14 animate-bob drop-shadow-[0_0_18px_rgba(56,189,248,0.4)]" />
        <h1 className="mt-3 text-3xl font-extrabold tracking-tight">
          {t("app.title")}
        </h1>
        <p className="mt-1 text-white/50">{t("app.tagline")}</p>
      </header>

      <div className="w-full max-w-2xl">
        <p className="mb-3 text-center text-sm uppercase tracking-wide text-white/40">
          {t("menu.choose")}
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          {CARDS.map((c, i) => (
            <button
              key={c.mode}
              type="button"
              onClick={() => onPick(c.mode)}
              style={{ animationDelay: `${0.08 + i * 0.08}s` }}
              className={`group flex animate-fade-up flex-col items-start gap-2 rounded-2xl border border-white/10 bg-gradient-to-b ${c.accent} p-6 text-left transition hover:-translate-y-0.5`}
            >
              <span className="text-4xl transition group-hover:scale-110">
                {c.icon}
              </span>
              <span className="text-xl font-bold">{t(c.titleKey)}</span>
              <span className="text-sm leading-snug text-white/55">
                {t(c.descKey)}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex animate-fade-up flex-col items-center gap-2" style={{ animationDelay: "0.28s" }}>
        <span className="text-xs uppercase tracking-wide text-white/40">
          {t("menu.language")}
        </span>
        <LanguagePicker variant="bar" />
      </div>
    </div>
  );
}
