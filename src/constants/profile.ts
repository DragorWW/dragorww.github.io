import type { Language } from "./languages";

type ProfileData = {
  [key in Language]: {
    name: string;
    description: string;
    keywords: string;
  };
};

export const PROFILE_DATA: ProfileData = {
  ru: {
    name: "Сергей Андреев",
    description:
      "CTO и IT-Архитектор с опытом построения масштабируемых решений",
    keywords: "CTO, Head of Engineering, IT Architecture, Team Management",
  },
  en: {
    name: "Sergey Andreev",
    description:
      "CTO and IT Architect with experience in building scalable solutions",
    keywords: "CTO, Head of Engineering, IT Architecture, Team Management",
  },
} as const;

export type Profile = typeof PROFILE_DATA;
