import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ArrowUpRight, MapPin, Phone, Mail, Search } from "lucide-react";
import { DEALERS } from "@/lib/bmb-data";
import { Reveal } from "@/components/site/reveal";

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

// Approx positions inside a 100x60 viewport for CZ
const POSITIONS: Record<string, { x: number; y: number }> = {
  Praha: { x: 33, y: 26 },
  Brno: { x: 58, y: 42 },
  Ostrava: { x: 78, y: 30 },
  Plzeň: { x: 18, y: 32 },
  Olomouc: { x: 68, y: 34 },
  "Hradec Králové": { x: 55, y: 25 },
  "České Budějovice": { x: 30, y: 48 },
  Liberec: { x: 40, y: 14 },
  "Karlovy Vary": { x: 12, y: 24 },
  Pardubice: { x: 50, y: 30 },
  Teplice: { x: 22, y: 18 },
  Kolín: { x: 44, y: 28 },
  "Havlíčkův Brod": { x: 48, y: 36 },
};

function Prodejci() {
  const [q, setQ] = useState("");
  const [active, setActive] = useState<string | null>("Praha");

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
            <svg viewBox="0 0 100 60" className="h-auto w-full">
              <defs>
                <linearGradient id="cz" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="oklch(0.94 0.03 80)" />
                  <stop offset="1" stopColor="oklch(0.88 0.04 80)" />
                </linearGradient>
              </defs>
              {/* Simplified CZ silhouette */}
              <path
                d="M8 26 L14 18 L22 12 L34 10 L46 12 L54 10 L64 12 L76 14 L86 18 L92 24 L94 30 L92 38 L84 44 L74 48 L64 50 L54 52 L44 50 L34 50 L26 48 L18 44 L12 38 L8 32 Z"
                fill="url(#cz)"
                stroke="oklch(0.85 0.02 80)"
                strokeWidth="0.3"
              />
              {DEALERS.map((d) => {
                const p = POSITIONS[d.city];
                if (!p) return null;
                const isActive = d.city === active;
                return (
                  <g
                    key={d.city}
                    onClick={() => setActive(d.city)}
                    className="cursor-pointer"
                  >
                    <circle
                      cx={p.x}
                      cy={p.y}
                      r={isActive ? 2.2 : 1.4}
                      fill={isActive ? "oklch(0.68 0.09 145)" : "oklch(0.24 0.012 260)"}
                      className="transition-all"
                    />
                    {isActive && (
                      <circle
                        cx={p.x}
                        cy={p.y}
                        r={4}
                        fill="oklch(0.68 0.09 145)"
                        opacity={0.2}
                      />
                    )}
                    <text
                      x={p.x + 2.5}
                      y={p.y + 0.8}
                      fontSize="2.2"
                      fill="oklch(0.22 0.01 260)"
                      fontWeight={isActive ? 600 : 400}
                    >
                      {d.city}
                    </text>
                  </g>
                );
              })}
            </svg>
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
              <button className="group mt-8 inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-xs font-medium text-background transition-colors hover:bg-accent hover:text-accent-foreground">
                Odeslat konfiguraci tomuto prodejci
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