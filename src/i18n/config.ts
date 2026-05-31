export const locales = ["en", "fr", "es", "pt", "sw", "ar"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

export const localeLabels: Record<Locale, string> = {
  en: "English",
  fr: "Français",
  es: "Español",
  pt: "Português",
  sw: "Kiswahili",
  ar: "العربية",
};

export const localeDirections: Record<Locale, "ltr" | "rtl"> = {
  en: "ltr",
  fr: "ltr",
  es: "ltr",
  pt: "ltr",
  sw: "ltr",
  ar: "rtl",
};

export function isLocale(value: string): value is Locale {
  return locales.includes(value as Locale);
}

export function normalizeLocale(value?: string): Locale {
  return value && isLocale(value) ? value : defaultLocale;
}

export function stripLocaleFromPathname(pathname: string) {
  const parts = pathname.split("/");
  const maybeLocale = parts[1];

  if (isLocale(maybeLocale)) {
    const stripped = `/${parts.slice(2).join("/")}`.replace(/\/$/, "");
    return stripped || "/";
  }

  return pathname || "/";
}

export function localizePathname(pathname: string, locale: Locale) {
  const cleanPathname = stripLocaleFromPathname(pathname);
  if (locale === defaultLocale) {
    return cleanPathname;
  }

  return cleanPathname === "/" ? `/${locale}` : `/${locale}${cleanPathname}`;
}
