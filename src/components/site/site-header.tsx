import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { BmbLogo } from "./logo";

const NAV = [
  { to: "/postele", label: "Postele" },
  { to: "/konfigurator", label: "Konfigurátor" },
  { to: "/proc-bmb", label: "Proč BMB" },
  { to: "/prodejci", label: "Prodejci" },
  { to: "/o-nas", label: "O nás" },
  { to: "/kontakt", label: "Kontakt" },
] as const;

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-500 ${
        scrolled
          ? "border-b border-border/70 bg-background/85 backdrop-blur-xl"
          : "border-b border-transparent bg-background/40 backdrop-blur-sm"
      }`}
    >
      <div className="container-bmb flex h-[72px] items-center justify-between gap-6">
        <BmbLogo />

        <nav className="hidden items-center gap-8 lg:flex">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="group relative text-[13px] font-medium tracking-tight text-foreground/70 transition-colors hover:text-foreground"
              activeProps={{ className: "text-foreground" }}
            >
              {item.label}
              <span className="absolute -bottom-1 left-0 h-px w-0 bg-foreground transition-all duration-300 group-hover:w-full" />
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            to="/konfigurator"
            className="group hidden items-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-[13px] font-medium text-background transition-all hover:bg-accent hover:text-accent-foreground sm:inline-flex"
          >
            Konfigurovat postel
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="grid h-11 w-11 place-items-center rounded-full border border-border bg-background/50 lg:hidden"
            aria-label="Otevřít menu"
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      <div
        className={`fixed inset-x-0 top-[72px] z-40 origin-top overflow-hidden bg-background/98 backdrop-blur-xl transition-all duration-500 lg:hidden ${
          open ? "max-h-screen border-b border-border" : "max-h-0 border-b border-transparent"
        }`}
      >
        <div className="container-bmb flex flex-col gap-1 py-6">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setOpen(false)}
              className="flex items-center justify-between rounded-2xl px-4 py-4 text-lg font-medium tracking-tight text-foreground transition-colors hover:bg-muted"
            >
              {item.label}
              <ArrowUpRight className="h-4 w-4 opacity-40" />
            </Link>
          ))}
          <Link
            to="/konfigurator"
            onClick={() => setOpen(false)}
            className="mt-4 inline-flex items-center justify-center gap-2 rounded-full bg-foreground px-6 py-4 text-sm font-medium text-background"
          >
            Konfigurovat postel
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </header>
  );
}