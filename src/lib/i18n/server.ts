import { cookies } from "next/headers";
import type { Locale } from "./index";
import { defaultLocale, getDictionary } from "./index";

/** Read locale from cookies (server components only). */
export function getLocale(): Locale {
  const cookieStore = cookies();
  const value = cookieStore.get("locale")?.value;
  const validLocales: string[] = ["ru", "en", "tr", "kk", "ky"];
  if (value && validLocales.includes(value)) return value as Locale;
  return defaultLocale;
}

export { getDictionary };
