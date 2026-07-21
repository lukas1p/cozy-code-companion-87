import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowUpRight, Mail, MapPin, Phone } from "lucide-react";
import { Reveal } from "@/components/site/reveal";

export const Route = createFileRoute("/kontakt")({
  head: () => ({
    meta: [
      { title: "Kontakt — BMB" },
      { name: "description", content: "Kontaktujte BMB, českého výrobce masivních postelí. Adresa, telefon, e-mail a kontaktní formulář." },
      { property: "og:title", content: "Kontakt — BMB" },
      { property: "og:description", content: "Napište nám nebo zavolejte." },
    ],
  }),
  component: Kontakt,
});

function Kontakt() {
  const [sent, setSent] = useState(false);

  return (
    <div className="pt-24 pb-24">
      <div className="container-bmb">
        <Reveal>
          <div className="text-eyebrow text-accent">Kontakt</div>
          <h1 className="text-display mt-4 max-w-3xl text-5xl leading-[1.02] sm:text-6xl">
            Napište nám. Ozveme se do 24 hodin.
          </h1>
        </Reveal>

        <div className="mt-16 grid gap-6 lg:grid-cols-[1fr_1.2fr]">
          <Reveal className="space-y-6">
            <div className="rounded-[2rem] border border-border bg-card p-8">
              <div className="text-eyebrow text-muted-foreground">Sídlo</div>
              <div className="text-display mt-3 text-2xl">BMB, spol. s r. o.</div>
              <div className="mt-2 flex items-start gap-3 text-sm text-muted-foreground">
                <MapPin className="mt-0.5 h-4 w-4 text-accent" />
                <div>Průmyslová 998<br /> 768 61 Bystřice pod Hostýnem</div>
              </div>
            </div>
            <div className="rounded-[2rem] border border-border bg-card p-8">
              <div className="text-eyebrow text-muted-foreground">Kontakt</div>
              <div className="mt-4 space-y-3 text-sm">
                <a href="tel:+420573380011" className="flex items-center gap-3"><Phone className="h-4 w-4 text-accent" />+420 573 380 011</a>
                <a href="mailto:obchod@bmb.cz" className="flex items-center gap-3"><Mail className="h-4 w-4 text-accent" />obchod@bmb.cz</a>
              </div>
            </div>
            <div className="rounded-[2rem] border border-border bg-oak-soft/50 p-8">
              <div className="text-eyebrow text-muted-foreground">Otevírací doba</div>
              <ul className="mt-4 space-y-2 text-sm">
                <li className="flex justify-between"><span>Po–Pá</span><span className="text-muted-foreground">8:00 – 16:00</span></li>
                <li className="flex justify-between"><span>So – Ne</span><span className="text-muted-foreground">Zavřeno</span></li>
              </ul>
            </div>
          </Reveal>

          <Reveal delay={80}>
            <form
              onSubmit={(e) => { e.preventDefault(); setSent(true); }}
              className="rounded-[2rem] border border-border bg-card p-8 sm:p-12"
            >
              <div className="text-display text-3xl">Kontaktní formulář</div>
              {sent ? (
                <div className="mt-8 rounded-2xl bg-sage-soft p-6 text-sm">
                  Děkujeme, zpráva byla odeslána. Odpovíme co nejdříve.
                </div>
              ) : (
                <div className="mt-8 grid gap-4">
                  <label className="grid gap-1.5">
                    <span className="text-eyebrow text-muted-foreground">Jméno</span>
                    <input required className="rounded-2xl border border-border bg-background px-5 py-3.5 text-sm outline-none focus:border-foreground/40" />
                  </label>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="grid gap-1.5">
                      <span className="text-eyebrow text-muted-foreground">E-mail</span>
                      <input required type="email" className="rounded-2xl border border-border bg-background px-5 py-3.5 text-sm outline-none focus:border-foreground/40" />
                    </label>
                    <label className="grid gap-1.5">
                      <span className="text-eyebrow text-muted-foreground">Telefon</span>
                      <input className="rounded-2xl border border-border bg-background px-5 py-3.5 text-sm outline-none focus:border-foreground/40" />
                    </label>
                  </div>
                  <label className="grid gap-1.5">
                    <span className="text-eyebrow text-muted-foreground">Zpráva</span>
                    <textarea required rows={5} className="resize-none rounded-2xl border border-border bg-background px-5 py-3.5 text-sm outline-none focus:border-foreground/40" />
                  </label>
                  <button className="group mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-foreground px-6 py-4 text-sm font-medium text-background transition-colors hover:bg-accent hover:text-accent-foreground">
                    Odeslat zprávu
                    <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </button>
                </div>
              )}
            </form>
          </Reveal>
        </div>
      </div>
    </div>
  );
}