"use client";

import { FooterContent } from "@/components/footer-content";
import type { Locale } from "@/i18n/config";
import type { SiteSettingsRow } from "@/lib/team-data-loaders";

const DEFAULT_FOOTER_SETTINGS: SiteSettingsRow = {
  id: "default-footer-settings",
  club_name: "Tema Royals SC",
  short_name: "Royals",
  primary_color: "#31328f",
  accent_color: "#ffffff",
  stadium_name: "Tema Sports Stadium",
  contact_email: "contact@temaroyalssc.com",
  contact_phone: "+233 (0) 30 000 0000",
  registration_open: false,
  registration_password: null,
  created_at: new Date(0).toISOString(),
  updated_at: new Date(0).toISOString(),
};

export function Footer({
  settings = DEFAULT_FOOTER_SETTINGS,
  locale,
}: {
  settings?: SiteSettingsRow;
  locale?: Locale;
}) {
  return <FooterContent settings={settings} locale={locale} />;
}
