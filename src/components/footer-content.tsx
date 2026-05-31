"use client";

import Image from "next/image";
import { Facebook, Instagram, Twitter, Youtube, LogIn, UserPlus } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { useAuthState } from "@/hooks/use-auth-state";
import { LanguageSwitcher } from "@/components/language-switcher";
import { createTranslator } from "@/i18n/messages";
import { defaultLocale, isLocale, localizePathname, type Locale } from "@/i18n/config";
import type { SiteSettingsRow } from "@/lib/team-data-loaders";

type FooterContentProps = {
  settings: SiteSettingsRow;
  locale?: Locale;
};

export function FooterContent({ settings, locale }: FooterContentProps) {
  const [year, setYear] = useState<number | null>(null);
  const pathname = usePathname();
  const isLoggedIn = useAuthState();
  const clubName = settings.club_name || "Tema Royals SC";
  const pathLocale = pathname?.split("/")[1];
  const currentLocale = locale ?? (pathLocale && isLocale(pathLocale) ? pathLocale : defaultLocale);
  const t = createTranslator(currentLocale);

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  return (
    <footer className="w-full border-t bg-card mt-auto">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="flex flex-col space-y-4">
            <Link href={localizePathname("/", currentLocale)} className="flex items-center space-x-2">
              <Image
                src="/temaroyalslogo.jpg"
                alt="Tema Royals Sporting Club logo"
                width={40}
                height={40}
                className="h-10 w-10 rounded-full bg-white object-contain p-0.5 ring-1 ring-primary/20"
              />
              <span className="text-lg font-bold tracking-tighter">{clubName.toUpperCase()}</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              {t("footer.summary", { clubName })}
            </p>
            <div className="flex space-x-4">
              <Link href="#" className="text-muted-foreground hover:text-accent">
                <Twitter className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-accent">
                <Facebook className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-accent">
                <Instagram className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-accent">
                <Youtube className="h-5 w-5" />
              </Link>
            </div>
          </div>
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider">{t("footer.club")}</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href={localizePathname("/fixtures", currentLocale)} className="hover:text-accent">{t("footer.fixtures")}</Link></li>
              <li><Link href={localizePathname("/players", currentLocale)} className="hover:text-accent">{t("footer.firstTeam")}</Link></li>
              <li><Link href={localizePathname("/staff", currentLocale)} className="hover:text-accent">{t("footer.management")}</Link></li>
              <li><Link href={localizePathname("/partnership", currentLocale)} className="hover:text-accent">{t("footer.partners")}</Link></li>
              <li><Link href="/dashboard" className="hover:text-accent">Dashboard</Link></li>
              {!isLoggedIn && (
                <>
                  <li>
                    <Link href={localizePathname("/register", currentLocale)} className="inline-flex items-center gap-1.5 hover:text-accent">
                      <UserPlus className="h-3.5 w-3.5" />
                      {t("footer.register")}
                    </Link>
                  </li>
                  <li>
                    <Link href={localizePathname("/login", currentLocale)} className="inline-flex items-center gap-1.5 hover:text-accent">
                      <LogIn className="h-3.5 w-3.5" />
                      {t("footer.login")}
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider">{t("footer.fanZone")}</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href={localizePathname("/tickets", currentLocale)} className="hover:text-accent">{t("footer.buyTickets")}</Link></li>
              <li><Link href={localizePathname("/merch", currentLocale)} className="hover:text-accent">{t("footer.shopMerch")}</Link></li>
              <li><Link href={localizePathname("/contact", currentLocale)} className="hover:text-accent">{t("footer.support")}</Link></li>
              <li><Link href="#" className="hover:text-accent">{t("footer.membership")}</Link></li>
              {settings.registration_open && (
                <li>
                  <Link
                    href={localizePathname("/register", currentLocale)}
                    className="inline-flex items-center gap-1.5 text-accent font-semibold hover:text-accent/80"
                  >
                    <UserPlus className="h-3.5 w-3.5" />
                    {t("footer.playerRegistration")}
                  </Link>
                </li>
              )}
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider">{t("footer.contact")}</h3>
            <address className="not-italic space-y-2 text-sm text-muted-foreground">
              <p>{settings.stadium_name || "Tema Sports Stadium"}</p>
              <p>Tema, Greater Accra</p>
              <p>{t("footer.phone")}: {settings.contact_phone || "+233 (0) 30 000 0000"}</p>
              <p>{t("footer.email")}: {settings.contact_email || "contact@temaroyalssc.com"}</p>
            </address>
            <div className="mt-4">
              <LanguageSwitcher locale={currentLocale} label={t("common.language")} />
            </div>
          </div>
        </div>
        <div className="mt-12 flex flex-col items-center justify-between gap-5 border-t pt-8 text-center text-xs text-muted-foreground sm:flex-row sm:text-left">
          <p>© {year || "..."} {clubName}. {t("footer.rights")}</p>
          <Link
            href="https://webarastudio.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Visit Webara Studio"
            className="group relative block h-14 w-14 shrink-0 overflow-hidden rounded-lg ring-1 ring-border transition hover:scale-105 hover:ring-accent/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            <Image
              src="/webarabadge.png"
              alt="Built with love by Webara"
              width={56}
              height={56}
              className="h-full w-full object-cover transition-opacity duration-200 group-hover:opacity-0"
            />
            <Image
              src="/webarabadgelight.png"
              alt=""
              width={56}
              height={56}
              aria-hidden="true"
              className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-200 group-hover:opacity-100"
            />
          </Link>
        </div>
      </div>
    </footer>
  );
}
