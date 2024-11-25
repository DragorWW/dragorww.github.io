type TranslationKey = {
  ru: string;
  en: string;
};

type Translations = {
  [key: string]: TranslationKey;
};

export const translations: Translations = {
  "me.name": {
    ru: "Сергей Андреев",
    en: "Sergey Andreev",
  },
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
  "hero.sharing.twitter": {
    ru: "Twitter",
    en: "Twitter",
  },
  "hero.sharing.blog": {
    ru: "веду блог",
    en: "lead a blog",
  },
  "hero.sharing.in": {
    ru: "в",
    en: "in",
  },
  "hero.sharing.and": {
    ru: "и",
    en: "and",
  },
  "hero.sharing.youtube": {
    ru: "YouTube",
    en: "YouTube",
  },
  "hero.sharing.telegram": {
    ru: "Telegram",
    en: "Telegram",
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
    ru: "Политика конфиден��иальности",
    en: "Privacy Policy",
  },
  "footer.terms": {
    ru: "Условия использования",
    en: "Terms of Use",
  },
  "hero.greeting": {
    ru: "Привет, я",
    en: "Hi, I'm",
  },
  "hero.role": {
    ru: "CTO, IT-архитектор и амбассадор продуктовой разработки.",
    en: "CTO, IT Architect and Product Development Ambassador.",
  },
  "hero.stats.experience": {
    ru: "Создаю успешные команды и продукты 10+ лет",
    en: "Building successful teams and products for 10+ years",
  },
  "hero.stats.delivery": {
    ru: "Внедряю процессы непрерывной поставки",
    en: "Implementing continuous delivery processes",
  },
  "hero.stats.solutions": {
    ru: "Проектирую масштабируемые решения для бизнеса",
    en: "Designing scalable business solutions",
  },
  "hero.sharing": {
    ru: "Активно делюсь опытом в",
    en: "Actively sharing experience on",
  },
  "hero.blog": {
    ru: "Системная интроспекция",
    en: "System Introspection",
  },
  "hero.sharing.and": {
    ru: "и",
    en: "and",
  },
  "hero.sharing.about": {
    ru: "про продуктовую разработку и",
    en: "about product development and",
  },
  "hero.cv": {
    ru: "CV на HH.ru",
    en: "CV on HH.ru",
  },
  "hero.contact": {
    ru: "Написать мне",
    en: "Contact me",
  },
} as const;

export function t(key: string, lang: string): string {
  return translations[key]?.[lang] || key;
}
