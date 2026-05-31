import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CalendarDays, Clock3, Globe, Info, Mail, MapPin, Phone, Send, ShieldCheck, ShoppingCart, Ticket, TrendingUp, Users } from "lucide-react";
import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { defaultLocale, localizePathname, type Locale } from "@/i18n/config";
import { createTranslator, getMessages } from "@/i18n/messages";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { getFixtures, getPlayers, getSiteSettings, getStaff } from "@/lib/team-data-loaders";

type PublicPageProps = { locale?: Locale };

export function HomePage({ locale = defaultLocale }: PublicPageProps) {
  const t = createTranslator(locale);
  const stadiumImg = PlaceHolderImages.find((img) => img.id === "hero-stadium");

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar locale={locale} />
      <main className="flex-1">
        <section className="relative min-h-[76vh] overflow-hidden">
          <Image src={stadiumImg?.imageUrl || ""} alt={stadiumImg?.description || "Stadium"} fill priority className="object-cover opacity-75" />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/70 to-background/10 rtl:bg-gradient-to-l" />
          <div className="relative z-10 flex min-h-[76vh] items-center px-6 sm:px-10 lg:px-20">
            <div className="max-w-4xl text-left rtl:text-right">
              <Badge className="mb-4 bg-white text-primary">{t("home.badge")}</Badge>
              <h1 className="mb-6 text-4xl font-black uppercase leading-tight tracking-tight sm:text-7xl lg:text-8xl">{t("home.title")}</h1>
              <p className="mb-8 max-w-xl text-base font-semibold leading-7 sm:text-xl">{t("home.intro")}</p>
              <div className="flex flex-col gap-4 sm:flex-row">
                <Link href={localizePathname("/tickets", locale)}><Button size="lg" className="w-full bg-primary font-bold text-white sm:w-auto">{t("home.tickets")}</Button></Link>
                <Link href={localizePathname("/players", locale)}><Button size="lg" variant="outline" className="w-full border-accent text-accent sm:w-auto">{t("home.squad")}</Button></Link>
              </div>
            </div>
          </div>
        </section>

        <section className="container mx-auto grid gap-8 px-4 py-14 lg:grid-cols-2">
          <Card className="overflow-hidden border-accent/20 bg-card">
            <CardHeader>
              <div className="flex items-center justify-between gap-3">
                <CardTitle className="uppercase">{t("home.latestResult")}</CardTitle>
                <Badge variant="outline">{t("home.leagueMatch")}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="mb-6 flex items-center justify-center gap-6 rounded-xl bg-primary/15 p-8">
                <span className="font-black">ROYALS</span>
                <span className="text-5xl font-black">3<span className="px-3 text-accent">-</span>1</span>
                <span className="font-black">ACCRA LIONS B</span>
              </div>
              <h2 className="mb-2 text-2xl font-black uppercase">{t("home.resultTitle")}</h2>
              <p className="text-sm leading-6 text-muted-foreground">{t("home.lastMatchReport")}</p>
            </CardContent>
          </Card>
          <Card className="border-primary/20 bg-card">
            <CardHeader>
              <div className="flex items-center justify-between gap-3">
                <CardTitle className="uppercase">{t("home.nextFixture")}</CardTitle>
                <Link href={localizePathname("/tickets", locale)} className="inline-flex items-center gap-1 text-sm font-bold uppercase text-accent">
                  {t("home.ticketsAvailable")} <ArrowRight className="h-4 w-4 rtl:rotate-180" />
                </Link>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3"><CalendarDays className="h-5 w-5 text-accent" /><span>{t("home.upcomingDate")}</span></div>
              <div className="flex items-center gap-3"><MapPin className="h-5 w-5 text-accent" /><span>Ashaiman Community Park</span></div>
              <h2 className="text-2xl font-black uppercase">{t("home.upcomingTitle")}</h2>
              <p className="text-sm leading-6 text-muted-foreground">{t("home.upcomingInfo")}</p>
            </CardContent>
          </Card>
        </section>

        <section className="container mx-auto px-4 py-14">
          <div className="mb-8 text-center sm:text-left rtl:sm:text-right">
            <h2 className="text-3xl font-black uppercase">{t("home.connected")}</h2>
            <p className="text-muted-foreground">{t("home.connectedCopy")}</p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {["FACEBOOK", "INSTAGRAM", "TWITTER / X"].map((name) => (
              <Card key={name} className="border-accent/10 bg-card/60">
                <CardHeader><CardTitle>{name}</CardTitle></CardHeader>
                <CardContent className="flex h-36 items-center justify-center text-sm italic text-muted-foreground">{t("home.feedSoon")}</CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="bg-primary/10 py-16">
          <div className="container mx-auto grid gap-6 px-4 md:grid-cols-3">
            <PromoTile href="/merch" locale={locale} title={t("home.shop")} copy={t("home.shopCopy")} />
            <PromoTile href="/players" locale={locale} title={t("home.meetSquad")} copy={t("home.meetSquadCopy")} />
            <PromoTile href="/partnership" locale={locale} title={t("home.partnerships")} copy={t("home.partnershipsCopy")} />
          </div>
        </section>
      </main>
      <Footer locale={locale} />
    </div>
  );
}

function PromoTile({ href, locale, title, copy }: { href: string; locale: Locale; title: string; copy: string }) {
  return (
    <Link href={localizePathname(href, locale)} className="group block rounded-lg border border-accent/20 bg-card p-6 transition hover:border-accent/50">
      <h3 className="text-2xl font-black uppercase">{title}</h3>
      <p className="mt-2 flex items-center gap-2 text-sm font-semibold uppercase text-accent">{copy} <ArrowRight className="h-4 w-4 rtl:rotate-180" /></p>
    </Link>
  );
}

export async function PlayersPageContent({ locale = defaultLocale }: PublicPageProps) {
  const t = createTranslator(locale);
  const [players, settings] = await Promise.all([getPlayers(), getSiteSettings()]);

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar locale={locale} />
      <main className="flex-1 py-16">
        <div className="container mx-auto px-4">
          <PageIntro title={t("players.title")} copy={t("players.intro")} />
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {players.map((player, index) => (
              <Card key={player.id} className="group overflow-hidden border-accent/10 bg-card">
                <div className="relative aspect-[4/5]">
                  <Image src={player.imageUrl || "https://picsum.photos/seed/player-fallback/400/500"} alt={player.name} fill sizes="(min-width: 1024px) 33vw, 100vw" className="object-cover grayscale transition-all duration-500 group-hover:grayscale-0" />
                  <span className="absolute left-4 top-4 text-6xl font-black italic text-white/20 rtl:left-auto rtl:right-4">{String(index + 1).padStart(2, "0")}</span>
                  {player.squadNumber && <span className="absolute right-4 top-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/80 text-2xl font-black text-accent rtl:left-4 rtl:right-auto">{player.squadNumber}</span>}
                </div>
                <CardHeader>
                  <div className="mb-2 flex items-start justify-between gap-3">
                    <h3 className="break-words text-2xl font-bold">{player.name}</h3>
                    <Badge>{player.pos}</Badge>
                  </div>
                  <CardContent className="space-y-1 p-0 text-sm text-muted-foreground">
                    <div className="flex flex-wrap gap-x-3 gap-y-1">
                      {player.secondPos && <span>{player.secondPos} {t("players.option")}</span>}
                      {player.heightCm && <span>{player.heightCm}cm</span>}
                      {player.weightKg && <span>{player.weightKg}kg</span>}
                      {player.foot && <span>{player.foot} {t("players.foot")}</span>}
                    </div>
                    {player.nationality && <div className="text-xs">{player.nationality}</div>}
                    {player.bio && <p className="mt-2 line-clamp-2 text-xs leading-relaxed">{player.bio}</p>}
                  </CardContent>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </main>
      <Footer settings={settings} locale={locale} />
    </div>
  );
}

export async function StaffPageContent({ locale = defaultLocale }: PublicPageProps) {
  const t = createTranslator(locale);
  const [staff, settings] = await Promise.all([getStaff(), getSiteSettings()]);

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar locale={locale} />
      <main className="flex-1 py-16">
        <div className="container mx-auto px-4">
          <PageIntro title={t("staff.title")} copy={t("staff.intro")} />
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {staff.map((member) => (
              <Card key={member.id} className="overflow-hidden border-primary/20 bg-card">
                <div className="relative aspect-square">
                  <Image src={member.imageUrl || "https://picsum.photos/seed/staff-fallback/400/500"} alt={member.name} fill sizes="(min-width: 1024px) 25vw, 100vw" className="object-cover opacity-80" />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold">{member.name}</h3>
                  <p className="mb-3 text-sm font-semibold text-accent">{member.role}</p>
                  <p className="text-sm text-muted-foreground">{member.bio}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </main>
      <Footer settings={settings} locale={locale} />
    </div>
  );
}

export async function FixturesPageContent({ locale = defaultLocale }: PublicPageProps) {
  const t = createTranslator(locale);
  const [fixtures, settings] = await Promise.all([getFixtures(), getSiteSettings()]);
  const upcoming = fixtures.filter((fixture) => fixture.status === "upcoming");
  const completed = fixtures.filter((fixture) => fixture.status === "completed");

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar locale={locale} />
      <main className="flex-1">
        <section className="border-b border-accent/10 bg-primary/10">
          <div className="container mx-auto px-4 py-16 lg:py-24">
            <Badge className="mb-4 bg-accent/10 text-accent">{t("fixtures.badge")}</Badge>
            <h1 className="text-4xl font-black uppercase tracking-tight sm:text-6xl">{t("fixtures.title")}</h1>
            <p className="mt-4 max-w-2xl text-muted-foreground">{t("fixtures.intro")}</p>
          </div>
        </section>
        <section className="container mx-auto grid gap-10 px-4 py-14 xl:grid-cols-[1.1fr_0.9fr]">
          <FixtureList title={t("fixtures.upcomingFixtures")} copy={t("fixtures.upcomingCopy")} fixtures={upcoming} t={t} upcoming />
          <FixtureList title={t("fixtures.recentResults")} copy={t("fixtures.recentCopy")} fixtures={completed} t={t} />
        </section>
      </main>
      <Footer settings={settings} locale={locale} />
    </div>
  );
}

function FixtureList({ title, copy, fixtures, t, upcoming = false }: { title: string; copy: string; fixtures: Awaited<ReturnType<typeof getFixtures>>; t: ReturnType<typeof createTranslator>; upcoming?: boolean }) {
  return (
    <div className="space-y-6">
      <div><h2 className="text-3xl font-black">{title}</h2><p className="mt-2 text-sm text-muted-foreground">{copy}</p></div>
      <div className="space-y-4">
        {fixtures.map((fixture) => (
          <Card key={fixture.id} className="border-accent/20 bg-card/80">
            <CardContent className="space-y-4 p-6">
              <Badge variant="outline">{upcoming ? t("fixtures.upcoming") : t("fixtures.final")}</Badge>
              <h3 className="text-xl font-black uppercase">{t("fixtures.royalsVs", { opponent: fixture.opponent })}</h3>
              <div className="grid gap-3 text-sm text-muted-foreground sm:grid-cols-2">
                <span className="flex items-center gap-2"><CalendarDays className="h-4 w-4 text-accent" />{fixture.date}</span>
                <span className="flex items-center gap-2"><Clock3 className="h-4 w-4 text-accent" />{fixture.time}</span>
                <span className="flex items-center gap-2"><MapPin className="h-4 w-4 text-accent" />{fixture.venue}</span>
                {fixture.result && <span className="font-black text-foreground">{fixture.result.marinersScore} - {fixture.result.opponentScore}</span>}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export function TicketsPageContent({ locale = defaultLocale }: PublicPageProps) {
  const t = createTranslator(locale);
  const categories = [
    { name: t("ticketsPage.general"), price: "$35", perks: tArray(locale, "ticketsPage.generalPerks") },
    { name: t("ticketsPage.premium"), price: "$75", perks: tArray(locale, "ticketsPage.premiumPerks") },
    { name: t("ticketsPage.family"), price: "$100", perks: tArray(locale, "ticketsPage.familyPerks") },
  ];

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar locale={locale} />
      <main className="flex-1 py-16">
        <div className="container mx-auto px-4">
          <PageIntro title={t("ticketsPage.title")} copy={t("ticketsPage.intro")} />
          <div className="mb-16 grid gap-8 lg:grid-cols-3">
            {categories.map((cat) => (
              <Card key={cat.name} className="border-accent/20 bg-card">
                <CardHeader><CardTitle>{cat.name}</CardTitle><CardDescription className="text-4xl font-black text-accent">{cat.price}</CardDescription></CardHeader>
                <CardContent>
                  <ul className="mb-8 space-y-3">{cat.perks.map((perk) => <li key={perk} className="flex items-center gap-2 text-sm text-muted-foreground"><Info className="h-4 w-4 text-accent" />{perk}</li>)}</ul>
                  <Button className="w-full bg-primary font-bold">{t("ticketsPage.select")}</Button>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="grid gap-8 md:grid-cols-2">
            <InfoCard icon={MapPin} title={t("ticketsPage.stadiumInfo")} lines={["Tema Sports Stadium", t("ticketsPage.capacity"), t("ticketsPage.gates"), t("ticketsPage.parking")]} />
            <Card className="border-accent/20 bg-primary/10"><CardHeader><Ticket className="mb-2 h-8 w-8 text-accent" /><CardTitle>{t("ticketsPage.season")}</CardTitle></CardHeader><CardContent><p className="mb-4 text-muted-foreground">{t("ticketsPage.seasonCopy")}</p><Button variant="outline" className="border-accent text-accent">{t("common.learnMore")}</Button></CardContent></Card>
          </div>
        </div>
      </main>
      <Footer locale={locale} />
    </div>
  );
}

export function MerchPageContent({ locale = defaultLocale }: PublicPageProps) {
  const t = createTranslator(locale);
  const products = [
    { id: 1, name: t("merchPage.jersey"), price: "$30.00", cat: t("merchPage.jerseys"), image: "/TemaRoyalsJersey.png" },
    { id: 2, name: t("merchPage.cap"), price: "$15.00", cat: t("merchPage.accessories"), image: "/temaroyalscap.png" },
    { id: 3, name: t("merchPage.awayKit"), price: "$30.00", cat: t("merchPage.jerseys"), image: "/TemaRoyalsAwaykit.png" },
  ];

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar locale={locale} />
      <main className="flex-1 py-16">
        <div className="container mx-auto px-4">
          <div className="mb-12"><h1 className="text-4xl font-black uppercase sm:text-6xl">{t("merchPage.title")}</h1><p className="mt-3 text-muted-foreground">{t("merchPage.intro")}</p></div>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <Card key={product.id} className="group overflow-hidden border-accent/10 bg-card">
                <div className="relative aspect-square bg-muted">
                  <Image src={product.image} alt={product.name} fill className="object-contain p-6 transition-transform duration-500 group-hover:scale-105" />
                  <Button size="icon" className="absolute right-4 top-4 rounded-full bg-accent text-accent-foreground rtl:left-4 rtl:right-auto"><ShoppingCart className="h-4 w-4" /></Button>
                </div>
                <div className="p-6"><p className="mb-1 text-xs font-bold uppercase tracking-widest text-accent">{product.cat}</p><h3 className="mb-2 text-xl font-bold">{product.name}</h3><p className="text-2xl font-black">{product.price}</p><Button className="mt-6 w-full bg-primary font-bold">{t("merchPage.add")}</Button></div>
              </Card>
            ))}
          </div>
        </div>
      </main>
      <Footer locale={locale} />
    </div>
  );
}

export function PartnershipPageContent({ locale = defaultLocale }: PublicPageProps) {
  const t = createTranslator(locale);
  const features = [
    { icon: Users, title: t("partnership.community"), copy: t("partnership.communityCopy") },
    { icon: Globe, title: t("partnership.global"), copy: t("partnership.globalCopy") },
    { icon: TrendingUp, title: t("partnership.growth"), copy: t("partnership.growthCopy") },
    { icon: ShieldCheck, title: t("partnership.brand"), copy: t("partnership.brandCopy") },
  ];

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar locale={locale} />
      <main className="flex-1 py-16">
        <div className="container mx-auto px-4">
          <PageIntro title={t("partnership.title")} copy={t("partnership.intro")} />
          <section className="mb-20 grid gap-12 lg:grid-cols-2">
            <div><h2 className="mb-6 text-3xl font-black uppercase">{t("partnership.why")}</h2><p className="mb-8 text-muted-foreground">{t("partnership.whyCopy")}</p><div className="grid grid-cols-2 gap-6">{features.map((item) => <div key={item.title}><div className="mb-2 flex items-center gap-2 text-accent"><item.icon className="h-5 w-5" /><span className="text-sm font-bold uppercase">{item.title}</span></div><p className="text-xs text-muted-foreground">{item.copy}</p></div>)}</div></div>
            <Card className="border-accent/20 bg-card p-8 text-center"><CardTitle>{t("partnership.mediaKit")}</CardTitle><CardDescription className="my-4">{t("partnership.mediaKitCopy")}</CardDescription><Button className="bg-accent text-accent-foreground">{t("partnership.download")}</Button></Card>
          </section>
          <section className="rounded-lg border border-accent/20 bg-primary/20 p-8 text-center"><h2 className="mb-4 text-3xl font-black uppercase">{t("partnership.ready")}</h2><p className="mx-auto mb-8 max-w-xl text-muted-foreground">{t("partnership.readyCopy")}</p><Link href={localizePathname("/contact", locale)}><Button size="lg" className="bg-accent text-accent-foreground">{t("partnership.contactTeam")}</Button></Link></section>
        </div>
      </main>
      <Footer locale={locale} />
    </div>
  );
}

export async function ContactPageContent({ locale = defaultLocale }: PublicPageProps) {
  const t = createTranslator(locale);
  const settings = await getSiteSettings();
  const clubName = settings.club_name || "Tema Royals SC";
  const contactEmail = settings.contact_email || "contact@temaroyalssc.com";
  const contactPhone = settings.contact_phone || "+233 (0) 30 000 0000";
  const stadiumName = settings.stadium_name || "Tema Sports Stadium";

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar locale={locale} />
      <main className="flex-1 py-16">
        <div className="container mx-auto px-4">
          <PageIntro title={t("contactPage.title")} copy={t("contactPage.intro", { clubName })} />
          <div className="grid gap-12 lg:grid-cols-2">
            <Card className="border-primary/20 bg-card p-4 sm:p-6">
              <CardHeader className="px-0 pt-0"><CardTitle>{t("contactPage.sendMessage")}</CardTitle></CardHeader>
              <CardContent className="space-y-4 px-0">
                <div className="grid gap-4 sm:grid-cols-2"><Field label={t("contactPage.name")} placeholder={t("contactPage.namePlaceholder")} /><Field label={t("contactPage.email")} placeholder={t("contactPage.emailPlaceholder")} type="email" /></div>
                <Field label={t("contactPage.subject")} placeholder={t("contactPage.subjectPlaceholder")} />
                <div className="space-y-2"><label className="text-sm font-medium">{t("contactPage.message")}</label><Textarea placeholder={t("contactPage.messagePlaceholder")} className="min-h-[150px] bg-background" /></div>
                <Button className="h-12 w-full bg-accent font-bold text-accent-foreground"><Send className="mr-2 h-4 w-4 rtl:ml-2 rtl:mr-0" />{t("contactPage.send")}</Button>
              </CardContent>
            </Card>
            <div className="space-y-8">
              <h2 className="text-2xl font-bold uppercase">{t("contactPage.direct")}</h2>
              <ContactRow icon={Mail} title={t("contactPage.emailUs")} lines={[`${t("contactPage.general")}: ${contactEmail}`, `${t("contactPage.press")}: media@temaroyalssc.com`]} />
              <ContactRow icon={Phone} title={t("contactPage.callUs")} lines={[contactPhone, t("contactPage.hours")]} />
              <ContactRow icon={MapPin} title={t("contactPage.visitUs")} lines={[`${stadiumName} ${t("contactPage.office")}`, "Tema, Greater Accra"]} />
              <div className="rounded-lg border border-accent/20 bg-accent/5 p-6"><h3 className="mb-2 font-bold">{t("contactPage.supportHours")}</h3><p className="text-sm text-muted-foreground">{t("contactPage.supportCopy")}</p></div>
            </div>
          </div>
        </div>
      </main>
      <Footer settings={settings} locale={locale} />
    </div>
  );
}

function PageIntro({ title, copy }: { title: string; copy: string }) {
  return <div className="mx-auto mb-12 max-w-4xl text-center"><h1 className="mb-4 text-4xl font-black uppercase tracking-tight sm:text-6xl">{title}</h1><p className="mx-auto max-w-2xl text-muted-foreground sm:text-lg">{copy}</p></div>;
}

function InfoCard({ icon: Icon, title, lines }: { icon: typeof MapPin; title: string; lines: string[] }) {
  return <Card className="border-accent/20 bg-primary/10"><CardHeader><Icon className="mb-2 h-8 w-8 text-accent" /><CardTitle>{title}</CardTitle></CardHeader><CardContent className="space-y-2 text-muted-foreground">{lines.map((line) => <p key={line}>{line}</p>)}</CardContent></Card>;
}

function ContactRow({ icon: Icon, title, lines }: { icon: typeof Mail; title: string; lines: string[] }) {
  return <div className="flex items-start gap-4"><div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/20"><Icon className="h-5 w-5 text-accent" /></div><div><p className="font-bold">{title}</p>{lines.map((line) => <p key={line} className="break-all text-sm text-muted-foreground">{line}</p>)}</div></div>;
}

function Field({ label, placeholder, type = "text" }: { label: string; placeholder: string; type?: string }) {
  return <div className="space-y-2"><label className="text-sm font-medium">{label}</label><Input type={type} placeholder={placeholder} className="bg-background" /></div>;
}

function tArray(locale: Locale, key: "ticketsPage.generalPerks" | "ticketsPage.premiumPerks" | "ticketsPage.familyPerks") {
  const messages = getMessages(locale) as unknown as Record<string, { [key: string]: string[] }>;
  const [namespace, name] = key.split(".");
  return messages[namespace]?.[name] ?? [];
}
