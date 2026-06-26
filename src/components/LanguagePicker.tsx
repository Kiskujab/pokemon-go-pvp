import { useState } from "react";
import { LANGUAGES, useT } from "../i18n";

interface Props {
  /** "bar" = wide dropdown button (menu), "compact" = flag button (headers). */
  variant?: "bar" | "compact";
}

/** Language switcher driven entirely by the LANGUAGES list — adding a locale is
 *  a data change, never a new button here. Both variants open a scrollable
 *  dropdown so the (long) list never overflows the screen. */
export default function LanguagePicker({ variant = "bar" }: Props) {
  const { lang, setLang } = useT();
  const [open, setOpen] = useState(false);
  const current = LANGUAGES.find((l) => l.id === lang);

  const List = (
    <div
      className={`absolute z-20 max-h-72 w-48 animate-pop overflow-y-auto rounded-xl border border-white/10 bg-[#181820] shadow-xl ${
        variant === "compact"
          ? "right-0 mt-1"
          : "bottom-full left-1/2 mb-1 -translate-x-1/2"
      }`}
    >
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
          <span className="flex-1">{l.label}</span>
          {l.id === lang && <span className="text-sky-400">✓</span>}
        </button>
      ))}
    </div>
  );

  if (variant === "compact") {
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
            {List}
          </>
        )}
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition ${
          open
            ? "border-sky-400 bg-sky-500/20"
            : "border-white/10 bg-white/5 hover:bg-white/10"
        }`}
      >
        <span>{current?.flag}</span>
        <span className="font-semibold">{current?.label}</span>
        <span className="text-white/50">▾</span>
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          {List}
        </>
      )}
    </div>
  );
}
