/// <reference types="vitest/config" />
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// Resolve an HTML entry point relative to this config file.
const html = (p: string) => fileURLToPath(new URL(p, import.meta.url));

// https://vite.dev/config/
// `base` matches the GitHub Pages repo path for production builds, while local
// dev/preview stays at "/". Each tool is its own HTML entry (multi-page build),
// so it gets its own directory + index.html under dist/.
export default defineConfig(({ command }) => ({
  base: command === "build" ? "/pokemon-go-pvp/" : "/",
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      input: {
        main: html("index.html"),
        pvp: html("pvp-helper/index.html"),
        analysis: html("meta-team-builder/index.html"),
        raid: html("raid-counters/index.html"),
        types: html("type-chart/index.html"),
        dex: html("poke-dex/index.html"),
        weather: html("weather-boost/index.html"),
      },
    },
  },
  test: {
    environment: "node",
    include: ["src/**/*.test.ts"],
  },
}));
