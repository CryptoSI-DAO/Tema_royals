"use client";

import { FooterContent } from "@/components/footer-content";
import type { SiteSettingsRow } from "@/lib/team-data-loaders";

const DEFAULT_FOOTER_SETTINGS: SiteSettingsRow = {
  id: "default-footer-settings",
  club_name: "Tema Royals FC",
  short_name: "Royals",
  primary_color: "#31328f",
  accent_color: "#ffffff",
  stadium_name: "Tema Sports Stadium",
  contact_email: "contact@temaroyalsfc.com",
  contact_phone: "+233 (0) 30 000 0000",
  registration_open: false,
  registration_password: null,
  created_at: new Date(0).toISOString(),
  updated_at: new Date(0).toISOString(),
};

export function Footer({ settings = DEFAULT_FOOTER_SETTINGS }: { settings?: SiteSettingsRow }) {
  return <FooterContent settings={settings} />;
}
