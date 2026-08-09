/**
 * Datový model konfigurátoru BMB.
 *
 * Zdroje pravdy (ověřeno 2026):
 *  - https://bmb.cz/marika-klasik/  + ceník https://bmb.cz/soubory/kestazeni/cenik/cenik-rozmery-marika.pdf
 *  - https://bmb.cz/alexis/         + ceník https://bmb.cz/soubory/kestazeni/cenik/cenik-rozmery-alexis.pdf
 *  - https://bmb.cz/ella-family/    + ceník https://bmb.cz/soubory/kestazeni/cenik/cenik-rozmery-ella.pdf
 *
 * Ceny jsou s DPH, platnost ceníku od 1. 4. 2026.
 * Objednací kódy (obj. č.) pocházejí přímo z ceníků BMB.
 * Kombinace, pro které BMB cenu nezveřejňuje, se nedopočítávají — jsou označeny.
 */

import bedMarika from "@/assets/bed-marika.jpg";
import bedAlexis from "@/assets/bed-alexis.jpg";
import bedElla from "@/assets/bed-ella.jpg";

export type Selection = Record<string, string>;

export type Opt = {
  value: string;
  label: string;
  hint?: string;
};

export type ParamId =
  | "variant"
  | "material"
  | "width"
  | "length"
  | "corners"
  | "decor"
  | "storage";

export type Param = {
  id: ParamId;
  label: string;
  /** dostupné hodnoty závisí na aktuálním výběru (např. šířky u 1. varianty MARIKY) */
  options: (sel: Selection) => Opt[];
};

export type PriceLine = { label: string; amount?: number; note?: string };

export type Resolved = {
  code?: string;
  price?: number;
  base?: number;
  lines: PriceLine[];
  notes: string[];
};

export type Product = {
  id: string;
  name: string;
  tagline: string;
  image: string;
  sourceUrl: string;
  priceFrom: number;
  params: Param[];
  defaults: Selection;
  resolve: (sel: Selection) => Resolved;
};

/* ------------------------------------------------------------------ */
/* DEKORY (dle oficiálních produktových stránek)                        */
/* ------------------------------------------------------------------ */

type Decor = { value: string; label: string; group: string; pct?: number; pctNote?: string };

const slug = (s: string) =>
  s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const mk = (labels: string[], group: string, extra?: Partial<Decor>): Decor[] =>
  labels.map((l) => ({ value: slug(l), label: l, group, ...extra }));

/** Imitace masivního dřeva – 32 mm BMB standard (shodná nabídka u všech tří modelů) */
const DECORS_IMITACE: Decor[] = mk(
  [
    "Akát",
    "Bílé",
    "Borovice Kodiak",
    "Buk",
    "Dub Bardolino",
    "Dub Nebraska",
    "Dub šedý",
    "Dub Vicenza",
    "Kašmírově šedá",
    "Olše",
    "Ořech Carini",
    "Ořech Dijon",
    "Ořech natur",
    "Prémiově bílá",
  ],
  "Imitace masivního dřeva",
);

/** Dekory masivu BUK. Mořené odstíny +5 %, bílá barva +15 % (dle ceníku BMB). */
const DECORS_BUK: Decor[] = [
  ...mk(["Přírodní", "Přírodní vosk"], "Přírodní dezény"),
  ...mk(
    ["Bělený olej", "Eben olej", "Grafit olej", "Natur olej", "Ořech olej", "Palisandr olej", "Wenge olej"],
    "Olej",
  ),
  ...mk(
    ["Mahagon", "Tmavý ořech", "Jabloň", "Olše", "Bordó", "Káva", "Bělený", "Šedý", "Antracit", "Černý", "Grafit"],
    "Mořeno",
    { pct: 5, pctNote: "Buk moření +5 %" },
  ),
  ...mk(["Bílá"], "Barva", { pct: 15, pctNote: "Bílá na masiv buk +15 %" }),
];

/** Dekory masivu DUB. Bílý a bělený olej +5 % (dle ceníku BMB). */
const DECORS_DUB: Decor[] = [
  ...mk(["Eben olej", "Grafit olej", "Natur olej", "Origin olej", "Ořech olej", "Palisandr olej", "Wenge olej"], "Olej"),
  ...mk(["Bělený olej", "Bílý olej"], "Olej", { pct: 5, pctNote: "Dub bílý a bělený olej +5 %" }),
];

/** Drásané provedení – pouze masiv DUB PRŮBĚŽNÝ (ALEXIS, ELLA family), +5 %. */
const DECORS_DUB_DRASANY: Decor[] = mk(
  [
    "Drásaný bělený olej",
    "Drásaný bílý olej",
    "Drásaný grafit olej",
    "Drásaný natur olej",
    "Drásaný origin olej",
    "Drásaný palisandr olej",
    "Drásaný Wenge olej",
  ],
  "Drásané provedení",
  { pct: 5, pctNote: "Drásané provedení masiv dub průběžný +5 %" },
);

const decorsFor = (material: string): Decor[] => {
  if (material === "imitace") return DECORS_IMITACE;
  if (material.startsWith("buk")) return DECORS_BUK;
  if (material === "dub-prubezny") return [...DECORS_DUB, ...DECORS_DUB_DRASANY];
  return DECORS_DUB;
};

const decorOptions = (sel: Selection): Opt[] =>
  decorsFor(sel.material ?? "imitace").map((d) => ({
    value: d.value,
    label: d.label,
    hint: d.pct ? `+${d.pct} %` : d.group,
  }));

const findDecor = (material: string, value: string) =>
  decorsFor(material).find((d) => d.value === value);

const isMasiv = (material: string) => material !== "imitace";

const round = (n: number) => Math.round(n);

/* ------------------------------------------------------------------ */
/* MARIKA KLASIK                                                       */
/* ------------------------------------------------------------------ */

// pořadí sloupců ceníku: v1-160, v1-180, v2-90, v2-120, v2-140, v2-160, v2-180, v2-200
type MarikaKey = string; // `${variant}-${width}`
const MARIKA_COLS: MarikaKey[] = [
  "rost-160",
  "rost-180",
  "strednice-90",
  "strednice-120",
  "strednice-140",
  "strednice-160",
  "strednice-180",
  "strednice-200",
];

const marikaTable = (codes: string[], prices: number[]) =>
  Object.fromEntries(MARIKA_COLS.map((k, i) => [k, { code: codes[i], price: prices[i] }]));

const MARIKA_PRICES: Record<string, Record<string, { code: string; price: number }>> = {
  "imitace-rovne": marikaTable(
    ["LP34", "LP33", "LP33X1", "LP33X2", "LP33X3", "LP34X", "LP33X", "LP33X4"],
    [25359, 25359, 16169, 16817, 17825, 18219, 18617, 20666],
  ),
  "imitace-oble": marikaTable(
    ["KP34", "KP33", "KP33X1", "KP33X2", "KP33X3", "KP34X", "KP33X", "KP33X4"],
    [26805, 26805, 17426, 18122, 19210, 19633, 20065, 22272],
  ),
  "buk-cink-rovne": marikaTable(
    ["RBP47", "RBP46", "RBP46X1", "RBP46X2", "RBP46X3", "RBP47X", "RBP46X", "RBP46X4"],
    [51032, 51032, 39312, 40885, 43337, 44291, 44291, 49162],
  ),
  "buk-cink-oble": marikaTable(
    ["TBP93", "TBP92", "TBP92X1", "TBP92X2", "TBP92X3", "TBP93X", "TBP92X", "TBP92X4"],
    [51032, 51032, 39312, 40885, 43337, 44291, 44291, 49162],
  ),
  "dub-cink-rovne": marikaTable(
    ["RDP47", "RDP46", "RDP47X1", "RDP47X2", "RDP47X3", "RDP47X", "RDP46X", "RDP46X4"],
    [68893, 68893, 55166, 57372, 60816, 62153, 62153, 68989],
  ),
  "dub-cink-oble": marikaTable(
    ["TDP93", "TDP92", "TDP93X1", "TDP93X2", "TDP93X3", "TDP93X", "TDP92X", "TDP92X4"],
    [68893, 68893, 55166, 57372, 60816, 62153, 62153, 68989],
  ),
};

const MARIKA: Product = {
  id: "marika",
  name: "MARIKA klasik",
  tagline: "Naše nejprodávanější postel",
  image: bedMarika,
  sourceUrl: "https://bmb.cz/marika-klasik/",
  priceFrom: 16169,
  defaults: {
    size: "160",
    material: "imitace",
    corners: "rovne",
    decor: MARIKA_DECOR_DEFAULT.imitace,
  },
  params: [
    {
      id: "size",
      label: "Rozměr",
      options: () => [
        { value: "160", label: "160 × 200" },
        { value: "180", label: "180 × 200" },
      ],
    },
    {
      id: "material",
      label: "Materiál",
      options: () => [
        { value: "imitace", label: "Imitace masivu", hint: "32 mm · záruka 10 let" },
        { value: "buk-cink", label: "Masivní buk", hint: "40 mm · doživotní záruka" },
        { value: "dub-cink", label: "Masivní dub", hint: "40 mm · doživotní záruka" },
      ],
    },
    {
      id: "corners",
      label: "Rohy čel",
      options: () => [
        { value: "rovne", label: "Rovné rohy" },
        { value: "oble", label: "Oblé rohy" },
      ],
    },
    {
      id: "decor",
      label: "Dekor / povrch",
      options: (sel) =>
        (MARIKA_DECORS[sel.material ?? "imitace"] ?? MARIKA_DECORS.imitace).map((d) => ({
          value: d.value,
          label: d.label,
          hint: d.pct ? `+${d.pct} %` : undefined,
        })),
    },
  ],
  resolve: (sel) => {
    const key = `${sel.material}-${sel.corners}`;
    const col = `rost-${sel.size}`;
    const cell = MARIKA_PRICES[key]?.[col];
    const lines: PriceLine[] = [];
    const notes = [
      "Úložný prostor pod postelí je u obou variant v ceně (zdroj: bmb.cz/marika-klasik).",
      "Zjednodušená demo konfigurace: 1. varianta konstrukce (výklopný rošt), délka 200 cm.",
    ];
    if (!cell) {
      return { lines, notes: [...notes, "Pro tuto kombinaci ceník BMB cenu neuvádí."] };
    }
    let price = cell.price;
    lines.push({ label: "Základní cena dle ceníku", amount: cell.price });

    const decor = (MARIKA_DECORS[sel.material] ?? []).find((d) => d.value === sel.decor);
    if (decor?.pct) {
      const amount = round((cell.price * decor.pct) / 100);
      price += amount;
      lines.push({ label: decor.pctNote ?? `Dekor +${decor.pct} %`, amount });
    }

    return { code: cell.code, price: round(price), base: cell.price, lines, notes };
  },
};

/* ------------------------------------------------------------------ */
/* ALEXIS                                                              */
/* ------------------------------------------------------------------ */

const ALEXIS_WIDTHS = ["140", "160", "180", "200"];
const alexisTable = (codes: string[], prices: number[]) =>
  Object.fromEntries(ALEXIS_WIDTHS.map((w, i) => [w, { code: codes[i], price: prices[i] }]));

const ALEXIS_PRICES: Record<string, Record<string, { code: string; price: number }>> = {
  imitace: alexisTable(["LPA4", "LPA6", "LPA8", "LPA20"], [19286, 19711, 20144, 22358]),
  "buk-cink": alexisTable(["GBPA4", "GBPA6", "GBPA8", "GBPA20"], [38378, 40397, 42523, 46777]),
  "buk-prubezny": alexisTable(["GFPA4", "GFPA6", "GFPA8", "GFPA20"], [49230, 51821, 54549, 60006]),
  "dub-cink": alexisTable(["GDPA4", "GDPA6", "GDPA8", "GDPA20"], [49230, 51821, 54549, 60006]),
  "dub-prubezny": alexisTable(["GQPA4", "GQPA6", "GQPA8", "GQPA20"], [74544, 78466, 82596, 90853]),
};

const MASIV_OPTIONS: Opt[] = [
  { value: "imitace", label: "Imitace masivu", hint: "32 mm · záruka 10 let" },
  { value: "buk-cink", label: "Buk jádrový cink", hint: "40 mm · doživotní záruka" },
  { value: "buk-prubezny", label: "Buk průběžný", hint: "40 mm · doživotní záruka" },
  { value: "dub-cink", label: "Dub cink", hint: "40 mm · doživotní záruka" },
  { value: "dub-prubezny", label: "Dub průběžný", hint: "40 mm · doživotní záruka" },
];

const LENGTH_OPTIONS: Opt[] = [
  { value: "200", label: "200 cm" },
  { value: "210", label: "210 cm", hint: "příplatek" },
  { value: "220", label: "220 cm", hint: "příplatek" },
];

const ALEXIS: Product = {
  id: "alexis",
  name: "ALEXIS",
  tagline: "Kouzlo levitující postele",
  image: bedAlexis,
  sourceUrl: "https://bmb.cz/alexis/",
  priceFrom: 19286,
  defaults: {
    material: "imitace",
    width: "160",
    length: "200",
    decor: slug("Dub Bardolino"),
    storage: "bez-dna",
  },
  params: [
    { id: "material", label: "Materiál", options: () => MASIV_OPTIONS },
    {
      id: "width",
      label: "Šířka lehací plochy",
      options: () => ALEXIS_WIDTHS.map((w) => ({ value: w, label: `${w} cm` })),
    },
    { id: "length", label: "Délka lehací plochy", options: () => LENGTH_OPTIONS },
    { id: "decor", label: "Dekor", options: decorOptions },
    {
      id: "storage",
      label: "Dno úložného prostoru",
      options: () => [
        { value: "bez-dna", label: "Bez dna", hint: "Základní nabídka" },
        { value: "ltd", label: "Pevné LTD dno", hint: "+ 2 678 Kč" },
      ],
    },
  ],
  resolve: (sel) => {
    const cell = ALEXIS_PRICES[sel.material]?.[sel.width];
    const lines: PriceLine[] = [];
    const notes = [
      "ALEXIS se vyrábí pouze v rovném provedení čel — volba rohů se u tohoto modelu nenabízí (zdroj: bmb.cz/alexis).",
      "Úložný prostor vyžaduje výklopné rošty; v základní nabídce je bez dna.",
    ];
    if (!cell) return { lines, notes: [...notes, "Pro tuto kombinaci ceník BMB cenu neuvádí."] };

    let price = cell.price;
    lines.push({ label: "Základní cena dle ceníku", amount: cell.price });

    if (sel.length !== "200") {
      const surcharge =
        sel.length === "210" ? (isMasiv(sel.material) ? 1372 : 646) : isMasiv(sel.material) ? 2752 : 1284;
      price += surcharge;
      lines.push({ label: `Prodloužení na ${sel.length} cm`, amount: surcharge });
    }

    const decor = findDecor(sel.material, sel.decor);
    if (decor?.pct) {
      const amount = round((cell.price * decor.pct) / 100);
      price += amount;
      lines.push({ label: decor.pctNote ?? `Dekor +${decor.pct} %`, amount });
    }
    if (sel.material === "imitace") {
      notes.push("Prémiové dekory imitace mají příplatek +10 %; BMB veřejně neuvádí, které dekory do skupiny patří.");
    }

    if (sel.storage === "ltd") {
      price += 2678;
      lines.push({ label: "Pevné LTD dno úložného prostoru", amount: 2678 });
    }

    return { code: cell.code, price: round(price), base: cell.price, lines, notes };
  },
};

/* ------------------------------------------------------------------ */
/* ELLA FAMILY                                                         */
/* ------------------------------------------------------------------ */

const ELLA_WIDTHS = ["90", "120", "140", "160", "180", "200"];
const ellaTable = (codes: string[], prices: number[]) =>
  Object.fromEntries(ELLA_WIDTHS.map((w, i) => [w, { code: codes[i], price: prices[i] }]));

const ELLA_PRICES: Record<string, Record<string, { code: string; price: number }>> = {
  "imitace-rovne": ellaTable(
    ["LP865", "LP8592", "LP8593", "LP862", "LP859", "LP8594"],
    [11125, 12272, 13009, 13295, 13792, 15310],
  ),
  "imitace-oble": ellaTable(
    ["KP865", "KP8592", "KP8593", "KP862", "KP859", "KP8594"],
    [12237, 13500, 14308, 14624, 15170, 16837],
  ),
  "buk-cink-rovne": ellaTable(
    ["GBP15", "GBP132", "GBP133", "GBP14", "GBP13", "GBP134"],
    [22061, 25752, 27091, 28500, 29782, 34249],
  ),
  "buk-cink-oble": ellaTable(
    ["FBP15", "FBP132", "FBP133", "FBP14", "FBP13", "FBP134"],
    [22061, 25752, 27091, 28500, 29782, 34249],
  ),
  "buk-prubezny-rovne": ellaTable(
    ["GFP15", "GFP132", "GFP133", "GFP14", "GFP13", "GFP134"],
    [29956, 34962, 36778, 38692, 40439, 46506],
  ),
  "buk-prubezny-oble": ellaTable(
    ["FFP15", "FFP132", "FFP133", "FFP14", "FFP13", "FFP134"],
    [29956, 34962, 36778, 38692, 40439, 46506],
  ),
  "dub-cink-rovne": ellaTable(
    ["GDP15", "GDP132", "GDP133", "GDP14", "GDP13", "GDP134"],
    [29956, 34962, 36778, 38692, 40439, 46506],
  ),
  "dub-cink-oble": ellaTable(
    ["FDP15", "FDP132", "FDP133", "FDP14", "FDP13", "FDP134"],
    [29956, 34962, 36778, 38692, 40439, 46506],
  ),
  "dub-prubezny-rovne": ellaTable(
    ["GQP15", "GQP132", "GQP133", "GQP14", "GQP13", "GQP134"],
    [45532, 53141, 55906, 58812, 61470, 70691],
  ),
  "dub-prubezny-oble": ellaTable(
    ["FQP15", "FQP132", "FQP133", "FQP14", "FQP13", "FQP134"],
    [45532, 53141, 55906, 58812, 61470, 70691],
  ),
};

const ELLA: Product = {
  id: "ella",
  name: "ELLA family",
  tagline: "Moderní a mystická",
  image: bedElla,
  sourceUrl: "https://bmb.cz/ella-family/",
  priceFrom: 11125,
  defaults: {
    material: "imitace",
    width: "160",
    length: "200",
    corners: "rovne",
    decor: slug("Dub Bardolino"),
    storage: "ne",
  },
  params: [
    { id: "material", label: "Materiál", options: () => MASIV_OPTIONS },
    {
      id: "width",
      label: "Šířka lehací plochy",
      options: () => ELLA_WIDTHS.map((w) => ({ value: w, label: `${w} cm` })),
    },
    { id: "length", label: "Délka lehací plochy", options: () => LENGTH_OPTIONS },
    {
      id: "corners",
      label: "Rohy čel",
      options: () => [
        { value: "rovne", label: "Rovné rohy" },
        { value: "oble", label: "Oblé rohy" },
      ],
    },
    { id: "decor", label: "Dekor", options: decorOptions },
    {
      id: "storage",
      label: "Úložný prostor",
      options: () => [
        { value: "ne", label: "Bez úložného prostoru" },
        { value: "celoplosny", label: "Celoplošný", hint: "cena na dotaz" },
        { value: "zasuvka", label: "Boční zásuvka", hint: "cena na dotaz" },
        { value: "puleny", label: "Půlený", hint: "cena na dotaz" },
      ],
    },
  ],
  resolve: (sel) => {
    const cell = ELLA_PRICES[`${sel.material}-${sel.corners}`]?.[sel.width];
    const lines: PriceLine[] = [];
    const notes = [
      "Úložný prostor se u ELLA family dokupuje samostatně; ceník postelí ho neobsahuje (zdroj: bmb.cz/ella-family).",
    ];
    if (!cell) return { lines, notes: [...notes, "Pro tuto kombinaci ceník BMB cenu neuvádí."] };

    let price = cell.price;
    lines.push({ label: "Základní cena dle ceníku", amount: cell.price });

    if (sel.length !== "200") {
      const surcharge =
        sel.length === "210" ? (isMasiv(sel.material) ? 691 : 402) : isMasiv(sel.material) ? 1372 : 805;
      price += surcharge;
      lines.push({ label: `Prodloužení na ${sel.length} cm`, amount: surcharge });
    }

    const decor = findDecor(sel.material, sel.decor);
    if (decor?.pct) {
      const amount = round((cell.price * decor.pct) / 100);
      price += amount;
      lines.push({ label: decor.pctNote ?? `Dekor +${decor.pct} %`, amount });
    }
    if (sel.material === "imitace") {
      notes.push("Prémiové dekory imitace mají příplatek +10 %; BMB veřejně neuvádí, které dekory do skupiny patří.");
    }

    if (sel.storage !== "ne") {
      lines.push({ label: "Úložný prostor", note: "cenu doplní prodejce" });
    }

    return { code: cell.code, price: round(price), base: cell.price, lines, notes };
  },
};

/* ------------------------------------------------------------------ */

export const PRODUCTS: Record<string, Product> = {
  marika: MARIKA,
  alexis: ALEXIS,
  ella: ELLA,
};

export const PRODUCT_LIST = Object.values(PRODUCTS);

/** Vrátí výběr, ve kterém má každý parametr modelu platnou hodnotu. */
export function sanitize(product: Product, sel: Selection): Selection {
  const next: Selection = {};
  for (const param of product.params) {
    const options = param.options(next);
    const current = sel[param.id];
    next[param.id] =
      current && options.some((o) => o.value === current)
        ? current
        : (product.defaults[param.id] && options.some((o) => o.value === product.defaults[param.id])
            ? product.defaults[param.id]
            : options[0]?.value) ?? "";
  }
  return next;
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("cs-CZ", {
    style: "currency",
    currency: "CZK",
    maximumFractionDigits: 0,
  }).format(price);
}
