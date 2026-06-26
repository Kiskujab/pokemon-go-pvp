import { useCallback, useEffect, useRef, useState } from "react";

export interface KeystrokeSearchHandlers {
  /** Whether the global listener is active. */
  active: boolean;
  /** Number keys 1-9 (only fired while a query is being typed). */
  onSelectIndex?: (index: number) => void;
  /** ArrowUp / ArrowDown → -1 / +1. */
  onMove?: (delta: number) => void;
  /** Enter. */
  onConfirm?: () => void;
  /** Esc pressed while the buffer is already empty. */
  onEscape?: () => void;
}

/**
 * Global keystroke prefix matcher (no input field). The user just types the
 * start of a pokemon's name; the consumer renders the matches from `buffer`.
 * Ignored while a real form field is focused so it never hijacks typing.
 */
export function useKeystrokeSearch(handlers: KeystrokeSearchHandlers) {
  const [buffer, setBuffer] = useState("");
  // keep latest handlers without re-binding the listener every render
  const ref = useRef(handlers);
  ref.current = handlers;

  const clear = useCallback(() => setBuffer(""), []);

  useEffect(() => {
    if (!handlers.active) return;

    function isFormFocused(): boolean {
      const el = document.activeElement as HTMLElement | null;
      if (!el) return false;
      const tag = el.tagName;
      return (
        tag === "INPUT" ||
        tag === "TEXTAREA" ||
        tag === "SELECT" ||
        el.isContentEditable
      );
    }

    function onKeyDown(e: KeyboardEvent) {
      const h = ref.current;
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (isFormFocused()) return;

      if (e.key === "Backspace") {
        e.preventDefault();
        setBuffer((b) => b.slice(0, -1));
        return;
      }
      if (e.key === "Escape") {
        e.preventDefault();
        setBuffer((b) => {
          if (b) return "";
          h.onEscape?.();
          return b;
        });
        return;
      }
      if (e.key === "Enter") {
        e.preventDefault();
        h.onConfirm?.();
        return;
      }
      if (e.key === "ArrowDown") {
        e.preventDefault();
        h.onMove?.(1);
        return;
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        h.onMove?.(-1);
        return;
      }
      // number keys select a result, but only once a query exists
      if (/^[1-9]$/.test(e.key)) {
        setBuffer((b) => {
          if (b && h.onSelectIndex) h.onSelectIndex(Number(e.key) - 1);
          return b;
        });
        return;
      }
      // letters extend the query
      if (e.key.length === 1 && /[a-zA-Z]/.test(e.key)) {
        setBuffer((b) => b + e.key.toLowerCase());
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [handlers.active]);

  return { buffer, setBuffer, clear };
}
