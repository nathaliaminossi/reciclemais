import { Award, Recycle, Trophy, Target } from "lucide-react"
import { Progress } from "@/components/ui/progress"

interface QuickStatsProps {
  points: number
  recyclingCount: number
  achievementsCount: number
  weeklyGoal: number
  weeklyProgress: number
}

export default function QuickStats({
  points,
  recyclingCount,
  achievementsCount,
  weeklyGoal,
  weeklyProgress,
}: QuickStatsProps) {
  const goalPercent = Math.min(100, Math.round((weeklyProgress / weeklyGoal) * 100))

  const stats = [
    { label: "Pontos", value: points, icon: Award },
    { label: "Reciclagens", value: recyclingCount, icon: Recycle },
    { label: "Conquistas", value: achievementsCount, icon: Trophy },
  ]

  return (
    <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon
        return (
          <div
            key={stat.label}
            className="flex items-center gap-4 rounded-2xl border border-border bg-card p-5 shadow-sm"
          >
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/10">
              <Icon className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
              <p className="text-xl font-semibold text-foreground">
                {stat.value.toLocaleString("pt-BR")}
              </p>
            </div>
          </div>
        )
      })}

      <div className="flex flex-col justify-center gap-2.5 rounded-2xl border border-border bg-card p-5 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/10">
            <Target className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Meta da semana</p>
            <p className="text-xl font-semibold text-foreground">
              {weeklyProgress}/{weeklyGoal} pts
            </p>
          </div>
        </div>
        <Progress value={goalPercent} className="h-1.5" />
      </div>
    </section>
  )
}