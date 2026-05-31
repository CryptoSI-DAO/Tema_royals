"use client";

import { useEffect } from "react";
import { localeDirections, type Locale } from "@/i18n/config";

export function DocumentLocaleSync({ locale }: { locale: Locale }) {
  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = localeDirections[locale];
  }, [locale]);

  return null;
}
