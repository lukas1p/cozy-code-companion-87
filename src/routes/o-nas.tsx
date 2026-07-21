import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import workshop1 from "@/assets/workshop-1.jpg";
import workshop2 from "@/assets/workshop-2.jpg";
import ref2 from "@/assets/reference-2.jpg";
import { Reveal } from "@/components/site/reveal";

export const Route = createFileRoute("/o-nas")({
  head: () => ({
    meta: [
      { title: "O nás — BMB, český výrobce postelí" },
      { name: "description", content: "Rodinná česká firma vyrábějící masivní postele od roku 1992. Naše hodnoty, historie a lidé." },
      { property: "og:title", content: "O nás — BMB" },
      { property: "og:description", content: "Rodinný český výrobce postelí od roku 1992." },
    ],
  }),
  component: ONas,
});

const TIMELINE = [
  { y: "1992", t: "Založení firmy", d: "V Bystřici pod Hostýnem vzniká malá truhlárna se čtyřmi zaměstnanci." },
  { y: "2004", t: "Vlastní továrna", d: "Otvíráme moderní výrobní halu s klimatizovanou sušárnou masivu." },
  { y: "2015", t: "400 prodejců", d: "Rozšíření sítě prodejců po celé České a Slovenské republice." },
  { y: "2026", t: "Nová kolekce", d: "Uvádíme nadčasovou řadu MARIKA, ALEXIS a ELLA family." },
];

function ONas() {
  return (
    <div className="pt-24 pb-24">
      <div className="container-bmb">
        <Reveal>
          <div className="text-eyebrow text-accent">O nás</div>
          <h1 className="text-display mt-4 max-w-4xl text-5xl leading-[1.02] sm:text-6xl lg:text-[5rem]">
            Česká rodinná firma s příběhem od roku 1992.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            BMB vyrůstalo pomalu a poctivě. Od čtyř truhlářů v malé dílně
            k moderní továrně, která zásobuje více než 400 prodejců.
            Zůstáváme rodinní. To poznáte na každém detailu.
          </p>
        </Reveal>

        <div className="mt-20 grid gap-6 md:grid-cols-3">
          <Reveal className="overflow-hidden rounded-3xl md:col-span-2 md:row-span-2">
            <img src={workshop2} alt="Naše továrna" className="h-full w-full object-cover" loading="lazy" />
          </Reveal>
          <Reveal delay={100} className="overflow-hidden rounded-3xl">
            <img src={workshop1} alt="Ruční práce" className="h-64 w-full object-cover" loading="lazy" />
          </Reveal>
          <Reveal delay={200} className="overflow-hidden rounded-3xl">
            <img src={ref2} alt="Výsledek" className="h-64 w-full object-cover" loading="lazy" />
          </Reveal>
        </div>

        <div className="mt-28 grid gap-16 lg:grid-cols-[1fr_1.4fr]">
          <Reveal>
            <h2 className="text-display text-4xl sm:text-5xl">Historie</h2>
          </Reveal>
          <div className="space-y-10">
            {TIMELINE.map((row, i) => (
              <Reveal key={row.y} delay={i * 80}>
                <div className="grid grid-cols-[80px_1fr] gap-8 border-t border-border pt-8">
                  <div className="text-display text-2xl text-accent">{row.y}</div>
                  <div>
                    <div className="text-display text-2xl">{row.t}</div>
                    <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">{row.d}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        <Reveal className="mt-28 rounded-[2rem] border border-border bg-oak-soft/40 p-10 sm:p-16">
          <div className="text-eyebrow text-accent">Chcete se přesvědčit?</div>
          <h3 className="text-display mt-4 max-w-2xl text-3xl sm:text-4xl">
            Postavte si postel v konfigurátoru nebo se stavte u prodejce.
          </h3>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/konfigurator" className="group inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3.5 text-sm font-medium text-background transition-all hover:bg-accent hover:text-accent-foreground">
              Konfigurovat postel
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
            <Link to="/prodejci" className="inline-flex items-center gap-2 rounded-full border border-foreground/20 px-6 py-3.5 text-sm font-medium text-foreground">
              Najít prodejce
            </Link>
          </div>
        </Reveal>
      </div>
    </div>
  );
}