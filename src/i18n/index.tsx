import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { PokemonType } from "../types";
import en, { type DictKey } from "./locales/en";
import hu from "./locales/hu";
import de from "./locales/de";
import es from "./locales/es";
import it from "./locales/it";
import fr from "./locales/fr";
import pt from "./locales/pt";
import pl from "./locales/pl";
import cs from "./locales/cs";
import tr from "./locales/tr";
import ja from "./locales/ja";
import zh from "./locales/zh";
import hi from "./locales/hi";

export type Lang =
  | "en"
  | "de"
  | "fr"
  | "es"
  | "it"
  | "pt"
  | "pl"
  | "cs"
  | "tr"
  | "hu"
  | "ja"
  | "zh"
  | "hi";

/** Order shown in the language picker, with native labels + flags. */
export const LANGUAGES: { id: Lang; label: string; flag: string }[] = [
  { id: "en", label: "English", flag: "🇬🇧" },
  { id: "de", label: "Deutsch", flag: "🇩🇪" },
  { id: "fr", label: "Français", flag: "🇫🇷" },
  { id: "es", label: "Español", flag: "🇪🇸" },
  { id: "it", label: "Italiano", flag: "🇮🇹" },
  { id: "pt", label: "Português", flag: "🇵🇹" },
  { id: "pl", label: "Polski", flag: "🇵🇱" },
  { id: "cs", label: "Čeština", flag: "🇨🇿" },
  { id: "tr", label: "Türkçe", flag: "🇹🇷" },
  { id: "hu", label: "Magyar", flag: "🇭🇺" },
  { id: "ja", label: "日本語", flag: "🇯🇵" },
  { id: "zh", label: "中文", flag: "🇨🇳" },
  { id: "hi", label: "हिन्दी", flag: "🇮🇳" },
];

// Each locale is layered over English so any missing key falls back gracefully.
const DICTS: Record<Lang, Record<string, string>> = {
  en,
  de: { ...en, ...de },
  fr: { ...en, ...fr },
  es: { ...en, ...es },
  it: { ...en, ...it },
  pt: { ...en, ...pt },
  pl: { ...en, ...pl },
  cs: { ...en, ...cs },
  tr: { ...en, ...tr },
  hu: { ...en, ...hu },
  ja: { ...en, ...ja },
  zh: { ...en, ...zh },
  hi: { ...en, ...hi },
};

const STORAGE_KEY = "pogo-pvp.lang";

/** Default is English; we only override it with an explicit saved choice. */
function detectInitial(): Lang {
  try {
    const saved = localStorage.getItem(STORAGE_KEY) as Lang | null;
    if (saved && saved in DICTS) return saved;
  } catch {
    /* ignore */
  }
  return "en";
}

type Params = Record<string, string | number>;

function interpolate(s: string, params?: Params): string {
  if (!params) return s;
  return s.replace(/\{(\w+)\}/g, (_, k) =>
    k in params ? String(params[k]) : `{${k}}`
  );
}

export interface I18n {
  lang: Lang;
  setLang: (l: Lang) => void;
  /** Translate a UI key, with optional {param} interpolation. */
  t: (key: DictKey, params?: Params) => string;
  /** Localized display name of a pokemon/move (Hungarian uses nameHu). */
  name: (e: { name: string; nameHu?: string }) => string;
  /** Localized type name. */
  typeName: (type: PokemonType) => string;
}

const Ctx = createContext<I18n | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(detectInitial);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    try {
      localStorage.setItem(STORAGE_KEY, l);
    } catch {
      /* ignore */
    }
    if (typeof document !== "undefined") document.documentElement.lang = l;
  }, []);

  const value = useMemo<I18n>(() => {
    const dict = DICTS[lang];
    return {
      lang,
      setLang,
      t: (key, params) => interpolate(dict[key] ?? en[key] ?? key, params),
      name: (e) => (lang === "hu" && e.nameHu ? e.nameHu : e.name),
      typeName: (type) => dict[`type.${type}`] ?? type,
    };
  }, [lang, setLang]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useT(): I18n {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useT must be used within <I18nProvider>");
  return ctx;
}
