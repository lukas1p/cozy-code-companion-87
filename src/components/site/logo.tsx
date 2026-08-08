import { Link } from "@tanstack/react-router";
import bmbLogo from "@/assets/bmb-logo.png.asset.json";

export function BmbLogo({ className = "" }: { className?: string }) {
  return (
    <Link
      to="/"
      className={`inline-flex items-center gap-2 ${className}`}
      aria-label="BMB — domů"
    >
      <img
        src={bmbLogo.url}
        alt="BMB — český nábytek, 1897"
        className="h-9 w-auto"
      />
    </Link>
  );
}