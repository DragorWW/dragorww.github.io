type TranslationKey = {
  ru: string;
  en: string;
};

type Translations = {
  [key: string]: TranslationKey;
};

export const translations: Translations = {
  "nav.home": {
    ru: "Главная",
    en: "Home",
  },
  "nav.experience": {
    ru: "Мой опыт",
    en: "Experience",
  },
  "nav.contacts": {
    ru: "Контакты",
    en: "Contacts",
  },
  "aria.switchLang": {
    ru: "Переключить язык",
    en: "Switch language",
  },
  "aria.switchTheme": {
    ru: "Переключить тему",
    en: "Switch theme",
  },
  "hero.title": {
    ru: "CTO и IT-Архитектор",
    en: "CTO and IT Architect",
  },
  "hero.subtitle": {
    ru: "с опытом построения масштабируемых решений",
    en: "with experience in building scalable solutions",
  },
  "hero.resume": {
    ru: "Посмотреть резюме",
    en: "View Resume",
  },
  "hero.telegram": {
    ru: "Написать в Telegram",
    en: "Message on Telegram",
  },
  "hero.youtube": {
    ru: "YouTube канал",
    en: "YouTube Channel",
  },
  "hero.twitter": {
    ru: "Twitter",
    en: "Twitter",
  },
  "hero.channel": {
    ru: "Telegram канал",
    en: "Telegram Channel",
  },
  "experience.title": {
    ru: "Опыт работы",
    en: "Work Experience",
  },
  "experience.present": {
    ru: "настоящее время",
    en: "present",
  },
  "experience.skills": {
    ru: "Навыки",
    en: "Skills",
  },
  "experience.achievements": {
    ru: "Достижения",
    en: "Achievements",
  },
  "experience.responsibilities": {
    ru: "Обязанности",
    en: "Responsibilities",
  },
  "contacts.title": {
    ru: "Контакты",
    en: "Contacts",
  },
  "videos.title": {
    ru: "Мои видео",
    en: "My Videos",
  },
  "videos.views": {
    ru: "просмотров",
    en: "views",
  },
  "videos.viewMore": {
    ru: "Смотреть все видео",
    en: "View all videos",
  },
  "videos.date": {
    ru: "Дата публикации",
    en: "Publication date",
  },
  "footer.copyright": {
    ru: "Все права защищены",
    en: "All rights reserved",
  },
  "footer.privacy": {
    ru: "Политика конфиденциальности",
    en: "Privacy Policy",
  },
  "footer.terms": {
    ru: "Условия использования",
    en: "Terms of Use",
  },
} as const;

export function t(key: string, lang: string): string {
  return translations[key]?.[lang] || key;
}
