import { MapPin, Scale } from "lucide-react"
import { getMaterialConfig } from "@/lib/material"

interface RecyclingCardProps {
  material: string
  Peso: number | string
  localizacao: string
  /** índice na lista, usado só pra escalonar a animação de entrada */
  index?: number
}

/**
 * Redesenho: antes era texto empilhado sem hierarquia, com um ícone de
 * lixeira sempre azul (bug — não acompanhava o material). Agora funciona
 * como um item de feed de atividade (padrão Strava): ícone do material
 * dentro de um círculo colorido, título + metadados numa linha, borda
 * esquerda sutil pra escaneabilidade quando há muitos registros na lista.
 */
export default function RecyclingCard({ material, Peso, localizacao, index = 0 }: RecyclingCardProps) {
  const { label, bg, text, icon: Icon } = getMaterialConfig(material)

  return (
    <div
      className="group flex items-center gap-4 rounded-xl border border-white/5 bg-surface-raised/40 p-3.5
                 transition-all duration-200 hover:border-white/10 hover:bg-surface-raised/70
                 animate-fade-up"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${bg}`}>
        <Icon size={20} className={text} />
      </div>

      <div className="min-w-0 flex-1">
        <h3 className="font-medium text-white truncate">{label}</h3>
        <div className="mt-0.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-white/50">
          <span className="flex items-center gap-1">
            <Scale size={13} />
            {Peso} kg
          </span>
          <span className="flex items-center gap-1 truncate">
            <MapPin size={13} />
            {localizacao}
          </span>
        </div>
      </div>
    </div>
  )
}