import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ArrowUpRight, Check, Mail, MapPin } from "lucide-react";
import {
  BEDS,
  BED_LIST,
  DEFAULT_CONFIG,
  computeCode,
  computePrice,
  formatPrice,
  type BedId,
  type ConfigState,
} from "@/lib/bmb-data";

export const Route = createFileRoute("/konfigurator")({
  head: () => ({
    meta: [
      { title: "Konfigurátor postele — BMB" },
      { name: "description", content: "Nakonfigurujte si postel BMB — rozměr, materiál, povrch a úložný prostor. Cena i kód se mění v reálném čase." },
      { property: "og:title", content: "Konfigurátor postele — BMB" },
      { property: "og:description", content: "Postavte si postel na míru. BMB, česká výroba." },
    ],
  }),
  validateSearch: (search: Record<string, unknown>) => ({
    bed: (search.bed as BedId) ?? undefined,
  }),
  component: Konfigurator,
});

type OptionValue = string;

function OptionGroup<T extends OptionValue>({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: T;
  onChange: (v: T) => void;
  options: { value: T; label: string; hint?: string }[];
}) {
  return (
    <div>
      <div className="mb-3 flex items-baseline justify-between">
        <div className="text-eyebrow text-muted-foreground">{label}</div>
      </div>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {options.map((o) => {
          const active = o.value === value;
          return (
            <button
              key={o.value}
              type="button"
              onClick={() => onChange(o.value)}
              className={`group relative flex flex-col items-start gap-1 rounded-2xl border px-4 py-3.5 text-left text-sm transition-all ${
                active
                  ? "border-foreground bg-foreground text-background"
                  : "border-border bg-background text-foreground hover:border-foreground/40"
              }`}
            >
              <span className="font-medium">{o.label}</span>
              {o.hint && (
                <span className={`text-[11px] ${active ? "text-background/70" : "text-muted-foreground"}`}>
                  {o.hint}
                </span>
              )}
              {active && (
                <Check className="absolute right-3 top-3 h-3.5 w-3.5" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function Konfigurator() {
  const { bed: initialBed } = Route.useSearch();
  const [config, setConfig] = useState<ConfigState>({
    ...DEFAULT_CONFIG,
    bedId: initialBed ?? DEFAULT_CONFIG.bedId,
  });
  const [sent, setSent] = useState(false);

  const bed = BEDS[config.bedId];
  const price = useMemo(() => computePrice(config), [config]);
  const code = useMemo(() => computeCode(config), [config]);

  const update = <K extends keyof ConfigState>(k: K, v: ConfigState[K]) =>
    setConfig((c) => ({ ...c, [k]: v }));

  return (
    <div className="pt-8 pb-24">
      <div className="container-bmb">
        <div className="flex flex-wrap items-end justify-between gap-4 pb-8">
          <div>
            <div className="text-eyebrow text-accent">Konfigurátor</div>
            <h1 className="text-display mt-3 text-3xl sm:text-4xl">Postavte si svou postel</h1>
          </div>
          <div className="text-sm text-muted-foreground">
            Předvyplněno nejprodávanější variantou · změny se propíší v reálném čase
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.15fr_1fr]">
          {/* LEFT — VISUAL */}
          <div className="sticky top-24 h-fit overflow-hidden rounded-[2rem] border border-border bg-oak-soft/40">
            <div className="relative aspect-[4/3] w-full overflow-hidden bg-oak-soft/60">
              <img
                key={bed.id}
                src={bed.image}
                alt={bed.name}
                className="h-full w-full object-cover fade-in-soft"
              />
              <div className="absolute left-6 top-6 flex gap-2">
                <span className="rounded-full bg-background/85 px-3 py-1 text-[10px] font-medium tracking-[0.18em] backdrop-blur">
                  {bed.code}
                </span>
                <span className="rounded-full bg-background/85 px-3 py-1 text-[10px] font-medium tracking-[0.18em] backdrop-blur">
                  {config.material.toUpperCase()}
                </span>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3 p-6">
              {BED_LIST.map((b) => {
                const active = b.id === config.bedId;
                return (
                  <button
                    key={b.id}
                    type="button"
                    onClick={() => update("bedId", b.id)}
                    className={`group overflow-hidden rounded-2xl border transition-all ${
                      active ? "border-foreground" : "border-border hover:border-foreground/30"
                    }`}
                  >
                    <div className="aspect-[4/3] overflow-hidden bg-oak-soft/60">
                      <img src={b.image} alt={b.name} loading="lazy" className="h-full w-full object-cover" />
                    </div>
                    <div className="p-3 text-left">
                      <div className="text-[11px] font-medium">{b.name}</div>
                      <div className="text-[10px] text-muted-foreground">{b.tagline}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* RIGHT — CONFIG */}
          <div className="flex flex-col gap-6">
            <div className="rounded-[2rem] border border-border bg-card p-8">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-eyebrow text-muted-foreground">{bed.tagline}</div>
                  <h2 className="text-display mt-2 text-4xl">{bed.name}</h2>
                  <div className="mt-2 text-xs tracking-[0.2em] text-muted-foreground">
                    KÓD · <span className="text-foreground">{code}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-eyebrow text-muted-foreground">Orientační cena</div>
                  <div
                    key={price}
                    className="text-display mt-1 text-3xl text-foreground fade-in-soft"
                  >
                    {formatPrice(price)}
                  </div>
                </div>
              </div>

              <div className="mt-8 space-y-6">
                <OptionGroup
                  label="Rozměr"
                  value={config.size}
                  onChange={(v) => update("size", v)}
                  options={[
                    { value: "160x200", label: "160 × 200", hint: "Standard" },
                    { value: "180x200", label: "180 × 200", hint: "Nejoblíbenější" },
                  ]}
                />
                <OptionGroup
                  label="Materiál"
                  value={config.material}
                  onChange={(v) => update("material", v)}
                  options={[
                    { value: "buk", label: "Masiv buk", hint: "Doživotní záruka" },
                    { value: "dub", label: "Masiv dub", hint: "Doživotní záruka" },
                    { value: "imitace", label: "Imitace masivu", hint: "10 let záruka" },
                  ]}
                />
                <OptionGroup
                  label="Povrch"
                  value={config.surface}
                  onChange={(v) => update("surface", v)}
                  options={[
                    { value: "prirodni", label: "Přírodní" },
                    { value: "bily", label: "Bílý" },
                    { value: "grafit", label: "Grafit" },
                  ]}
                />
                <OptionGroup
                  label="Úložný prostor"
                  value={config.storage}
                  onChange={(v) => update("storage", v)}
                  options={[
                    { value: "ne", label: "Bez úložného" },
                    { value: "ano", label: "S úložným", hint: "+ 3 600 Kč" },
                  ]}
                />
                <OptionGroup
                  label="Rohy"
                  value={config.corners}
                  onChange={(v) => update("corners", v)}
                  options={[
                    { value: "rovne", label: "Rovné" },
                    { value: "oble", label: "Oblé" },
                  ]}
                />
              </div>
            </div>

            {/* RESULT */}
            <div className="rounded-[2rem] border border-border bg-ink p-8 text-background">
              <div className="text-eyebrow text-accent">Výsledek konfigurace</div>
              <div className="mt-4 grid gap-6 sm:grid-cols-2">
                <div>
                  <div className="text-display text-2xl">{bed.name}</div>
                  <ul className="mt-4 space-y-2 text-xs text-background/70">
                    <li className="flex justify-between border-b border-background/10 pb-1.5"><span>Rozměr</span><span className="text-background">{config.size.replace("x", " × ")}</span></li>
                    <li className="flex justify-between border-b border-background/10 pb-1.5"><span>Materiál</span><span className="text-background capitalize">{config.material}</span></li>
                    <li className="flex justify-between border-b border-background/10 pb-1.5"><span>Povrch</span><span className="text-background capitalize">{config.surface}</span></li>
                    <li className="flex justify-between border-b border-background/10 pb-1.5"><span>Úložný</span><span className="text-background capitalize">{config.storage}</span></li>
                    <li className="flex justify-between"><span>Rohy</span><span className="text-background capitalize">{config.corners}</span></li>
                  </ul>
                </div>
                <div className="flex flex-col justify-between gap-6">
                  <div>
                    <div className="text-eyebrow text-background/60">Kód produktu</div>
                    <div className="mt-1 font-mono text-sm">{code}</div>
                    <div className="text-eyebrow mt-6 text-background/60">Cena</div>
                    <div className="text-display mt-1 text-3xl">{formatPrice(price)}</div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Link
                      to="/prodejci"
                      className="group inline-flex items-center justify-between rounded-full bg-background px-5 py-3 text-xs font-medium text-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                    >
                      <span className="inline-flex items-center gap-2"><MapPin className="h-3.5 w-3.5" />Vybrat nejbližšího prodejce</span>
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </Link>
                    <button
                      type="button"
                      onClick={() => setSent(true)}
                      className="group inline-flex items-center justify-between rounded-full border border-background/20 px-5 py-3 text-xs font-medium text-background transition-colors hover:border-background/60"
                    >
                      <span className="inline-flex items-center gap-2"><Mail className="h-3.5 w-3.5" />{sent ? "Odesláno — brzy se ozveme" : "Odeslat konfiguraci e-mailem"}</span>
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
              <p className="mt-6 text-[11px] leading-relaxed text-background/50">
                Konfigurátor slouží jako podklad pro objednávku u prodejce.
                Přímý nákup online neposkytujeme.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}