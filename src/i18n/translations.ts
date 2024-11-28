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
  "nav.cover-generator": {
    ru: "Генератор обложек",
    en: "Cover Generator",
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
    ru: "Политика конфиденциальности",
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
  "hero.sharing.about": {
    ru: "про продуктовую разработку и",
    en: "about product development and",
  },
  "hero.cv": {
    ru: "CV на HH.ru",
    en: "LinkedIn",
  },
  "hero.contact": {
    ru: "Написать мне",
    en: "Contact me",
  },
  "education.degree": {
    ru: "Закончил Факультет психологии",
    en: "Faculty of Psychology Graduate",
  },
  "education.institution": {
    ru: "Национальный исследовательский Томский государственный университет",
    en: "National Research Tomsk State University",
  },
  "education.location": {
    ru: "Томск",
    en: "Tomsk",
  },
  "education.description": {
    ru: "Факультет психологии, Связи с общественностью",
    en: "Faculty of Psychology, Public Relations",
  },
  "experience.role.cto": {
    ru: "CTO",
    en: "CTO",
  },
  "experience.role.principal": {
    ru: "Principal Developer",
    en: "Principal Developer",
  },
  "experience.role.head": {
    ru: "Head of Frontend",
    en: "Head of Frontend",
  },
  "experience.company.ultimate": {
    ru: "Ultimate Education",
    en: "Ultimate Education",
  },
  "experience.company.xyz": {
    ru: "XYZ School",
    en: "XYZ School",
  },
  "experience.company.sber": {
    ru: "SberTech",
    en: "SberTech",
  },
  "experience.company.mag": {
    ru: "MagDevelopment",
    en: "MagDevelopment",
  },
  "experience.company.user": {
    ru: "UserStory",
    en: "UserStory",
  },
  "experience.location.moscow": {
    ru: "Москва",
    en: "Moscow",
  },
  "experience.location.spb": {
    ru: "Санкт-Петербург",
    en: "Saint Petersburg",
  },
  "experience.location.tomsk": {
    ru: "Томск",
    en: "Tomsk",
  },
  "experience.ultimate.description": {
    ru: "Руководство IT-стратегией холдинга из 7 компаний:",
    en: "Leading IT strategy for a holding of 7 companies:",
  },
  "experience.ultimate.achievement1": {
    ru: "Масштабирование IT-решений для холдинга из 7 компаний",
    en: "Scaling IT solutions for a holding of 7 companies",
  },
  "experience.ultimate.achievement2": {
    ru: "Разработка и внедрение единой IT-стратегии",
    en: "Development and implementation of unified IT strategy",
  },
  "experience.ultimate.achievement3": {
    ru: "Оптимизация бюджета и ресурсов через централизацию систем",
    en: "Budget and resource optimization through systems centralization",
  },
  "experience.ultimate.achievement4": {
    ru: "Создание комплексной аналитической платформы",
    en: "Creation of comprehensive analytics platform",
  },
  "experience.xyz.description": {
    ru: "Ключевые достижения за 3 года 10 месяцев:",
    en: "Key achievements over 3 years and 10 months:",
  },
  "experience.xyz.achievement1": {
    ru: "Разработка и внедрение LMS системы",
    en: "Development and implementation of LMS system",
  },
  "experience.xyz.achievement2": {
    ru: "Внедрее продуктовой аналитики на базе Metabase",
    en: "Implementation of product analytics based on Metabase",
  },
  "experience.xyz.achievement3": {
    ru: "Автоматизация бизнес-процессов и интеграция систем",
    en: "Business process automation and systems integration",
  },
  "experience.sber.description": {
    ru: "Разработка внутреннего DevOps продукта:",
    en: "Development of internal DevOps product:",
  },
  "experience.sber.achievement1": {
    ru: "Оптимизация производительности (10x улучшение)",
    en: "Performance optimization (10x improvement)",
  },
  "experience.sber.achievement2": {
    ru: "Проектирование архитектуры React-приложений",
    en: "Designing architecture for React applications",
  },
  "experience.mag.description": {
    ru: "Развитие cargomart.ru в течение 3 лет:",
    en: "Development of cargomart.ru for 3 years:",
  },
  "experience.mag.achievement1": {
    ru: "Разработка архитектуры React-приложения",
    en: "Development of React application architecture",
  },
  "experience.mag.achievement2": {
    ru: "Внедрение CI/CD и автоматизация процессов",
    en: "Implementation of CI/CD and process automation",
  },
  "experience.mag.achievement3": {
    ru: "Стандартизация API и тестирования",
    en: "Standardization of API and testing",
  },
  "experience.user.description": {
    ru: "Руководство отделом фронтенд-разработки более 3 лет:",
    en: "Leading frontend development department for over 3 years:",
  },
  "experience.user.achievement1": {
    ru: "Участие в разработке более 30 проектов",
    en: "Participation in development of over 30 projects",
  },
  "experience.user.achievement2": {
    ru: "Проектирование фронтенд архитектуры для 7 проектов",
    en: "Designing frontend architecture for 7 projects",
  },
  "experience.user.achievement3": {
    ru: "Развитие от middle developer до руководителя отдела",
    en: "Growth from middle developer to department head",
  },
  "timeline.present": {
    ru: "настоящее время",
    en: "present",
  },
  "videos.section.title": {
    ru: "Интервью и выступления",
    en: "Interviews and Talks",
  },
  "videos.1.title": {
    ru: "О жизни иммигранта в Алматы и грамотном подходе к бизнесу, работе и жизни",
    en: "On immigrant life in Almaty and a smart approach to business, work and life",
  },
  "videos.1.description": {
    ru: "В этом подкасте поговорил с Сергеем, который в 2022 году переехал вместе с беременной женой в Алматы. В подкасте Сергей поделился своим опытом эмиграции и жизни в Казахстане. Также обсудили с ним важный вопрос: как живется женам айтишников в эмиграции? И, конечно же, затронули темы бизнеса, IT и работы продуктовой команды.",
    en: "In this podcast, I talked with Sergey, who moved to Almaty with his pregnant wife in 2022. Sergey shared his experience of emigration and life in Kazakhstan. We also discussed an important question: how do IT specialists' wives live in emigration? And, of course, we touched upon topics of business, IT and product team work.",
  },
  "videos.2.title": {
    ru: "CTO о бизнес-процессах и развитии компании: личный опыт и лучшие практики!",
    en: "CTO on business processes and company development: personal experience and best practices!",
  },
  "videos.2.description": {
    ru: "HROM подкаст с Сергеем Андреевым - СТО, поговорили про вектор развития компании, удаленную работу, образование и самообразование в ИТ, проблемы найма и как СТО подходит к выбору кандидатов себе в команду",
    en: "HROM podcast with Sergey Andreev - CTO, discussed company development vector, remote work, education and self-education in IT, hiring challenges and how CTO approaches candidate selection for the team",
  },
  "videos.3.title": {
    ru: "Эмиграция, родительство, IT / Фил Ранжин, Сергей Андреев / Peredelanoconf podcast",
    en: "Emigration, parenthood, IT / Phil Ranzhin, Sergey Andreev / Peredelanoconf podcast",
  },
  "videos.3.description": {
    ru: "Обсуждаем, как жить в чужой стране, если ты отец, сравниваем Таиланд и Казахстан, разбираемся, как жить и развиваться в этом сложном мире",
    en: "Discussing how to live in a foreign country as a father, comparing Thailand and Kazakhstan, figuring out how to live and develop in this complex world",
  },
  "footer.section.title": {
    ru: "Меня можно найти здесь",
    en: "Find me here",
  },
  "footer.aria.github": {
    ru: "Профиль GitHub",
    en: "GitHub Profile",
  },
  "footer.aria.linkedin": {
    ru: "Профиль LinkedIn",
    en: "LinkedIn Profile",
  },
  "footer.aria.telegram": {
    ru: "Профиль Telegram",
    en: "Telegram Profile",
  },
  "footer.aria.youtube": {
    ru: "YouTube канал",
    en: "YouTube Channel",
  },
  "footer.source": {
    ru: "исходный код",
    en: "source code",
  },
  "footer.sourceUrl": {
    ru: "https://github.com/DragorWW/dragorww.github.io",
    en: "https://github.com/DragorWW/dragorww.github.io",
  },
  "terminal.welcome": {
    ru: "Добро пожаловать в мой цифровой сад! 🌱",
    en: "Welcome to my digital garden! 🌱",
  },
  "terminal.description": {
    ru: "Здесь растут идеи, проекты и знания...",
    en: "Here grow ideas, projects and knowledge...",
  },
  "terminal.explore": {
    ru: "Исследуйте с помощью",
    en: "Explore using",
  },
  "terminal.help.title": {
    ru: "Доступные команды:",
    en: "Available commands:",
  },
  "terminal.help.help": {
    ru: "Показать это сообщение",
    en: "Show this message",
  },
  "terminal.help.about": {
    ru: "Обо мне",
    en: "About me",
  },
  "terminal.help.skills": {
    ru: "Мои навыки",
    en: "My skills",
  },
  "terminal.help.contact": {
    ru: "Контактная информация",
    en: "Contact information",
  },
  "terminal.help.projects": {
    ru: "Список проектов",
    en: "List of projects",
  },
  "terminal.help.clear": {
    ru: "Очистить терминал",
    en: "Clear terminal",
  },
  "terminal.about.name": {
    ru: "Имя",
    en: "Name",
  },
  "terminal.about.role": {
    ru: "Должность",
    en: "Role",
  },
  "terminal.about.status": {
    ru: "Статус",
    en: "Status",
  },
  "terminal.about.status.value": {
    ru: "Разрабатываю крутые штуки...",
    en: "Developing awesome things...",
  },
  "terminal.thinking": {
    ru: "Думаю",
    en: "Thinking",
  },
  "terminal.projects.analytics": {
    ru: "Разработка платформы бизнес-аналитики",
    en: "Develop Business Analytics Platform",
  },
  "terminal.projects.education": {
    ru: "Разработка образовательной платфомы",
    en: "Develop Educational Platform",
  },
  "terminal.projects.devops": {
    ru: "Разработка DevOps CD/CD инструментов (клон Jenkins)",
    en: "Develop DevOps CD/CD Tools (clone Jenkins)",
  },
  "terminal.projects.cargo": {
    ru: "Разработка грузовой площадки",
    en: "Develop Cargo Marketplace",
  },
  "terminal.command.not_found": {
    ru: "Команда не найдена. Введите 'help' для списка команд.",
    en: "Command not found. Type 'help' for available commands.",
  },
  "terminal.command.error": {
    ru: "Произошла ошибка при выполнении команды",
    en: "An error occurred while executing the command",
  },
  "terminal.command.success": {
    ru: "Команда успешно выполнена",
    en: "Command executed successfully",
  },
  "terminal.commands.help": {
    ru: "помощь",
    en: "help",
  },
  "terminal.commands.clear": {
    ru: "очистить",
    en: "clear",
  },
  "terminal.commands.about": {
    ru: "обо_мне",
    en: "about",
  },
  "terminal.commands.projects": {
    ru: "проекты",
    en: "projects",
  },
  "terminal.commands.skills": {
    ru: "навыки",
    en: "skills",
  },
  "terminal.commands.contact": {
    ru: "контакты",
    en: "contact",
  },
  "terminal.commands.experience": {
    ru: "опыт",
    en: "experience",
  },
  "terminal.help.description.help": {
    ru: "Показать список доступных команд",
    en: "Show list of available commands",
  },
  "terminal.help.description.clear": {
    ru: "Очистить терминал",
    en: "Clear terminal screen",
  },
  "terminal.help.description.about": {
    ru: "Показать информацию обо мне",
    en: "Show information about me",
  },
  "terminal.help.description.projects": {
    ru: "Показать список проектов",
    en: "Show list of projects",
  },
  "terminal.help.description.skills": {
    ru: "Показать список навыков",
    en: "Show list of skills",
  },
  "terminal.help.description.contact": {
    ru: "Показать контактную информацию",
    en: "Show contact information",
  },
  "terminal.help.description.experience": {
    ru: "Показать опыт работы",
    en: "Show work experience",
  },
  "terminal.response.about": {
    ru: `Привет! Я Сергей Андреев, CTO и IT-архитектор.
    • 10+ лет опыта в разработке
    • Специализация: масштабируемые образовательные проекты
    • Текущая позиция: CTO в Ultimate Education
    
    Подробнее: используйте команды 'experience' или 'skills'`,
    en: `Hi! I'm Sergey Andreev, CTO and IT architect.
    • 10+ years of development experience
    • Specialization: scalable educational projects
    • Current position: CTO at Ultimate Education
    
    More info: use 'experience' or 'skills' commands`,
  },
  "terminal.response.contact": {
    ru: `📫 Контактная информация:
    • Telegram: @dragorww
    • Email: dragorww@gmail.com
    • LinkedIn: /in/dragorww
    • GitHub: @dragorww`,
    en: `📫 Contact information:
    • Telegram: @dragorww
    • Email: dragorww@gmail.com
    • LinkedIn: /in/dragorww
    • GitHub: @dragorww`,
  },
  "terminal.system.loading": {
    ru: "Загрузка...",
    en: "Loading...",
  },
  "terminal.system.ready": {
    ru: "Система готова к работе",
    en: "System ready",
  },
  "terminal.system.error": {
    ru: "Произошла ошибка системы",
    en: "System error occurred",
  },
  "terminal.system.welcome": {
    ru: `Добро пожаловать в интерактивный терминал!
    Введите 'help' для списка команд.
    
    Версия: 1.0.0
    `,
    en: `Welcome to interactive terminal!
    Type 'help' for available commands.
    
    Version: 1.0.0
    `,
  },
  "terminal.hint.type_help": {
    ru: "Подсказка: введите 'help' для списка команд",
    en: "Hint: type 'help' for available commands",
  },
  "terminal.hint.command_history": {
    ru: "Используйте ↑↓ для навигации по истории команд",
    en: "Use ↑↓ to navigate command history",
  },
  "terminal.hint.tab_completion": {
    ru: "Используйте Tab для автодополнения команд",
    en: "Use Tab for command completion",
  },
  "terminal.status.processing": {
    ru: "Обработка...",
    en: "Processing...",
  },
  "terminal.status.completed": {
    ru: "Завершено",
    en: "Completed",
  },
  "terminal.status.failed": {
    ru: "Не удалось выполнить",
    en: "Failed to execute",
  },
} as const;

export function t(key: string, lang: string): string {
  return translations[key]?.[lang] || key;
}
