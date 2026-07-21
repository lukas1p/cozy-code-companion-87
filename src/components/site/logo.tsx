import { Link } from "@tanstack/react-router";

export function BmbLogo({ className = "" }: { className?: string }) {
  return (
    <Link
      to="/"
      className={`inline-flex items-center gap-2 ${className}`}
      aria-label="BMB — domů"
    >
      <span className="grid h-8 w-8 place-items-center rounded-full bg-foreground text-background text-[10px] font-semibold tracking-[0.18em]">
        BMB
      </span>
      <span className="text-display text-[1.05rem] font-medium tracking-tight">
        bmb<span className="text-accent">.</span>
      </span>
    </Link>
  );
}