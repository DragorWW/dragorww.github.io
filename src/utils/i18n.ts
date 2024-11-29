import { translations } from "../i18n/translations";
import type { AstroGlobal } from "astro";
import { LANGUAGES } from "../constants/languages";

export function useTranslations(Astro: AstroGlobal) {
  return {
    t: (key: string, lang: string = LANGUAGES.EN) => {
      const translation = translations[key]?.[lang];
      if (!translation) {
        console.warn(
          `Missing translation for key: ${key} in language: ${lang}`,
        );
        return key;
      }
      return translation;
    },
    lang: Astro.params.lang || LANGUAGES.EN,
  };
}
