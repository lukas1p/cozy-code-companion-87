import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ArrowUpRight, Check, Mail, MapPin } from "lucide-react";
import {
  PRODUCTS,
  PRODUCT_LIST,
  formatPrice,
  sanitize,
  type Opt,
  type Product,
  type Selection,
} from "@/lib/bmb-catalog";

export const Route = createFileRoute("/konfigurator")({
  head: () => ({
    meta: [
      { title: "Konfigurátor postele — BMB" },
      { name: "description", content: "Nakonfigurujte si postel BMB — rozměr, materiál, dekor a provedení. Cena i objednací kód podle oficiálního ceníku BMB." },
      { property: "og:title", content: "Konfigurátor postele — BMB" },
      { property: "og:description", content: "Postavte si postel na míru. BMB, česká výroba." },
    ],
  }),
  validateSearch: (search: Record<string, unknown>): { bed?: string } =>
    typeof search.bed === "string" ? { bed: search.bed } : {},
  component: Konfigurator,
});

function OptionGroup({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: Opt[];
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
              aria-pressed={active}
              onClick={() => onChange(o.value)}
              className={`group relative flex flex-col items-start gap-1 rounded-2xl border px-4 py-3.5 text-left text-sm transition-all ${
                active
                  ? "border-foreground bg-foreground text-background"
                  : "border-border bg-background text-foreground hover:border-foreground/40"
              }`}
            >
              <span className="pr-5 font-medium">{o.label}</span>
              {o.hint && (
                <span className={`text-[11px] ${active ? "text-background/70" : "text-muted-foreground"}`}>
                  {o.hint}
                </span>
              )}
              {active && <Check className="absolute right-3 top-3 h-3.5 w-3.5" />}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function Konfigurator() {
  const { bed: initialBed } = Route.useSearch();
  const initialProduct: Product = PRODUCTS[initialBed ?? "marika"] ?? PRODUCTS.marika;

  const [productId, setProductId] = useState<string>(initialProduct.id);
  const [sel, setSel] = useState<Selection>(() => sanitize(initialProduct, initialProduct.defaults));
  const [sent, setSent] = useState(false);

  const product = PRODUCTS[productId];
  const result = useMemo(() => product.resolve(sel), [product, sel]);

  const update = (id: string, v: string) =>
    setSel((prev) => sanitize(product, { ...prev, [id]: v }));

  const switchProduct = (id: string) => {
    const next = PRODUCTS[id];
    setProductId(id);
    setSel(sanitize(next, { ...next.defaults, ...sel }));
  };

  const summary = product.params.map((p) => {
    const opt = p.options(sel).find((o) => o.value === sel[p.id]);
    return { label: p.label, value: opt?.label ?? "—" };
  });

  return (
    <div className="pt-8 pb-24">
      <div className="container-bmb">
        <div className="flex flex-wrap items-end justify-between gap-4 pb-8">
          <div>
            <div className="text-eyebrow text-accent">Konfigurátor</div>
            <h1 className="text-display mt-3 text-3xl sm:text-4xl">Postavte si svou postel</h1>
          </div>
          <div className="text-sm text-muted-foreground">
            Ceny a objednací kódy dle oficiálního ceníku BMB · platnost od 1. 4. 2026
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.15fr_1fr]">
          {/* LEFT — VISUAL */}
          <div className="sticky top-24 h-fit overflow-hidden rounded-[2rem] border border-border bg-oak-soft/40">
            <div className="relative aspect-[4/3] w-full overflow-hidden bg-oak-soft/60">
              <img
                key={product.id}
                src={product.image}
                alt={product.name}
                className="h-full w-full object-cover fade-in-soft"
              />
              <div className="absolute left-6 top-6 flex flex-wrap gap-2">
                {[result.code ?? "—", ...summary.map((s) => s.value)].map((t) => (
                  <span key={t} className="rounded-full bg-background/85 px-3 py-1 text-[10px] font-medium tracking-[0.18em] backdrop-blur">
                    {t}
                  </span>
                ))}
              </div>
              <div className="absolute bottom-4 left-6 right-6 text-[10px] leading-relaxed text-foreground/60">
                Fotografie zobrazuje model, nikoli konkrétní dekor — vzorník dekorů
                najdete u prodejce nebo na {product.sourceUrl.replace("https://", "")}.
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3 p-6">
              {PRODUCT_LIST.map((b) => {
                const active = b.id === productId;
                return (
                  <button
                    key={b.id}
                    type="button"
                    aria-pressed={active}
                    onClick={() => switchProduct(b.id)}
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
                  <div className="text-eyebrow text-muted-foreground">{product.tagline}</div>
                  <h2 className="text-display mt-2 text-4xl">{product.name}</h2>
                  <div className="mt-2 text-xs tracking-[0.2em] text-muted-foreground">
                    OBJ. Č. · <span className="text-foreground">{result.code ?? "—"}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-eyebrow text-muted-foreground">Cena s DPH</div>
                  <div
                    key={result.price ?? "na"}
                    className="text-display mt-1 text-3xl text-foreground fade-in-soft"
                  >
                    {result.price ? formatPrice(result.price) : "na dotaz"}
                  </div>
                </div>
              </div>

              <div className="mt-8 space-y-6">
                {product.params.map((p) => (
                  <OptionGroup
                    key={`${product.id}-${p.id}`}
                    label={p.label}
                    value={sel[p.id] ?? ""}
                    onChange={(v) => update(p.id, v)}
                    options={p.options(sel)}
                  />
                ))}
              </div>
            </div>

            {/* RESULT */}
            <div className="rounded-[2rem] border border-border bg-ink p-8 text-background">
              <div className="text-eyebrow text-accent">Výsledek konfigurace</div>
              <div className="mt-4 grid gap-6 sm:grid-cols-2">
                <div>
                  <div className="text-display text-2xl">{product.name}</div>
                  <ul className="mt-4 space-y-2 text-xs text-background/70">
                    {summary.map((s, i) => (
                      <li
                        key={s.label}
                        className={`flex justify-between gap-4 ${i < summary.length - 1 ? "border-b border-background/10 pb-1.5" : ""}`}
                      >
                        <span>{s.label}</span>
                        <span className="text-right text-background">{s.value}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="flex flex-col justify-between gap-6">
                  <div>
                    <div className="text-eyebrow text-background/60">Objednací kód</div>
                    <div className="mt-1 font-mono text-sm">{result.code ?? "—"}</div>
                    <div className="text-eyebrow mt-6 text-background/60">Rozpis ceny</div>
                    <ul className="mt-2 space-y-1 text-xs text-background/70">
                      {result.lines.map((l) => (
                        <li key={l.label} className="flex justify-between gap-4">
                          <span>{l.label}</span>
                          <span className="text-background">
                            {l.amount != null ? formatPrice(l.amount) : l.note}
                          </span>
                        </li>
                      ))}
                    </ul>
                    <div className="text-display mt-4 text-3xl">
                      {result.price ? formatPrice(result.price) : "Cena na dotaz"}
                    </div>
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
              <ul className="mt-6 space-y-1 text-[11px] leading-relaxed text-background/50">
                {result.notes.map((n) => (
                  <li key={n}>· {n}</li>
                ))}
                <li>· Konfigurátor slouží jako podklad pro objednávku u prodejce. Přímý nákup online neposkytujeme.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
