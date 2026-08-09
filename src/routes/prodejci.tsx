import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ArrowUpRight, MapPin, Phone, Mail, Search } from "lucide-react";
import { DEALERS } from "@/lib/bmb-data";
import { Reveal } from "@/components/site/reveal";
import { CzMap } from "@/components/site/cz-map";

export const Route = createFileRoute("/prodejci")({
  head: () => ({
    meta: [
      { title: "Prodejci — BMB" },
      { name: "description", content: "Více než 400 prodejců postelí BMB po celé České republice. Najděte nejbližšího partnera ve vašem městě." },
      { property: "og:title", content: "Prodejci BMB — 400+ míst po celé ČR" },
      { property: "og:description", content: "Najděte nejbližšího prodejce postelí BMB." },
    ],
  }),
  component: Prodejci,
});

function Prodejci() {
  const [q, setQ] = useState("");
  const [active, setActive] = useState<string | null>("Praha");
  const [sent, setSent] = useState(false);

  const filtered = useMemo(
    () =>
      DEALERS.filter((d) =>
        [d.city, d.name].some((s) => s.toLowerCase().includes(q.toLowerCase())),
      ),
    [q],
  );

  const selected = DEALERS.find((d) => d.city === active) ?? DEALERS[0];

  return (
    <div className="pt-24 pb-24">
      <div className="container-bmb">
        <Reveal>
          <div className="text-eyebrow text-accent">Prodejci</div>
          <h1 className="text-display mt-4 max-w-3xl text-5xl leading-[1.02] sm:text-6xl">
            Vyzkoušejte si BMB u vás v okolí.
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
            Více než 400 prodejců po celé ČR. Zajděte si postel osahat,
            konfiguraci si necháte poslat rovnou z tohoto webu.
          </p>
        </Reveal>

        <div className="mt-16 grid gap-6 lg:grid-cols-[1.2fr_1fr]">
          {/* MAP */}
          <Reveal className="relative overflow-hidden rounded-[2rem] border border-border bg-oak-soft/30 p-6 sm:p-10">
            <CzMap active={active} onSelect={setActive} />
          </Reveal>

          {/* DETAIL / SEARCH */}
          <Reveal delay={80} className="flex flex-col gap-4">
            <div className="relative">
              <Search className="pointer-events-none absolute left-5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Vyhledat město nebo prodejce"
                className="w-full rounded-full border border-border bg-background py-4 pl-12 pr-6 text-sm outline-none transition-colors focus:border-foreground/40"
              />
            </div>

            <div className="rounded-[2rem] border border-border bg-card p-8">
              <div className="text-eyebrow text-accent">Vybraný prodejce</div>
              <div className="text-display mt-2 text-3xl">{selected.name}</div>
              <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-3.5 w-3.5" /> {selected.address}
              </div>
              <div className="mt-6 space-y-3 text-sm">
                <a href={`tel:${selected.phone}`} className="flex items-center gap-3 text-foreground/85 hover:text-foreground">
                  <Phone className="h-4 w-4 text-accent" /> {selected.phone}
                </a>
                <a href={`mailto:${selected.email}`} className="flex items-center gap-3 text-foreground/85 hover:text-foreground">
                  <Mail className="h-4 w-4 text-accent" /> {selected.email}
                </a>
              </div>
              <button
                type="button"
                onClick={() => setSent(true)}
                className="group mt-8 inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-xs font-medium text-background transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                {sent ? "Odesláno — prodejce se ozve" : "Odeslat konfiguraci tomuto prodejci"}
                <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </button>
            </div>

            <div className="max-h-72 overflow-auto rounded-[2rem] border border-border bg-background">
              {filtered.map((d) => (
                <button
                  key={d.city}
                  onClick={() => setActive(d.city)}
                  className={`flex w-full items-center justify-between border-b border-border/70 px-6 py-4 text-left text-sm transition-colors last:border-0 hover:bg-muted ${
                    d.city === active ? "bg-muted" : ""
                  }`}
                >
                  <div>
                    <div className="font-medium">{d.city}</div>
                    <div className="text-xs text-muted-foreground">{d.name}</div>
                  </div>
                  <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
                </button>
              ))}
              {filtered.length === 0 && (
                <div className="px-6 py-8 text-center text-sm text-muted-foreground">Žádné výsledky.</div>
              )}
            </div>
          </Reveal>
        </div>
      </div>
    </div>
  );
}