import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowUpRight,
  ShieldCheck,
  Factory,
  MapPin,
  TreePine,
  Star,
  Award,
  Clock,
} from "lucide-react";
import heroBedroom from "@/assets/hero-bedroom.jpg";
import workshop1 from "@/assets/workshop-1.jpg";
import workshop2 from "@/assets/workshop-2.jpg";
import ref1 from "@/assets/reference-1.jpg";
import ref2 from "@/assets/reference-2.jpg";
import ref3 from "@/assets/reference-3.jpg";
import { BED_LIST } from "@/lib/bmb-data";
import { Reveal } from "@/components/site/reveal";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "BMB — Postele, které vydrží celý život" },
      { name: "description", content: "Poctivá česká výroba postelí z masivního buku a dubu. Doživotní záruka na masiv, více než 400 prodejců po celé ČR." },
      { property: "og:title", content: "BMB — Postele, které vydrží celý život" },
      { property: "og:description", content: "Poctivá česká výroba postelí z masivního buku a dubu. Doživotní záruka na masiv, více než 400 prodejců po celé ČR." },
    ],
  }),
  component: Home,
});

const VALUES = [
  { icon: ShieldCheck, title: "Doživotní záruka", text: "Na masivní dřevo" },
  { icon: Factory, title: "Česká výroba", text: "Vlastní továrna od 1992" },
  { icon: MapPin, title: "400+ prodejců", text: "Po celé ČR" },
  { icon: TreePine, title: "Masivní buk & dub", text: "Certifikovaná kvalita" },
];

function Home() {
  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={heroBedroom}
            alt="Ložnice s masivní dubovou postelí BMB"
            className="h-full w-full object-cover"
            width={1920}
            height={1280}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/10 to-background" />
        </div>

        <div className="container-bmb relative flex min-h-[92vh] flex-col justify-end pb-16 pt-32 sm:pb-24">
          <div className="max-w-3xl fade-up">
            <div className="inline-flex items-center gap-2 rounded-full border border-foreground/15 bg-background/70 px-4 py-1.5 text-xs font-medium tracking-tight text-foreground backdrop-blur-md">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              Český výrobce postelí od roku 1992
            </div>
            <h1 className="text-display mt-6 text-5xl leading-[0.98] sm:text-6xl lg:text-[5.5rem]">
              Postele, které
              <br />
              vydrží <span className="italic text-accent">celý život.</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-foreground/75">
              Poctivá česká výroba z masivního buku a dubu. Každý kus je
              ručně dokončen v naší továrně ve Ždánicích na Moravě —
              s doživotní zárukou.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-3">
              <Link
                to="/konfigurator"
                className="group inline-flex items-center gap-2 rounded-full bg-foreground px-7 py-4 text-sm font-medium text-background transition-all hover:bg-accent hover:text-accent-foreground"
              >
                Konfigurovat postel
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
              <Link
                to="/prodejci"
                className="inline-flex items-center gap-2 rounded-full border border-foreground/20 bg-background/70 px-7 py-4 text-sm font-medium text-foreground backdrop-blur-md transition-colors hover:border-foreground/40"
              >
                Najít prodejce
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* VALUES */}
      <section className="border-y border-border bg-background">
        <div className="container-bmb grid grid-cols-2 gap-px overflow-hidden lg:grid-cols-4">
          {VALUES.map((v, i) => (
            <Reveal
              key={v.title}
              delay={i * 80}
              className="group relative flex flex-col gap-4 bg-background p-8 lg:p-10"
            >
              <span className="pointer-events-none absolute inset-0 -z-10 bg-oak-soft/0 transition-colors duration-500 group-hover:bg-oak-soft/40" />
              <v.icon className="h-6 w-6 stroke-[1.5] text-accent" />
              <div>
                <div className="text-display text-2xl">{v.title}</div>
                <div className="mt-1 text-sm text-muted-foreground">{v.text}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* BESTSELLERS */}
      <section className="py-28 lg:py-40">
        <div className="container-bmb">
          <Reveal className="flex flex-wrap items-end justify-between gap-6">
            <div className="max-w-2xl">
              <div className="text-eyebrow text-accent">Kolekce 2026</div>
              <h2 className="text-display mt-4 text-4xl sm:text-5xl lg:text-6xl">
                Naše nejprodávanější postele
              </h2>
            </div>
            <Link
              to="/postele"
              className="group inline-flex items-center gap-2 text-sm font-medium tracking-tight text-foreground"
            >
              Zobrazit vše
              <span className="grid h-10 w-10 place-items-center rounded-full border border-border transition-all group-hover:border-foreground group-hover:bg-foreground group-hover:text-background">
                <ArrowUpRight className="h-4 w-4" />
              </span>
            </Link>
          </Reveal>

          <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {BED_LIST.map((bed, i) => (
              <Reveal key={bed.id} delay={i * 100}>
                <article className="group flex h-full flex-col overflow-hidden rounded-3xl border border-border bg-card transition-all duration-500 hover:-translate-y-1 hover:border-foreground/30 hover:shadow-[0_30px_60px_-30px_rgba(20,20,20,0.25)]">
                  <div className="relative aspect-[5/4] overflow-hidden bg-oak-soft/40">
                    <img
                      src={bed.image}
                      alt={bed.name}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105"
                    />
                    <div className="absolute left-5 top-5 rounded-full bg-background/85 px-3 py-1 text-[10px] font-medium tracking-[0.18em] backdrop-blur">
                      {bed.tagline.toUpperCase()}
                    </div>
                  </div>
                  <div className="flex flex-1 flex-col gap-6 p-8">
                    <div>
                      <h3 className="text-display text-3xl">{bed.name}</h3>
                      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                        {bed.description}
                      </p>
                    </div>
                    <ul className="flex flex-wrap gap-2">
                      {bed.highlights.map((h) => (
                        <li
                          key={h}
                          className="rounded-full border border-border px-3 py-1 text-xs text-foreground/70"
                        >
                          {h}
                        </li>
                      ))}
                    </ul>
                    <div className="mt-auto flex items-center justify-between border-t border-border pt-6">
                      <div className="text-xs text-muted-foreground">
                        Od <span className="text-foreground">{new Intl.NumberFormat("cs-CZ").format(bed.basePrice)} Kč</span>
                      </div>
                      <Link
                        to="/konfigurator"
                        search={{ bed: bed.id }}
                        className="group/btn inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-xs font-medium text-background transition-colors hover:bg-accent hover:text-accent-foreground"
                      >
                        Konfigurovat
                        <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
                      </Link>
                    </div>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* WORKSHOP STORY */}
      <section className="bg-oak-soft/30 py-28 lg:py-40">
        <div className="container-bmb grid gap-16 lg:grid-cols-[1fr_1.1fr] lg:items-center">
          <Reveal className="grid grid-cols-2 gap-4">
            <div className="overflow-hidden rounded-3xl">
              <img src={workshop1} alt="Ruční výroba" loading="lazy" className="h-full w-full object-cover" />
            </div>
            <div className="mt-16 overflow-hidden rounded-3xl">
              <img src={workshop2} alt="Sušárna masivu" loading="lazy" className="h-full w-full object-cover" />
            </div>
          </Reveal>
          <Reveal delay={120}>
            <div className="text-eyebrow text-accent">Vlastní výroba</div>
            <h2 className="text-display mt-4 text-4xl sm:text-5xl lg:text-6xl">
              Řemeslo, které
              <br /> nespěchá.
            </h2>
            <p className="mt-6 max-w-lg text-lg leading-relaxed text-muted-foreground">
              Každou postel vyrábíme v naší vlastní továrně na Moravě. Dřevo
              suší tři měsíce, spoje procházejí kontrolou po ruce, každý olej
              nanášíme ve třech vrstvách. Nespěcháme.
            </p>
            <div className="mt-10 grid grid-cols-2 gap-6 border-t border-border pt-8 sm:grid-cols-3">
              {[
                { n: "32+", t: "Let zkušeností" },
                { n: "400+", t: "Prodejců v ČR" },
                { n: "100%", t: "Česká výroba" },
              ].map((s) => (
                <div key={s.t}>
                  <div className="text-display text-4xl">{s.n}</div>
                  <div className="mt-1 text-xs uppercase tracking-widest text-muted-foreground">{s.t}</div>
                </div>
              ))}
            </div>
            <Link
              to="/proc-bmb"
              className="mt-10 inline-flex items-center gap-2 text-sm font-medium tracking-tight text-foreground"
            >
              Proč BMB
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </Reveal>
        </div>
      </section>

      {/* GUARANTEE BAND */}
      <section className="border-y border-border py-24">
        <div className="container-bmb grid gap-10 md:grid-cols-3">
          {[
            { icon: Award, title: "Certifikát Česká kvalita", text: "Nezávisle ověřená úroveň zpracování a materiálů." },
            { icon: Clock, title: "Doživotní záruka na masiv", text: "10 let záruka na modely v imitaci masivu." },
            { icon: TreePine, title: "Zakázková výroba", text: "Rozměr, materiál, povrch — každou postel děláme na míru." },
          ].map((f, i) => (
            <Reveal key={f.title} delay={i * 100}>
              <f.icon className="h-7 w-7 stroke-[1.4] text-accent" />
              <div className="text-display mt-6 text-2xl">{f.title}</div>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{f.text}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* REFERENCES */}
      <section className="py-28 lg:py-40">
        <div className="container-bmb">
          <Reveal className="max-w-2xl">
            <div className="text-eyebrow text-accent">Reference</div>
            <h2 className="text-display mt-4 text-4xl sm:text-5xl lg:text-6xl">
              V ložnicích, kde
              <br /> se dobře spí.
            </h2>
          </Reveal>

          <div className="mt-16 grid gap-6 md:grid-cols-3">
            {[
              { img: ref1, name: "Jana K., Praha", text: "Postel jsme pořídili před osmi lety. Dnes vypadá jako první den." },
              { img: ref2, name: "Petr N., Brno", text: "Konzultace, dodání, montáž — vše bez chybičky. Perfektní kvalita." },
              { img: ref3, name: "Rodina Dvořákových", text: "Modelu ELLA family využíváme každý den, úložný prostor je požehnání." },
            ].map((r, i) => (
              <Reveal key={i} delay={i * 100}>
                <figure className="group overflow-hidden rounded-3xl border border-border bg-card">
                  <div className="aspect-[4/5] overflow-hidden">
                    <img
                      src={r.img}
                      alt=""
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105"
                    />
                  </div>
                  <figcaption className="space-y-3 p-6">
                    <div className="flex gap-0.5 text-accent">
                      {Array.from({ length: 5 }).map((_, k) => (
                        <Star key={k} className="h-3.5 w-3.5 fill-current" />
                      ))}
                    </div>
                    <p className="text-sm leading-relaxed text-foreground">"{r.text}"</p>
                    <div className="text-xs uppercase tracking-widest text-muted-foreground">{r.name}</div>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="pb-28">
        <div className="container-bmb">
          <Reveal>
            <div className="relative overflow-hidden rounded-[2rem] bg-ink px-8 py-20 text-background sm:px-16 sm:py-28">
              <div className="absolute -right-20 -top-20 h-96 w-96 rounded-full bg-accent/20 blur-3xl" />
              <div className="relative flex flex-col items-start gap-8 md:flex-row md:items-end md:justify-between">
                <div className="max-w-2xl">
                  <div className="text-eyebrow text-accent">Vaše postel na míru</div>
                  <h2 className="text-display mt-4 text-4xl leading-[1.02] sm:text-5xl lg:text-6xl">
                    Postavte si postel, která vás přežije.
                  </h2>
                </div>
                <Link
                  to="/konfigurator"
                  className="group inline-flex items-center gap-2 rounded-full bg-background px-7 py-4 text-sm font-medium text-foreground transition-all hover:bg-accent hover:text-accent-foreground"
                >
                  Spustit konfigurátor
                  <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
