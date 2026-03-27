import type { Dictionary } from "./dictionaries/ru";
import ru from "./dictionaries/ru";
import en from "./dictionaries/en";
import tr from "./dictionaries/tr";
import kk from "./dictionaries/kk";
import ky from "./dictionaries/ky";

export type { Dictionary };

export type Locale = "ru" | "en" | "tr" | "kk" | "ky";

export const defaultLocale: Locale = "ru";

export const locales: { code: Locale; name: string; flag: string }[] = [
  { code: "ru", name: "Русский", flag: "🇷🇺" },
  { code: "en", name: "English", flag: "🇬🇧" },
  { code: "tr", name: "Türkçe", flag: "🇹🇷" },
  { code: "kk", name: "Қазақша", flag: "🇰🇿" },
  { code: "ky", name: "Кыргызча", flag: "🇰🇬" },
];

const dictionaries: Record<Locale, Dictionary> = { ru, en, tr, kk, ky };

/** Get translation dictionary for a locale. Falls back to Russian. */
export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale] ?? dictionaries.ru;
}

/** Read locale from document.cookie (client components only). */
export function getClientLocale(): Locale {
  if (typeof document === "undefined") return defaultLocale;
  const match = document.cookie.match(/(?:^|;\s*)locale=(\w+)/);
  const value = match?.[1];
  if (value && value in dictionaries) return value as Locale;
  return defaultLocale;
}
