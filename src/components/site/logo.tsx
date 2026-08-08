import { Link } from "@tanstack/react-router";

export function BmbLogo({ className = "" }: { className?: string }) {
  return (
    <Link
      to="/"
      className={`inline-flex items-center gap-2 ${className}`}
      aria-label="BMB — domů"
    >
      <span className="text-display text-[1.35rem] font-semibold uppercase tracking-[0.32em] leading-none">
        BMB
      </span>
    </Link>
  );
}