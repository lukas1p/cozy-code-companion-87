import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ArrowUpRight, Check, Mail, MapPin, X } from "lucide-react";
import {
  PRODUCTS,
  PRODUCT_LIST,
  formatPrice,
  sanitize,
  type Opt,
  type Product,
  type Selection,
} from "@/lib/bmb-catalog";
import { DEALERS } from "@/lib/bmb-data";
import { CzMap } from "@/components/site/cz-map";

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

const STEPS = [
  { id: "rozmer", label: "Rozměr", params: ["size", "width", "length"] },
  { id: "material", label: "Materiál", params: ["material"] },
  { id: "dekor", label: "Dekor / povrch", params: ["decor"] },
  { id: "provedeni", label: "Provedení", params: ["corners", "storage", "variant"] },
] as const;

function OptionGroup({
  label,
  value,
  onChange,
  options,
  swatches = false,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: Opt[];
  swatches?: boolean;
}) {
  return (
    <div>
      <div className="mb-3 text-eyebrow text-muted-foreground">{label}</div>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {options.map((o) => {
          const active = o.value === value;
          return (
            <button
              key={o.value}
              type="button"
              aria-pressed={active}
              onClick={() => onChange(o.value)}
              className={`group relative flex min-h-12 items-center gap-3 rounded-2xl border px-3.5 py-3 text-left text-base transition-all ${
                active
                  ? "border-select bg-select text-select-foreground"
                  : "border-border bg-background text-foreground hover:border-select/50"
              }`}
            >
              {swatches &&
                (o.swatch ? (
                  <img
                    src={o.swatch}
                    alt=""
                    loading="lazy"
                    className="h-9 w-9 shrink-0 rounded-lg object-cover"
                  />
                ) : (
                  <span
                    aria-hidden
                    className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-dashed text-[11px] ${
                      active ? "border-select-foreground/40 text-select-foreground/70" : "border-border text-muted-foreground"
                    }`}
                  >
                    —
                  </span>
                ))}
              <span className="flex min-w-0 flex-col">
                <span className="pr-5 font-medium leading-tight">{o.label}</span>
                {o.hint && (
                  <span className={`text-[13px] leading-tight ${active ? "text-select-foreground/75" : "text-muted-foreground"}`}>
                    {o.hint}
                  </span>
                )}
              </span>
              {active && <Check className="absolute right-2.5 top-2.5 h-3.5 w-3.5" />}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function StepCard({
  index,
  title,
  children,
}: {
  index: number;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-[2rem] border border-border bg-card p-5 sm:p-8">
      <div className="mb-6 flex items-center gap-3">
        <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-select text-[13px] font-medium text-select-foreground">
          {index}
        </span>
        <h3 className="text-display truncate text-lg">{title}</h3>
      </div>
      <div className="space-y-6">{children}</div>
    </section>
  );
}

function Konfigurator() {
  const { bed: initialBed } = Route.useSearch();
  const initialProduct: Product = PRODUCTS[initialBed ?? "marika"] ?? PRODUCTS.marika;

  const [productId, setProductId] = useState<string>(initialProduct.id);
  const [sel, setSel] = useState<Selection>(() => sanitize(initialProduct, initialProduct.defaults));
  const [emailOpen, setEmailOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const [pickingDealer, setPickingDealer] = useState(false);
  const [dealerCity, setDealerCity] = useState<string | null>(null);

  const product = PRODUCTS[productId];
  const result = useMemo(() => product.resolve(sel), [product, sel]);
  const dealer = DEALERS.find((d) => d.city === dealerCity) ?? null;

  const update = (id: string, v: string) =>
    setSel((prev) => sanitize(product, { ...prev, [id]: v }));

  const switchProduct = (id: string) => {
    const next = PRODUCTS[id];
    setProductId(id);
    setSel(sanitize(next, { ...next.defaults, ...sel }));
  };

  const summary = product.params.map((p) => {
    const opt = p.options(sel).find((o) => o.value === sel[p.id]);
    return { id: p.id, label: p.label, value: opt?.label ?? "—" };
  });

  const priceText = result.price ? formatPrice(result.price) : "Cena bude doplněna podle aktuálního ceníku.";
  const codeText = result.code ?? "Bude doplněn podle aktuálního ceníku.";

  const configTitle = `Konfigurace postele ${product.name} — ${summary.map((s) => s.value).join(" · ")}`;
  const configLines = [
    `Model: ${product.name}`,
    `Objednací kód: ${codeText}`,
    ...summary.map((s) => `${s.label}: ${s.value}`),
    `Cena s DPH: ${priceText}`,
  ];

  const submitEmail = (e: React.FormEvent) => {
    e.preventDefault();
    const value = email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value) || value.length > 255) {
      setEmailError("Zadejte prosím platnou e-mailovou adresu.");
      return;
    }
    setEmailError(null);
    setSent(true);
  };

  return (
    <div className="pt-8 pb-24">
      <div className="container-bmb">
        <div className="grid grid-cols-1 items-end gap-4 pb-8 sm:flex sm:flex-wrap sm:justify-between">
          <div className="min-w-0">
            <div className="text-eyebrow text-select">Konfigurátor</div>
            <h1 className="text-display mt-3 text-3xl sm:text-4xl">Postavte si svou postel</h1>
          </div>
          <div className="text-base text-muted-foreground">
            Ceny a objednací kódy dle oficiálního ceníku BMB · platnost od 1. 4. 2026
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.15fr_1fr]">
          {/* LEFT — VISUAL */}
          <div className="h-fit overflow-hidden rounded-[2rem] border border-border bg-oak-soft/40 lg:sticky lg:top-24">
            <div className="relative aspect-[4/3] w-full overflow-hidden bg-oak-soft/60">
              <img
                key={product.id}
                src={product.image}
                alt={product.name}
                className="h-full w-full object-cover fade-in-soft"
              />
              <div className="absolute left-4 top-4 right-4 flex flex-wrap gap-1.5">
                {[result.code ?? "kód dle ceníku", ...summary.map((s) => s.value)].map((t, i) => (
                  <span key={`${t}-${i}`} className="rounded-full bg-background/85 px-2.5 py-1 text-xs font-medium tracking-[0.14em] backdrop-blur">
                    {t}
                  </span>
                ))}
              </div>
              <div className="absolute bottom-4 left-6 right-6 text-xs leading-relaxed text-foreground/60">
                Fotografie zobrazuje model, nikoli konkrétní dekor — vzorník dekorů
                najdete u prodejce nebo na {product.sourceUrl.replace("https://", "")}.
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3 p-4 sm:p-6">
              {PRODUCT_LIST.map((b) => {
                const active = b.id === productId;
                return (
                  <button
                    key={b.id}
                    type="button"
                    aria-pressed={active}
                    onClick={() => switchProduct(b.id)}
                    className={`group overflow-hidden rounded-2xl border transition-all ${
                      active ? "border-select ring-1 ring-select" : "border-border hover:border-select/40"
                    }`}
                  >
                    <div className="aspect-[4/3] overflow-hidden bg-oak-soft/60">
                      <img src={b.image} alt={b.name} loading="lazy" className="h-full w-full object-cover" />
                    </div>
                    <div className="p-2 text-left sm:p-3">
                      <div className="text-[13px] font-medium">{b.name}</div>
                      <div className="text-xs text-muted-foreground">{b.tagline}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* RIGHT — CONFIG */}
          <div className="flex min-w-0 flex-col gap-4">
            <div className="rounded-[2rem] border border-border bg-card p-5 sm:p-8">
              <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4">
                <div className="min-w-0">
                  <div className="text-eyebrow text-muted-foreground">{product.tagline}</div>
                  <h2 className="text-display mt-2 truncate text-3xl sm:text-4xl">{product.name}</h2>
                  <div className="mt-2 text-sm tracking-[0.2em] text-muted-foreground">
                    OBJ. Č. · <span className="text-foreground">{result.code ?? "—"}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-eyebrow text-muted-foreground">Cena s DPH</div>
                  <div
                    key={result.price ?? "na"}
                    className="text-display mt-1 text-2xl text-foreground fade-in-soft sm:text-3xl"
                  >
                    {result.price ? formatPrice(result.price) : "na dotaz"}
                  </div>
                </div>
              </div>
              <ol className="mt-6 flex flex-wrap gap-x-4 gap-y-2 text-[13px] text-muted-foreground">
                {STEPS.map((s, i) => (
                  <li key={s.id} className="flex items-center gap-1.5">
                    <span className="grid h-4 w-4 place-items-center rounded-full bg-select/15 text-[11px] text-select">{i + 1}</span>
                    {s.label}
                  </li>
                ))}
                <li className="flex items-center gap-1.5">
                  <span className="grid h-4 w-4 place-items-center rounded-full bg-select/15 text-[11px] text-select">5</span>
                  Výsledek
                </li>
              </ol>
            </div>

            {STEPS.map((step, i) => {
              const params = product.params.filter((p) => (step.params as readonly string[]).includes(p.id));
              if (params.length === 0) return null;
              return (
                <StepCard key={step.id} index={i + 1} title={step.label}>
                  {params.map((p) => (
                    <OptionGroup
                      key={`${product.id}-${p.id}`}
                      label={p.label}
                      value={sel[p.id] ?? ""}
                      onChange={(v) => update(p.id, v)}
                      options={p.options(sel)}
                      swatches={p.id === "decor"}
                    />
                  ))}
                </StepCard>
              );
            })}

            {/* STEP 5 — RESULT */}
            <div className="rounded-[2rem] border border-border bg-ink p-5 text-background sm:p-8">
              <div className="flex items-center gap-3">
                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-select text-[13px] font-medium text-select-foreground">5</span>
                <div className="text-eyebrow text-select">Výsledek konfigurace</div>
              </div>
              <div className="mt-6 grid gap-6 sm:grid-cols-2">
                <div className="min-w-0">
                  <div className="text-display text-2xl">{product.name}</div>
                  <ul className="mt-4 space-y-2 text-sm text-background/70">
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
                <div className="flex min-w-0 flex-col justify-between gap-6">
                  <div>
                    <div className="text-eyebrow text-background/60">Objednací kód</div>
                    <div className="mt-1 font-mono text-base break-words">{codeText}</div>
                    <div className="text-eyebrow mt-6 text-background/60">Rozpis ceny</div>
                    <ul className="mt-2 space-y-1 text-sm text-background/70">
                      {result.lines.map((l) => (
                        <li key={l.label} className="flex justify-between gap-4">
                          <span>{l.label}</span>
                          <span className="text-right text-background">
                            {l.amount != null ? formatPrice(l.amount) : l.note}
                          </span>
                        </li>
                      ))}
                    </ul>
                    <div className={`mt-4 ${result.price ? "text-display text-3xl" : "text-base text-background/80"}`}>
                      {priceText}
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <button
                      type="button"
                      onClick={() => setPickingDealer(true)}
                      className="group inline-flex items-center justify-between gap-3 rounded-full bg-select px-5 py-3 text-sm font-medium text-select-foreground transition-opacity hover:opacity-90"
                    >
                      <span className="inline-flex items-center gap-2"><MapPin className="h-3.5 w-3.5" />Vybrat nejbližšího prodejce</span>
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setSent(false);
                        setEmailError(null);
                        setEmailOpen(true);
                      }}
                      className="group inline-flex items-center justify-between gap-3 rounded-full border border-background/20 px-5 py-3 text-sm font-medium text-background transition-colors hover:border-background/60"
                    >
                      <span className="inline-flex items-center gap-2"><Mail className="h-3.5 w-3.5" />{sent ? "Konfigurace odeslána" : "Odeslat konfiguraci e-mailem"}</span>
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
              <ul className="mt-6 space-y-1 text-[13px] leading-relaxed text-background/50">
                {result.notes.map((n) => (
                  <li key={n}>· {n}</li>
                ))}
                <li>· Konfigurátor slouží jako podklad pro objednávku u prodejce. Přímý nákup online neposkytujeme.</li>
              </ul>
            </div>

            {/* DEALER PICKER */}
            {pickingDealer && (
              <div className="rounded-[2rem] border border-border bg-card p-5 sm:p-8">
                <div className="text-eyebrow text-select">Výběr prodejce</div>
                <p className="mt-2 text-base text-muted-foreground">
                  Vyberte bod na mapě nebo prodejce ze seznamu. Vaše konfigurace zůstane zachovaná.
                </p>
                <div className="mt-5 grid gap-5 lg:grid-cols-2">
                  <div className="overflow-hidden rounded-2xl border border-border bg-oak-soft/30 p-3">
                    <CzMap active={dealerCity} onSelect={setDealerCity} showLabels={false} />
                  </div>
                  <div className="rounded-2xl border border-border">
                    {DEALERS.map((d) => (
                      <button
                        key={d.city}
                        type="button"
                        onClick={() => setDealerCity(d.city)}
                        className={`flex w-full items-center justify-between gap-3 border-b border-border/70 px-4 py-3 text-left text-base transition-colors last:border-0 hover:bg-muted ${
                          d.city === dealerCity ? "bg-select/10" : ""
                        }`}
                      >
                        <span className="min-w-0">
                          <span className="block truncate font-medium">{d.city}</span>
                          <span className="block truncate text-sm text-muted-foreground">{d.name}</span>
                        </span>
                        <ArrowUpRight className="h-4 w-4 shrink-0 text-muted-foreground" />
                      </button>
                    ))}
                  </div>
                </div>

                {dealer && (
                  <div className="mt-6 grid gap-5 rounded-2xl border border-select/40 bg-select/5 p-5 sm:grid-cols-2">
                    <div className="min-w-0">
                      <div className="text-eyebrow text-select">Moje konfigurace</div>
                      <div className="text-display mt-2 text-xl">{product.name}</div>
                      <ul className="mt-3 space-y-1.5 text-sm">
                        {summary.map((s) => (
                          <li key={s.label} className="flex justify-between gap-3">
                            <span className="text-muted-foreground">{s.label}</span>
                            <span className="text-right font-medium">{s.value}</span>
                          </li>
                        ))}
                        <li className="flex justify-between gap-3 border-t border-border pt-1.5">
                          <span className="text-muted-foreground">Cena</span>
                          <span className="text-right font-medium">{priceText}</span>
                        </li>
                        <li className="flex justify-between gap-3">
                          <span className="text-muted-foreground">Objednací kód</span>
                          <span className="text-right font-mono">{codeText}</span>
                        </li>
                      </ul>
                    </div>
                    <div className="min-w-0">
                      <div className="text-eyebrow text-select">Prodejce</div>
                      <div className="text-display mt-2 text-xl">{dealer.name}</div>
                      <div className="mt-3 space-y-2 text-base">
                        <div className="flex items-start gap-2 text-muted-foreground">
                          <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0" /> {dealer.address}
                        </div>
                        <a href={`tel:${dealer.phone}`} className="block hover:underline">{dealer.phone}</a>
                        <a href={`mailto:${dealer.email}`} className="block break-all hover:underline">{dealer.email}</a>
                      </div>
                      <div className="mt-4 text-[13px] leading-relaxed text-muted-foreground">
                        Konfiguraci předáte prodejci osobně nebo e-mailem — objednávka se z webu neodesílá.
                      </div>
                    </div>
                  </div>
                )}

                <Link
                  to="/prodejci"
                  className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
                >
                  Zobrazit všechny prodejce <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
