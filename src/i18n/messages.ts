import en from "../../messages/en.json";
import fr from "../../messages/fr.json";
import es from "../../messages/es.json";
import pt from "../../messages/pt.json";
import sw from "../../messages/sw.json";
import ar from "../../messages/ar.json";
import { defaultLocale, type Locale } from "@/i18n/config";

const allMessages = { en, fr, es, pt, sw, ar } as const;

type MessageTree = Record<string, unknown>;

function getNestedValue(tree: MessageTree, key: string): unknown {
  return key.split(".").reduce<unknown>((current, part) => {
    if (current && typeof current === "object" && part in current) {
      return (current as MessageTree)[part];
    }
    return undefined;
  }, tree);
}

export function getMessages(locale: Locale) {
  return allMessages[locale] ?? allMessages[defaultLocale];
}

export function createTranslator(locale: Locale) {
  const messages = getMessages(locale) as MessageTree;
  const fallback = getMessages(defaultLocale) as MessageTree;

  return (key: string, values?: Record<string, string | number>) => {
    const raw = getNestedValue(messages, key) ?? getNestedValue(fallback, key) ?? key;
    const text = String(raw);

    if (!values) {
      return text;
    }

    return Object.entries(values).reduce(
      (result, [name, value]) => result.replaceAll(`{${name}}`, String(value)),
      text
    );
  };
}
