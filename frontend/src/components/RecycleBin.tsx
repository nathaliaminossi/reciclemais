import { useState } from "react"
import { cn } from "@/lib/utils"
import { getMaterialConfig } from "@/lib/material"

type RecycleBinProps = {
  /** chave do material: "papel" | "plástico" | "vidro" | "metal" */
  material: string
  count?: number
  size?: "sm" | "md" | "lg"
}

const sizes = {
  sm: { lid: "w-12 h-2", body: "w-20 h-24" },
  md: { lid: "w-24 h-4", body: "w-24 h-28" },
  lg: { lid: "w-32 h-5", body: "w-28 h-32" },
}

/**
 * A tampa que abre ao clicar era o melhor detalhe original da tela — um
 * momento de personalidade que nenhum concorrente (Duolingo, Strava) tem,
 * porque é específico do domínio de vocês (lixeira de reciclagem). Mantive
 * a interação e só troquei a fonte de cor/ícone pra usar o token central de
 * material, e adicionei um selo de contagem — sem isso, o bin é só decoração;
 * com o número, ele vira dado.
 */
export function RecycleBin({ material, count, size = "md" }: RecycleBinProps) {
  const [open, setOpen] = useState(false)
  const { label, hex, bg, text, icon: Icon } = getMaterialConfig(material)

  return (
    <button
      type="button"
      className="group flex flex-col items-center gap-2 outline-none"
      onClick={() => setOpen((v) => !v)}
      aria-pressed={open}
      aria-label={`Lixeira de ${label}`}
    >
      <div className="relative">
        {count !== undefined && count > 0 && (
          <span
            className="absolute -top-2 -right-2 z-10 flex h-5 min-w-5 items-center justify-center
                       rounded-full bg-brand px-1 text-[11px] font-semibold text-surface"
          >
            {count}
          </span>
        )}

        {/* Tampa */}
        <div
          className={cn(
            "rounded-t-md origin-left transition-transform duration-300 ease-out",
            sizes[size].lid,
            open ? "-rotate-45" : "rotate-0 group-hover:-rotate-6"
          )}
          style={{ backgroundColor: hex }}
        />

        {/* Corpo */}
        <div
          className={cn(
            "flex flex-col items-center justify-center gap-1.5 rounded-b-xl border-t-2 shadow-inner",
            "transition-transform duration-200 group-hover:scale-[1.02]",
            sizes[size].body,
            bg
          )}
          style={{ borderColor: hex }}
        >
          <Icon size={20} className={text} />
          <span className={cn("text-xs font-medium", text)}>{label}</span>
        </div>
      </div>
    </button>
  )
}