import type { Language } from "./languages";

type VideoContent = {
  [key in Language]: Array<{
    title: string;
    description: string;
    url: string;
    date: string;
    views: string;
  }>;
};

export const VIDEOS: VideoContent = {
  ru: [
    {
      title: "Архитектура высоконагруженных систем",
      description: "Разбор архитектурных решений для масштабируемых приложений",
      url: "https://youtube.com/...",
      date: "2024-03-15",
      views: "1.2K",
    },
  ],
  en: [
    {
      title: "High-Load Systems Architecture",
      description:
        "Analysis of architectural solutions for scalable applications",
      url: "https://youtube.com/...",
      date: "2024-03-15",
      views: "1.2K",
    },
  ],
};
