import { DEALERS } from "@/lib/bmb-data";

/** Přibližné pozice měst v rámci 100×60 výřezu mapy ČR. */
export const DEALER_POSITIONS: Record<string, { x: number; y: number }> = {
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

export function CzMap({
  active,
  onSelect,
  showLabels = true,
}: {
  active: string | null;
  onSelect: (city: string) => void;
  showLabels?: boolean;
}) {
  return (
    <svg viewBox="0 0 100 60" className="h-auto w-full">
      <defs>
        <linearGradient id="cz" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="oklch(0.94 0.03 80)" />
          <stop offset="1" stopColor="oklch(0.88 0.04 80)" />
        </linearGradient>
      </defs>
      <path
        d="M8 26 L14 18 L22 12 L34 10 L46 12 L54 10 L64 12 L76 14 L86 18 L92 24 L94 30 L92 38 L84 44 L74 48 L64 50 L54 52 L44 50 L34 50 L26 48 L18 44 L12 38 L8 32 Z"
        fill="url(#cz)"
        stroke="oklch(0.85 0.02 80)"
        strokeWidth="0.3"
      />
      {DEALERS.map((d) => {
        const p = DEALER_POSITIONS[d.city];
        if (!p) return null;
        const isActive = d.city === active;
        return (
          <g key={d.city} onClick={() => onSelect(d.city)} className="cursor-pointer">
            <circle
              cx={p.x}
              cy={p.y}
              r={isActive ? 2.2 : 1.4}
              fill={isActive ? "var(--select)" : "oklch(0.24 0.012 260)"}
              className="transition-all"
            />
            {isActive && <circle cx={p.x} cy={p.y} r={4} fill="var(--select)" opacity={0.2} />}
            {showLabels && (
              <text
                x={p.x + 2.5}
                y={p.y + 0.8}
                fontSize="2.2"
                fill="oklch(0.22 0.01 260)"
                fontWeight={isActive ? 600 : 400}
              >
                {d.city}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}