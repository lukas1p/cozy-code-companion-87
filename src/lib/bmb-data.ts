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

// Ukázka reálných partnerských prodejen z bmb.cz/prodejny — jeden zástupce
// vybraného kraje. Kompletní síť čítá téměř 400 prodejců po ČR a SR.
export const DEALERS = [
  { city: "Praha", name: "JMP – Studio zdravého spaní", phone: "+420 251 510 480", email: "jmp@jmp.cz", address: "Radlická 10, 150 00 Praha 5" },
  { city: "Brno", name: "JMP – Studio zdravého spaní", phone: "+420 541 216 395", email: "brno@jmp.cz", address: "Masná 1, 602 00 Brno" },
  { city: "Ostrava", name: "Intena nábytek", phone: "+420 596 729 734", email: "obchod@intena.cz", address: "Grmelova 8, 709 00 Ostrava – Mariánské Hory" },
  { city: "Plzeň", name: "NO+BL Plzeň CZ", phone: "+420 377 221 135", email: "nobl.plzen@nobl-plzen.cz", address: "Přemyslova 1, 301 00 Plzeň" },
  { city: "Olomouc", name: "Nábytek Valášek – OC Haná", phone: "+420 585 221 740", email: "nabytek.valasek@tiscali.cz", address: "Kafkova 19, 779 00 Olomouc" },
  { city: "Hradec Králové", name: "Hany nábytek matrace", phone: "+420 603 466 367", email: "hany@hany.cz", address: "OD DON, Gočárova 1517/26, 500 02 Hradec Králové" },
  { city: "České Budějovice", name: "Postele pro zdravý spánek", phone: "+420 387 314 531", email: "prodejna@postelematrace.cz", address: "Rudolfská 1, 370 01 České Budějovice" },
  { city: "Liberec", name: "LH Zdravé spaní", phone: "+420 485 100 919", email: "info@lhzdravespani.cz", address: "Vrchlického 830/41, 460 14 Liberec – Ruprechtice" },
  { city: "Karlovy Vary", name: "NAPOBYT", phone: "+420 353 226 815", email: "nabytek@napobyt.cz", address: "Lidická 581/61, 360 20 Karlovy Vary" },
  { city: "Pardubice", name: "semQelb – centrum nábytku", phone: "+420 466 510 310", email: "nabytek1@semqelb.cz", address: "Smetanovo náměstí 48, 530 02 Pardubice" },
  { city: "Teplice", name: "LeRoy – Zdravotní spánkové studio", phone: "+420 775 100 663", email: "teplice@leroy.cz", address: "Masarykova tř. 1047/92, 415 01 Teplice" },
  { city: "Kolín", name: "Studio SEN", phone: "+420 321 714 345", email: "obchod@studiosen.cz", address: "Obecní dvůr 78, 280 02 Kolín" },
  { city: "Havlíčkův Brod", name: "Nábytek Petr Jelen", phone: "+420 569 424 427", email: "alej@nabytekjelen.cz", address: "OD Alej, Havlíčkova 3305, 580 01 Havlíčkův Brod" },
];