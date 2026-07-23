import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight, ShieldCheck, Factory, Hammer, Cpu, Award, TreePine } from "lucide-react";
import workshop1 from "@/assets/workshop-1.jpg";
import workshop2 from "@/assets/workshop-2.jpg";
import ref1 from "@/assets/reference-1.jpg";
import { Reveal } from "@/components/site/reveal";

export const Route = createFileRoute("/proc-bmb")({
  head: () => ({
    meta: [
      { title: "Proč BMB — česká výroba postelí od 1992" },
      { name: "description", content: "Vlastní česká továrna, ruční kontrola kvality, moderní technologie a doživotní záruka na masiv." },
      { property: "og:title", content: "Proč BMB — česká výroba postelí" },
      { property: "og:description", content: "Vlastní továrna, ruční kontrola, doživotní záruka." },
    ],
  }),
  component: ProcBmb,
});

const PILLARS = [
  { icon: Factory, title: "Vlastní továrna", text: "Vše, od řeziva po finální olej, probíhá pod jednou střechou ve Ždánicích na jižní Moravě." },
  { icon: Hammer, title: "Poctivé řemeslo", text: "Spoje sesazujeme ručně a každý kus prochází kontrolou zkušených truhlářů." },
  { icon: Cpu, title: "Moderní technologie", text: "CNC obrábění, přesné brusky a klimatizovaná sušárna zajišťují stabilitu na desetiletí." },
  { icon: TreePine, title: "České dřevo", text: "Buk a dub z prověřených českých pil s certifikátem PEFC." },
  { icon: ShieldCheck, title: "Kontrola kvality", text: "Každý spoj, každý povrch. Pokud něco nesplní naše kritéria, nejde ven z továrny." },
  { icon: Award, title: "Česká kvalita", text: "Držitel certifikátu Česká kvalita a vítěz řady oborových ocenění." },
];

function ProcBmb() {
  return (
    <div className="pt-24 pb-24">
      <div className="container-bmb">
        <Reveal>
          <div className="text-eyebrow text-accent">Proč BMB</div>
          <h1 className="text-display mt-4 max-w-4xl text-5xl leading-[1.02] sm:text-6xl lg:text-[5rem]">
            32 let výroby, které cítíte v každém spoji.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            Nevyrábíme postele levně, vyrábíme je nadčasově. Do jednoho modelu
            jde tři měsíce sušení dřeva, ruční sesazení spojů a tři vrstvy oleje.
          </p>
        </Reveal>

        <Reveal className="mt-20 overflow-hidden rounded-[2rem]" delay={80}>
          <img src={workshop1} alt="Ruční kontrola" className="h-[520px] w-full object-cover" loading="lazy" />
        </Reveal>

        <div className="mt-24 grid gap-x-10 gap-y-14 md:grid-cols-2 lg:grid-cols-3">
          {PILLARS.map((p, i) => (
            <Reveal key={p.title} delay={i * 60}>
              <p.icon className="h-7 w-7 stroke-[1.4] text-accent" />
              <div className="text-display mt-6 text-2xl">{p.title}</div>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{p.text}</p>
            </Reveal>
          ))}
        </div>

        <div className="mt-28 grid gap-10 lg:grid-cols-2 lg:items-center">
          <Reveal>
            <img src={workshop2} alt="Sušárna masivu" className="w-full rounded-3xl object-cover" loading="lazy" />
          </Reveal>
          <Reveal delay={100}>
            <div className="text-eyebrow text-accent">Záruka</div>
            <h2 className="text-display mt-4 text-4xl sm:text-5xl">Doživotní záruka na masiv.</h2>
            <p className="mt-6 max-w-lg text-base leading-relaxed text-muted-foreground">
              Pokud u kterékoli postele z masivu buku nebo dubu selže konstrukce,
              opravíme ji. Bez ohledu na to, jak dlouho vám postel slouží.
              Modely v imitaci masivu kryje záruka 10 let.
            </p>
            <Link
              to="/konfigurator"
              className="group mt-10 inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3.5 text-sm font-medium text-background transition-all hover:bg-accent hover:text-accent-foreground"
            >
              Spustit konfigurátor
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </Reveal>
        </div>

        <Reveal className="mt-28 overflow-hidden rounded-[2rem]" delay={120}>
          <img src={ref1} alt="Výsledná ložnice" className="h-[520px] w-full object-cover" loading="lazy" />
        </Reveal>
      </div>
    </div>
  );
}