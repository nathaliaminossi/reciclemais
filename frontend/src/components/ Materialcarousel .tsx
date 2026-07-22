import { useState } from "react";
import {
  Wine,
  FileText,
  GlassWater,
  CircleDot,
  Apple,
  Smartphone,
  Recycle,
  Clock,
  Lightbulb,
  Leaf,
  type LucideIcon,
} from "lucide-react";

interface Material {
  id: string;
  nome: string;
  icon: LucideIcon;
  exemplos: string;
  tempo: string;
  dica: string;
}

const MATERIAIS: Material[] = [
  {
    id: "plastico",
    nome: "Plástico",
    icon: Wine,
    exemplos: "Garrafas PET, potes e embalagens de produtos de limpeza.",
    tempo: "Até 450 anos para se decompor.",
    dica: "Lave e amasse a embalagem antes de descartar para ocupar menos espaço.",
  },
  {
    id: "papel",
    nome: "Papel",
    icon: FileText,
    exemplos: "Jornais, revistas, caixas de papelão e folhas de caderno.",
    tempo: "De 3 a 6 meses para se decompor.",
    dica: "Evite descartar papel engordurado ou molhado, ele não pode ser reciclado.",
  },
  {
    id: "vidro",
    nome: "Vidro",
    icon: GlassWater,
    exemplos: "Garrafas, potes de conserva e frascos de vidro em geral.",
    tempo: "Mais de 1000 anos para se decompor.",
    dica: "Cacos de vidro devem ser embrulhados em papel antes do descarte, por segurança.",
  },
  {
    id: "metal",
    nome: "Metal",
    icon: CircleDot,
    exemplos: "Latas de alumínio, latas de conserva e tampas metálicas.",
    tempo: "Até 500 anos para se decompor.",
    dica: "Latas de alumínio podem ser recicladas infinitas vezes sem perder qualidade.",
  },
  {
    id: "organico",
    nome: "Orgânico",
    icon: Apple,
    exemplos: "Cascas de fruta, restos de comida e borra de café.",
    tempo: "De 2 semanas a alguns meses para se decompor.",
    dica: "Pode virar adubo em casa através de compostagem doméstica.",
  },
  {
    id: "eletronico",
    nome: "Eletrônico",
    icon: Smartphone,
    exemplos: "Pilhas, baterias, celulares antigos e cabos.",
    tempo: "Pode levar séculos e libera substâncias tóxicas no solo.",
    dica: "Nunca descarte no lixo comum, leve a um ponto de coleta especializado.",
  },
];

export default function MaterialCarousel() {
  const [selecionadoId, setSelecionadoId] = useState(MATERIAIS[0].id);
  const selecionado = MATERIAIS.find((m) => m.id === selecionadoId) ?? MATERIAIS[0];
  const SelecionadoIcon = selecionado.icon;

  return (
    <section
      aria-label="Materiais recicláveis"
      className="w-full max-w-6xl mx-auto px-4 py-10"
    >
      <header className="mb-8 flex items-end justify-between gap-4 flex-wrap">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-[color:var(--leaf-soft)] px-3 py-1 text-xs font-semibold uppercase tracking-widest text-[color:var(--primary-deep)]">
            <Leaf size={14} /> Guia de reciclagem
          </div>
          <h2 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
            Aprenda a separar <span className="text-[color:var(--primary)]">cada material</span>
          </h2>
          <p className="mt-2 text-muted-foreground max-w-xl">
            Escolha um tipo de resíduo e descubra exemplos, tempo de decomposição e a melhor forma de descartar.
          </p>
        </div>
      </header>

      <div className="grid lg:grid-cols-[1fr_1.15fr] gap-6">
        {/* Sidebar de materiais */}
        <div
          role="tablist"
          aria-label="Escolha um material para ver detalhes"
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 gap-3 content-start"
        >
          {MATERIAIS.map((material) => {
            const Icon = material.icon;
            const ativo = material.id === selecionadoId;
            return (
              <button
                key={material.id}
                role="tab"
                aria-selected={ativo}
                onClick={() => setSelecionadoId(material.id)}
                className={[
                  "group relative flex items-center gap-3 rounded-2xl p-4 text-left transition-all duration-300",
                  "border focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--primary)]",
                  ativo
                    ? "border-transparent text-primary-foreground shadow-[var(--shadow-eco)] -translate-y-0.5"
                    : "border-border bg-card hover:border-[color:var(--primary)]/40 hover:-translate-y-0.5 hover:shadow-[var(--shadow-card)]",
                ].join(" ")}
style={
  ativo
    ? { backgroundColor: "var(--primary)" }
    : undefined
}              >
                <span
                  className={[
                    "grid h-11 w-11 shrink-0 place-items-center rounded-xl transition-colors",
                    ativo
                      ? "bg-white/20 text-primary-foreground"
                      : "bg-[color:var(--leaf-soft)] text-[color:var(--primary-deep)]",
                  ].join(" ")}
                >
                  <Icon size={22} aria-hidden="true" />
                </span>
                <div className="min-w-0">
                  <div className={["text-sm font-semibold", ativo ? "text-primary-foreground" : "text-foreground"].join(" ")}>
                    {material.nome}
                  </div>
                  <div className={["text-xs truncate", ativo ? "text-primary-foreground/80" : "text-muted-foreground"].join(" ")}>
                    Toque para ver detalhes
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Painel de detalhes */}
        <div
          role="tabpanel"
          aria-live="polite"
          className="relative overflow-hidden rounded-3xl border border-border bg-card p-8 shadow-[var(--shadow-card)]"
          style={{ backgroundImage: "var(--gradient-soft)" }}
        >
          <div
            aria-hidden="true"
            className="absolute -top-16 -right-16 h-56 w-56 rounded-full opacity-30 blur-3xl"
            style={{ backgroundImage: "var(--gradient-primary)" }}
          />

          <div className="relative flex items-center gap-4 mb-6">
            <div
              className="grid h-16 w-16 place-items-center rounded-2xl text-primary-foreground shadow-[var(--shadow-eco)]"
              style={{ backgroundImage: "var(--gradient-primary)" }}
            >
              <SelecionadoIcon size={30} aria-hidden="true" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-widest text-[color:var(--primary-deep)] font-semibold">
                Material selecionado
              </p>
              <h3 className="text-2xl font-bold text-foreground">{selecionado.nome}</h3>
            </div>
          </div>

          <div className="relative grid gap-3">
            <InfoCard icon={Recycle} label="Exemplos" text={selecionado.exemplos} />
            <InfoCard icon={Clock} label="Tempo de decomposição" text={selecionado.tempo} />
            <InfoCard icon={Lightbulb} label="Dica sustentável" text={selecionado.dica} highlight />
          </div>
        </div>
      </div>
    </section>
  );
}

function InfoCard({
  icon: Icon,
  label,
  text,
  highlight = false,
}: {
  icon: LucideIcon;
  label: string;
  text: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={[
        "flex items-start gap-3 rounded-2xl border p-4 backdrop-blur-sm transition-colors",
        highlight
          ? "border-[color:var(--primary)]/30 bg-white/80"
          : "border-border/60 bg-white/70 hover:bg-white",
      ].join(" ")}
    >
      <span
        className={[
          "grid h-9 w-9 shrink-0 place-items-center rounded-xl",
          highlight
            ? "bg-[color:var(--primary)] text-primary-foreground"
            : "bg-[color:var(--leaf-soft)] text-[color:var(--primary-deep)]",
        ].join(" ")}
      >
        <Icon size={18} aria-hidden="true" />
      </span>
      <div className="min-w-0">
        <div className="text-xs font-semibold uppercase tracking-wider text-[color:var(--primary-deep)]">
          {label}
        </div>
        <p className="text-sm text-foreground/80 leading-relaxed mt-0.5">{text}</p>
      </div>
    </div>
  );
}
