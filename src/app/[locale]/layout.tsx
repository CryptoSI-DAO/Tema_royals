import { NextIntlClientProvider } from "next-intl";
import { notFound } from "next/navigation";
import { DocumentLocaleSync } from "@/components/document-locale-sync";
import { isLocale, localeDirections, type Locale } from "@/i18n/config";

export function generateStaticParams() {
  return [{ locale: "fr" }, { locale: "es" }, { locale: "pt" }, { locale: "sw" }, { locale: "ar" }];
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;

  if (!isLocale(rawLocale) || rawLocale === "en") {
    notFound();
  }

  const locale = rawLocale as Locale;

  return (
    <NextIntlClientProvider>
      <DocumentLocaleSync locale={locale} />
      <div lang={locale} dir={localeDirections[locale]}>
        {children}
      </div>
    </NextIntlClientProvider>
  );
}
