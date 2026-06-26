import { useState } from "react";
import { LANGUAGES, useT } from "../i18n";

interface Props {
  /** "bar" = full segmented row (menu), "compact" = flag button + popover (headers). */
  variant?: "bar" | "compact";
}

/** Language switcher driven entirely by the LANGUAGES list — adding a locale is
 *  a data change, never a new button here. */
export default function LanguagePicker({ variant = "bar" }: Props) {
  const { lang, setLang } = useT();
  const [open, setOpen] = useState(false);

  if (variant === "compact") {
    const current = LANGUAGES.find((l) => l.id === lang);
    return (
      <div className="relative">
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="rounded-lg bg-white/5 px-2.5 py-1.5 text-sm hover:bg-white/10"
          aria-label="Language"
        >
          {current?.flag} <span className="text-white/50">▾</span>
        </button>
        {open && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
            <div className="absolute right-0 z-20 mt-1 w-40 animate-pop overflow-hidden rounded-xl border border-white/10 bg-[#181820] shadow-xl">
              {LANGUAGES.map((l) => (
                <button
                  key={l.id}
                  type="button"
                  onClick={() => {
                    setLang(l.id);
                    setOpen(false);
                  }}
                  className={`flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-white/10 ${
                    l.id === lang ? "bg-white/5 font-semibold" : ""
                  }`}
                >
                  <span>{l.flag}</span>
                  <span>{l.label}</span>
                  {l.id === lang && <span className="ml-auto text-sky-400">✓</span>}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-wrap justify-center gap-2">
      {LANGUAGES.map((l) => (
        <button
          key={l.id}
          type="button"
          onClick={() => setLang(l.id)}
          className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm transition ${
            l.id === lang
              ? "border-sky-400 bg-sky-500/20 font-semibold text-white"
              : "border-white/10 bg-white/5 text-white/70 hover:bg-white/10"
          }`}
        >
          <span>{l.flag}</span>
          <span>{l.label}</span>
        </button>
      ))}
    </div>
  );
}
