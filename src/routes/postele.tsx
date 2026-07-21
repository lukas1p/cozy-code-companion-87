import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { BED_LIST } from "@/lib/bmb-data";
import { Reveal } from "@/components/site/reveal";

export const Route = createFileRoute("/postele")({
  head: () => ({
    meta: [
      { title: "Postele — BMB" },
      { name: "description", content: "Prohlédněte si kolekci masivních postelí BMB. Buk, dub i imitace masivu, doživotní záruka." },
      { property: "og:title", content: "Postele — BMB" },
      { property: "og:description", content: "Kolekce masivních postelí BMB — doživotní záruka na masiv." },
    ],
  }),
  component: PostelePage,
});

function PostelePage() {
  return (
    <div className="pt-24 pb-24">
      <div className="container-bmb">
        <Reveal>
          <div className="text-eyebrow text-accent">Kolekce</div>
          <h1 className="text-display mt-4 max-w-3xl text-5xl leading-[1.02] sm:text-6xl lg:text-[5rem]">
            Postele z masivu, dělané, aby zůstaly.
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
            Každý model vyrábíme v Bystřici pod Hostýnem. Rozměr, materiál i
            povrch si můžete přizpůsobit v konfigurátoru.
          </p>
        </Reveal>

        <div className="mt-20 grid gap-12">
          {BED_LIST.map((bed, i) => (
            <Reveal key={bed.id} delay={i * 80}>
              <article className="group grid gap-8 rounded-3xl border border-border bg-card p-4 transition-all hover:border-foreground/25 md:grid-cols-[1.1fr_1fr] md:p-6">
                <div className={`overflow-hidden rounded-2xl bg-oak-soft/40 ${i % 2 ? "md:order-2" : ""}`}>
                  <img
                    src={bed.image}
                    alt={bed.name}
                    loading="lazy"
                    className="aspect-[5/4] h-full w-full object-cover transition-transform duration-[1200ms] group-hover:scale-105"
                  />
                </div>
                <div className="flex flex-col justify-between gap-8 p-4 md:p-10">
                  <div>
                    <div className="text-eyebrow text-muted-foreground">{bed.tagline}</div>
                    <h2 className="text-display mt-3 text-4xl sm:text-5xl">{bed.name}</h2>
                    <p className="mt-4 max-w-md text-base leading-relaxed text-muted-foreground">
                      {bed.description}
                    </p>
                    <ul className="mt-6 flex flex-wrap gap-2">
                      {bed.highlights.map((h) => (
                        <li key={h} className="rounded-full border border-border px-3 py-1 text-xs text-foreground/75">{h}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="flex items-center justify-between border-t border-border pt-6">
                    <div className="text-sm text-muted-foreground">
                      Od <span className="text-foreground">{new Intl.NumberFormat("cs-CZ").format(bed.basePrice)} Kč</span>
                    </div>
                    <Link
                      to="/konfigurator"
                      search={{ bed: bed.id }}
                      className="group/btn inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-3 text-xs font-medium text-background transition-colors hover:bg-accent hover:text-accent-foreground"
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
    </div>
  );
}