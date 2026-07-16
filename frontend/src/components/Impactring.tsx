import { useCountUp } from "../hooks/Usecountup"
import { Leaf } from "lucide-react"

interface ImpactRingProps {
  points: number
  goal: number // meta semanal, ex: 200 pontos
}

/**
 * Por quê este componente existe:
 * O donut original era genérico e sem contexto — não dizia se 40 pontos é bom
 * ou ruim. Um anel de META (pontos atuais / meta semanal) dá significado ao
 * número, do mesmo jeito que o anel de "calorias" do Google Fit ou o streak
 * do Duolingo fazem o usuário voltar todo dia pra completar o círculo.
 */
export default function ImpactRing({ points, goal }: ImpactRingProps) {
  const animatedPoints = useCountUp(points)
  const progress = Math.min(points / goal, 1)

  const radius = 78
  const circumference = 2 * Math.PI * radius
  const offset = circumference * (1 - progress)

  return (
    <div className="flex flex-col items-center gap-4 py-2">
      <div
        className="relative h-[200px] w-[200px]"
        style={{ ["--ring-start" as string]: circumference, ["--ring-end" as string]: offset }}
      >
        <svg viewBox="0 0 180 180" className="h-full w-full -rotate-90">
          <circle
            cx="90" cy="90" r={radius} fill="none"
            stroke="currentColor" className="text-white/5" strokeWidth="14"
          />
          <circle
            cx="90" cy="90" r={radius} fill="none"
            stroke="url(#ringGradient)" strokeWidth="14" strokeLinecap="round"
            strokeDasharray={circumference}
            className="animate-ring-fill"
          />
          <defs>
            <linearGradient id="ringGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#8BC53F" />
              <stop offset="100%" stopColor="#F2B705" />
            </linearGradient>
          </defs>
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <Leaf className="h-5 w-5 text-brand mb-1" />
          <span className="font-display text-4xl font-semibold text-white tabular-nums">
            {animatedPoints}
          </span>
          <span className="text-xs text-white/50">de {goal} pontos</span>
        </div>
      </div>

      <p className="text-sm text-white/70 text-center max-w-[220px]">
        {progress >= 1
          ? "Meta semanal concluída — parabéns! 🌱"
          : `Faltam ${goal - points} pontos para bater a meta desta semana`}
      </p>
    </div>
  )
}