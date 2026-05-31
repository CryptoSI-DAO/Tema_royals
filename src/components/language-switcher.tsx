"use client";

import { Globe2 } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  defaultLocale,
  localeLabels,
  locales,
  localizePathname,
  normalizeLocale,
  type Locale,
} from "@/i18n/config";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

type LanguageSwitcherProps = {
  locale?: Locale;
  label?: string;
  compact?: boolean;
};

export function LanguageSwitcher({
  locale = defaultLocale,
  label = "Language",
  compact = false,
}: LanguageSwitcherProps) {
  const pathname = usePathname() || "/";
  const currentLocale = normalizeLocale(locale);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size={compact ? "icon" : "sm"}
          className="shrink-0 text-muted-foreground hover:text-accent-foreground"
          aria-label={label}
        >
          <Globe2 className={compact ? "h-5 w-5" : "mr-1.5 h-4 w-4"} />
          {!compact && <span>{localeLabels[currentLocale]}</span>}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {locales.map((nextLocale) => (
          <DropdownMenuItem key={nextLocale} asChild>
            <Link
              href={localizePathname(pathname, nextLocale)}
              className={nextLocale === currentLocale ? "font-semibold text-accent" : ""}
            >
              {localeLabels[nextLocale]}
            </Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
