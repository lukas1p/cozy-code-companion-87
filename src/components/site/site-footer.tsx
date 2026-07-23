import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowUpRight, ExternalLink } from "lucide-react";
import { BmbLogo } from "./logo";

export function SiteFooter() {
  const [subscribed, setSubscribed] = useState(false);
  return (
    <footer className="mt-32 border-t border-border/70 bg-background">
      <div className="container-bmb py-20">
        <div className="grid gap-16 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
          <div>
            <BmbLogo />
            <p className="mt-6 max-w-xs text-sm leading-relaxed text-muted-foreground">
              Rodinný český výrobce postelí z masivního dřeva. Vyrábíme
              ve Ždánicích na jižní Moravě od roku 1992.
            </p>
            <a
              href="https://bmb.cz"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-xs font-medium text-foreground/70 transition-all hover:border-foreground hover:text-foreground"
            >
              bmb.cz <ExternalLink className="h-3 w-3" />
            </a>
          </div>

          <div>
            <div className="text-eyebrow text-muted-foreground">Odkazy</div>
            <ul className="mt-6 space-y-3 text-sm">
              {[
                { to: "/postele", label: "Postele" },
                { to: "/konfigurator", label: "Konfigurátor" },
                { to: "/proc-bmb", label: "Proč BMB" },
                { to: "/prodejci", label: "Prodejci" },
                { to: "/o-nas", label: "O nás" },
                { to: "/kontakt", label: "Kontakt" },
              ].map((l) => (
                <li key={l.to}>
                  <Link
                    to={l.to}
                    className="text-foreground/70 transition-colors hover:text-foreground"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="text-eyebrow text-muted-foreground">Kontakt</div>
            <ul className="mt-6 space-y-3 text-sm text-foreground/70">
              <li>BMB, spol. s r. o.</li>
              <li>Nádražní 524</li>
              <li>696 32 Ždánice</li>
              <li className="pt-2 text-foreground">+420 774 801 573</li>
              <li>bmb@bmb.cz</li>
            </ul>
          </div>

          <div>
            <div className="text-eyebrow text-muted-foreground">Newsletter</div>
            <p className="mt-6 text-sm text-muted-foreground">
              Přihlaste se k odběru novinek a inspirace pro váš domov.
            </p>
            {subscribed ? (
              <div className="mt-4 rounded-full bg-sage-soft px-5 py-3 text-sm text-foreground">
                Děkujeme, budeme v kontaktu.
              </div>
            ) : (
              <form
                className="mt-4 flex overflow-hidden rounded-full border border-border bg-background focus-within:border-foreground/40"
                onSubmit={(e) => { e.preventDefault(); setSubscribed(true); }}
              >
                <input
                  required
                  type="email"
                  placeholder="vaše@email.cz"
                  className="flex-1 bg-transparent px-5 py-3 text-sm outline-none placeholder:text-muted-foreground"
                />
                <button className="grid w-12 place-items-center bg-foreground text-background transition-colors hover:bg-accent hover:text-accent-foreground">
                  <ArrowUpRight className="h-4 w-4" />
                </button>
              </form>
            )}
          </div>
        </div>

        <div className="mt-16 flex flex-wrap items-center justify-between gap-4 border-t border-border/70 pt-8 text-xs text-muted-foreground">
          <div>© {new Date().getFullYear()} BMB, spol. s r. o. · IČ 46905235 · Všechna práva vyhrazena.</div>
          <div className="flex gap-6">
            <a href="https://bmb.cz/zasady-cookies-eu/" target="_blank" rel="noopener noreferrer" className="hover:text-foreground">Cookies</a>
            <a href="https://bmb.cz" target="_blank" rel="noopener noreferrer" className="hover:text-foreground">bmb.cz</a>
            <Link to="/kontakt" className="hover:text-foreground">Kontakt</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}