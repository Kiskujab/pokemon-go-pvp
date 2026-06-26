/// <reference types="vitest/config" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
// `base` matches the GitHub Pages repo path for production builds, while local
// dev/preview stays at "/".
export default defineConfig(({ command }) => ({
  base: command === "build" ? "/pokemon-go-pvp/" : "/",
  plugins: [react(), tailwindcss()],
  test: {
    environment: "node",
    include: ["src/**/*.test.ts"],
  },
}));
