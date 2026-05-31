"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { CalendarDays, Menu, X, ShoppingBag, Ticket, Users, Phone, ShieldCheck, LogOut } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { DocumentLocaleSync } from "@/components/document-locale-sync";
import { LanguageSwitcher } from "@/components/language-switcher";
import { createTranslator } from "@/i18n/messages";
import { defaultLocale, isLocale, localizePathname, type Locale } from "@/i18n/config";
import { createClient } from "@/lib/supabase/client";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import { useAuthState } from "@/hooks/use-auth-state";

export function Navbar({ locale }: { locale?: Locale }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const isLoggedIn = useAuthState();
  const pathLocale = pathname?.split("/")[1];
  const currentLocale = locale ?? (pathLocale && isLocale(pathLocale) ? pathLocale : defaultLocale);
  const t = createTranslator(currentLocale);

  async function handleLogout() {
    if (!hasSupabaseEnv()) return;
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
      setIsOpen(false);
      router.replace(localizePathname("/", currentLocale));
    } catch (error) {
      console.error("Logout failed:", error);
    }
  }

  const navItems = [
    { name: t("nav.players"), href: localizePathname("/players", currentLocale), icon: Users },
    { name: t("nav.staff"), href: localizePathname("/staff", currentLocale), icon: ShieldCheck },
    { name: t("nav.fixtures"), href: localizePathname("/fixtures", currentLocale), icon: CalendarDays },
    { name: t("nav.tickets"), href: localizePathname("/tickets", currentLocale), icon: Ticket },
    { name: t("nav.merch"), href: localizePathname("/merch", currentLocale), icon: ShoppingBag },
    { name: t("nav.partnership"), href: localizePathname("/partnership", currentLocale), icon: ShieldCheck },
    { name: t("nav.contact"), href: localizePathname("/contact", currentLocale), icon: Phone },
  ];

  return (
    <>
      <DocumentLocaleSync locale={currentLocale} />
      <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href={localizePathname("/", currentLocale)} className="flex items-center gap-3">
              <Image
                src="/temaroyalslogo.jpg"
                alt="Tema Royals Sporting Club logo"
                width={44}
                height={44}
                className="h-11 w-11 rounded-full bg-white object-contain p-0.5 ring-1 ring-primary/20"
                priority
              />
              <span className="hidden text-lg font-black leading-none tracking-tight text-foreground sm:inline-block">
                TEMA <span className="text-primary">ROYALS</span>
                <span className="mt-0.5 block text-[10px] font-bold tracking-[0.2em] text-muted-foreground">
                  SPORTING CLUB
                </span>
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
                >
                  {item.name}
                </Link>
              ))}
              {isLoggedIn && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
                >
                  <LogOut className="mr-1.5 h-4 w-4" />
                  {t("nav.logout")}
                </Button>
              )}
              <LanguageSwitcher locale={currentLocale} label={t("common.language")} />
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center gap-1 lg:hidden">
            <LanguageSwitcher locale={currentLocale} label={t("common.language")} compact />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center rounded-md p-2 text-muted-foreground"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="lg:hidden border-t bg-card animate-in slide-in-from-top-2">
          <div className="space-y-1 px-2 pb-3 pt-2">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className="flex items-center space-x-3 rounded-md px-3 py-2 text-base font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              >
                <item.icon className="h-5 w-5" />
                <span>{item.name}</span>
              </Link>
            ))}
            {isLoggedIn && (
              <button
                onClick={handleLogout}
                className="flex w-full items-center space-x-3 rounded-md px-3 py-2 text-base font-medium text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
              >
                <LogOut className="h-5 w-5" />
                <span>{t("nav.logout")}</span>
              </button>
            )}
          </div>
          </div>
        )}
      </nav>
    </>
  );
}
