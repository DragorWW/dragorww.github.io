type Translations = {
  [key: string]: {
    [key: string]: string;
  };
};

export const translations: Translations = {
  ru: {
    home: "Главная",
    experience: "Мой опыт",
    contacts: "Контакты",
  },
  en: {
    home: "Home",
    experience: "Experience",
    contacts: "Contacts",
  },
};

export function t(key: string): string {
  const lang = localStorage.getItem("lang") || "ru";
  return translations[lang][key] || key;
}
