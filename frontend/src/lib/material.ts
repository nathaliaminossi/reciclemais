import { Newspaper, Package, Wine, Magnet, type LucideIcon } from "lucide-react"

export interface MaterialConfig {
  label: string
  hex: string      // cor sólida (bordas, ícones, gráficos)
  bg: string        // classe tailwind pra fundo suave (10% opacidade)
  text: string       // classe tailwind pra texto/ícone
  icon: LucideIcon
}

/**
 * Por quê isto existe:
 * Antes, cor de material vivia espalhada em 3 lugares diferentes (RecycleBin
 * recebia string de classe Tailwind crua, RecyclingCard tinha cor fixa por
 * elemento, sem relação com o material real). Centralizar aqui garante que
 * "Papel" tem a MESMA cor e ícone em qualquer lugar do app — é isso que faz
 * o usuário aprender o código de cores de relance, tipo tag de linha de metrô.
 */
export const materialConfig: Record<string, MaterialConfig> = {
  papel: {
    label: "Papel",
    hex: "#4C8DFF",
    bg: "bg-[#4C8DFF]/10",
    text: "text-[#4C8DFF]",
    icon: Newspaper,
  },
  plastico: {
    label: "Plástico",
    hex: "#F2545B",
    bg: "bg-[#F2545B]/10",
    text: "text-[#F2545B]",
    icon: Package,
  },
  vidro: {
    label: "Vidro",
    hex: "#3FA65C",
    bg: "bg-[#3FA65C]/10",
    text: "text-[#3FA65C]",
    icon: Wine,
  },
  metal: {
    label: "Metal",
    hex: "#F2B705",
    bg: "bg-[#F2B705]/10",
    text: "text-[#F2B705]",
    icon: Magnet,
  },
}

// Fallback agora usa os tokens do tema (nada de branco fixo), então o
// ícone continua visível mesmo em cima do bg-card claro.
const fallback: MaterialConfig = {
  label: "Outro",
  hex: "var(--muted-foreground)",
  bg: "bg-muted",
  text: "text-muted-foreground",
  icon: Package,
}

// Remove acentos antes de comparar, pra "Plástico", "plastico" e "PLÁSTICO"
// caírem todos na mesma chave em vez de irem parar no fallback.
function normalize(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
}

export function getMaterialConfig(material: string): MaterialConfig {
  const key = normalize(material ?? "")
  return materialConfig[key] ?? fallback
}