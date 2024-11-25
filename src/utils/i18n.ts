import { translations } from "../i18n/translations";
import type { Language } from "../constants/languages";
import type { AstroGlobal } from "astro";

export function useTranslations(Astro: AstroGlobal) {
  const lang = Astro.locals.lang as Language;
  return {
    t: (key: keyof typeof translations) => translations[key]?.[lang] || key,
    lang,
  };
}
