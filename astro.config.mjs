import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import { LANGUAGES, DEFAULT_LANGUAGE } from "./src/constants/languages";

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
  i18n: {
    defaultLocale: DEFAULT_LANGUAGE,
    locales: [LANGUAGES.RU, LANGUAGES.EN],
  },
  integrations: [
    sitemap({
      changefreq: "weekly",
      priority: 0.7,
      lastmod: new Date(),
      i18n: {
        defaultLocale: DEFAULT_LANGUAGE,
        locales: {
          [LANGUAGES.RU]: "ru-RU",
          [LANGUAGES.EN]: "en-US",
        },
      },
    }),
  ],
});
