export const LANGUAGES = {
  RU: "ru",
  EN: "en",
} as const;

export type Language = (typeof LANGUAGES)[keyof typeof LANGUAGES];

export const DEFAULT_LANGUAGE = LANGUAGES.RU;
export const SUPPORTED_LANGUAGES = Object.values(LANGUAGES);
