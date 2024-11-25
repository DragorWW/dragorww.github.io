import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
  site: "https://dragorww.github.io",
  base: "/",
  compressHTML: true,
  build: {
    assets: "assets",
  },
  vite: {
    build: {
      cssMinify: true,
    },
  },
  server: {
    host: "0.0.0.0",
    port: 5555,
  },
});
