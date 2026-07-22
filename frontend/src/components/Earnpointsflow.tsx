import { UploadCloud, Sparkles, CheckCircle2, Award, ArrowRight } from "lucide-react"

interface Step {
  icon: typeof UploadCloud
  title: string
  description: string
}

const STEPS: Step[] = [
  {
    icon: UploadCloud,
    title: "Enviar foto",
    description: "Tire uma foto do material reciclado",
  },
  {
    icon: Sparkles,
    title: "IA analisa",
    description: "Nossa inteligência artificial verifica o material",
  },
  {
    icon: CheckCircle2,
    title: "Registro aprovado",
    description: "Sua reciclagem é validada automaticamente",
  },
  {
    icon: Award,
    title: "Ganhar pontos",
    description: "Os pontos são creditados na sua conta",
  },
]

export default function EarnPointsFlow() {
  return (
    <section className="rounded-3xl border border-border bg-card p-6 shadow-sm md:p-8">
      <div className="flex items-center gap-2">
        <Sparkles className="h-4 w-4 text-primary" />
        <span className="text-xs font-semibold uppercase tracking-wide text-primary">
          Como funciona
        </span>
      </div>

      <h2 className="mt-2 font-display text-2xl font-medium text-foreground">
        Como ganhar pontos
      </h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Do envio da foto até os pontos na sua conta, em quatro passos simples.
      </p>

      <div className="mt-8 flex flex-col items-stretch gap-3 md:flex-row md:items-center md:gap-2">
        {STEPS.map((step, index) => {
          const Icon = step.icon
          const isLast = index === STEPS.length - 1

          return (
            <div key={step.title} className="flex flex-1 items-center gap-2">
              <div className="relative flex flex-1 flex-col items-center gap-3 rounded-2xl border border-border/60 bg-background px-4 py-6 text-center">
                <span className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-[10px] font-semibold text-primary">
                  {index + 1}
                </span>
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{step.title}</p>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                    {step.description}
                  </p>
                </div>
              </div>

              {!isLast && (
                <ArrowRight className="hidden h-4 w-4 shrink-0 text-muted-foreground/40 md:block" />
              )}
            </div>
          )
        })}
      </div>
    </section>
  )
}