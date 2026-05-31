import { ContactPageContent } from "@/components/public-pages";
import { normalizeLocale } from "@/i18n/config";

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return <ContactPageContent locale={normalizeLocale(locale)} />;
}
