import {
  DEFAULT_LANGUAGE,
  SUPPORTED_LANGUAGES,
  type Language,
} from "../constants/languages";
import { defineMiddleware } from "astro:middleware";

declare global {
  namespace App {
    interface Locals {
      lang: Language;
    }
  }
}

export const i18nMiddleware = defineMiddleware(
  async ({ locals, url }, next) => {
    const pathname = url.pathname;
    const pathLang = pathname.split("/")[1] || DEFAULT_LANGUAGE;

    locals.lang = SUPPORTED_LANGUAGES.includes(pathLang as Language)
      ? (pathLang as Language)
      : DEFAULT_LANGUAGE;

    return next();
  },
);
