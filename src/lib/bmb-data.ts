import bedMarika from "@/assets/bed-marika.jpg";
import bedAlexis from "@/assets/bed-alexis.jpg";
import bedElla from "@/assets/bed-ella.jpg";

export type BedId = "marika" | "alexis" | "ella";

export const BEDS: Record<
  BedId,
  {
    id: BedId;
    name: string;
    tagline: string;
    description: string;
    highlights: string[];
    image: string;
    basePrice: number;
    code: string;
  }
> = {
  marika: {
    id: "marika",
    name: "MARIKA klasik",
    tagline: "Nadčasová klasika",
    description:
      "Robustní konstrukce a přímé linie. Nejprodávanější model, který se hodí do každé ložnice.",
    highlights: ["Masivní dub", "Rovné rohy", "Doživotní záruka"],
    image: bedMarika,
    basePrice: 18990,
    code: "MRK",
  },
  alexis: {
    id: "alexis",
    name: "ALEXIS",
    tagline: "Měkké oblouky",
    description:
      "Elegantní zaoblené čelo, které do místnosti přináší klid a jemnost.",
    highlights: ["Masivní buk", "Oblé rohy", "Přírodní olej"],
    image: bedAlexis,
    basePrice: 21490,
    code: "ALX",
  },
  ella: {
    id: "ella",
    name: "ELLA family",
    tagline: "Praktická rodinná",
    description:
      "Nízký profil s úložným prostorem. Dost místa pro celou rodinu i pro sezónní věci.",
    highlights: ["Úložný prostor", "Masiv dub", "Bezpečné hrany"],
    image: bedElla,
    basePrice: 24990,
    code: "ELL",
  },
};

export const BED_LIST = Object.values(BEDS);

export type ConfigState = {
  bedId: BedId;
  size: "160x200" | "180x200";
  material: "buk" | "dub" | "imitace";
  surface: "prirodni" | "bily" | "grafit";
  storage: "ano" | "ne";
  corners: "rovne" | "oble";
};

export const DEFAULT_CONFIG: ConfigState = {
  bedId: "marika",
  size: "180x200",
  material: "dub",
  surface: "prirodni",
  storage: "ne",
  corners: "rovne",
};

const MATERIAL_MOD: Record<ConfigState["material"], number> = {
  buk: 0,
  dub: 2400,
  imitace: -3800,
};

const SURFACE_MOD: Record<ConfigState["surface"], number> = {
  prirodni: 0,
  bily: 900,
  grafit: 1400,
};

export function computePrice(config: ConfigState): number {
  const bed = BEDS[config.bedId];
  let price = bed.basePrice;
  if (config.size === "180x200") price += 1800;
  price += MATERIAL_MOD[config.material];
  price += SURFACE_MOD[config.surface];
  if (config.storage === "ano") price += 3600;
  if (config.corners === "oble") price += 700;
  return Math.max(9990, price);
}

export function computeCode(config: ConfigState): string {
  const bed = BEDS[config.bedId];
  const parts = [
    bed.code,
    config.size.replace("x", ""),
    config.material.slice(0, 3).toUpperCase(),
    config.surface.slice(0, 3).toUpperCase(),
    config.storage === "ano" ? "UP" : "STD",
    config.corners === "oble" ? "OBL" : "ROV",
  ];
  return parts.join("-");
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("cs-CZ", {
    style: "currency",
    currency: "CZK",
    maximumFractionDigits: 0,
  }).format(price);
}

export const DEALERS = [
  { city: "Praha", name: "BMB Studio Praha", phone: "+420 222 111 000", email: "praha@bmb.cz", address: "Vinohradská 25, Praha 2" },
  { city: "Brno", name: "Nábytek Krátký", phone: "+420 545 220 110", email: "brno@bmb.cz", address: "Veveří 12, Brno" },
  { city: "Ostrava", name: "Domov Studio", phone: "+420 596 110 220", email: "ostrava@bmb.cz", address: "Nádražní 88, Ostrava" },
  { city: "Plzeň", name: "BMB Showroom Plzeň", phone: "+420 377 220 330", email: "plzen@bmb.cz", address: "Klatovská 44, Plzeň" },
  { city: "Olomouc", name: "Interiéry Novák", phone: "+420 585 111 440", email: "olomouc@bmb.cz", address: "Horní náměstí 9, Olomouc" },
  { city: "Hradec Králové", name: "Studio Bydlení", phone: "+420 495 220 550", email: "hradec@bmb.cz", address: "Gočárova 11, Hradec Králové" },
  { city: "České Budějovice", name: "BMB Partner ČB", phone: "+420 386 110 660", email: "cb@bmb.cz", address: "Lannova 15, Č. Budějovice" },
  { city: "Liberec", name: "Nábytek Sever", phone: "+420 485 220 770", email: "liberec@bmb.cz", address: "Pražská 78, Liberec" },
];