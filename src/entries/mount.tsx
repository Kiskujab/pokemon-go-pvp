import { StrictMode, type ReactNode } from "react";
import { createRoot } from "react-dom/client";
import "../index.css";
import { I18nProvider } from "../i18n";

/** Mount a page-level component with the shared i18n provider + global styles.
 *  Each route is its own HTML entry, so every page boots through here. */
export function mount(node: ReactNode) {
  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <I18nProvider>{node}</I18nProvider>
    </StrictMode>
  );
}

/** Navigate back to the chooser menu (site root, base-path aware). */
export function goMenu() {
  window.location.href = import.meta.env.BASE_URL;
}
