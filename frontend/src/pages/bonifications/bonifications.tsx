import {
  Gift,
  Zap,
  Droplet,
  Flame,
  Building2,
  Trophy,
  Target,
  Lock,
  CheckCircle2,
  Leaf,
  ArrowRight,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Toggle } from "@/components/ui/toggle";
import { useMemo, useState } from "react";
import { useAuth } from "@/context/authContext";
import type { Bonus } from "@/types/bonus";
import { useNavigate } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { getUser } from "@/api/userHome";
import { getBonus } from "@/api/bonusAdmin";

// Cada categoria de recompensa tem uma cor fixa, reaproveitando a paleta
// das lixeiras de coleta seletiva — mantém a identidade cromática do app
// sem depender só de verde.
const CATEGORY_STYLES = [
  { icon: Zap, bg: "bg-bin-metal/12", text: "text-bin-metal", border: "border-bin-metal/30", dot: "bg-bin-metal" },
  { icon: Droplet, bg: "bg-bin-paper/12", text: "text-bin-paper", border: "border-bin-paper/30", dot: "bg-bin-paper" },
  { icon: Flame, bg: "bg-bin-plastic/12", text: "text-bin-plastic", border: "border-bin-plastic/30", dot: "bg-bin-plastic" },
  { icon: Building2, bg: "bg-bin-glass/12", text: "text-bin-glass", border: "border-bin-glass/30", dot: "bg-bin-glass" },
];

type FilterOption = "todos" | "disponiveis" | "bloqueados";

export default function Bonifications() {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const { userId } = useAuth();

  const { data: user, isLoading } = useQuery({
    queryKey: ["profile", userId],
    queryFn: () => getUser(Number(userId), String(token)),
    enabled: !!userId && !!token,
  });

  const { data: bonus = [] } = useQuery({
    queryKey: ["bonus"],
    queryFn: () => getBonus(),
  });

  const points = user?.Points;
  const goal = 100;
  const progress = ((points ?? 0) / goal) * 100;
  const bonuses: Bonus[] = bonus || [];

  const [filter, setFilter] = useState<FilterOption>("todos");

  const safePoints = points ?? 0;
  const safeProgress = Math.min(100, Math.max(0, progress || 0));

  const sortedBonuses = useMemo(
    () => [...bonuses].sort((a, b) => a.prizePoints - b.prizePoints),
    [bonuses]
  );

  const availableBonuses = useMemo(
    () => sortedBonuses.filter((b) => safePoints >= b.prizePoints),
    [sortedBonuses, safePoints]
  );
  const lockedBonuses = useMemo(
    () => sortedBonuses.filter((b) => safePoints < b.prizePoints),
    [sortedBonuses, safePoints]
  );

  const filteredBonuses = useMemo(() => {
    if (filter === "disponiveis") return availableBonuses;
    if (filter === "bloqueados") return lockedBonuses;
    return sortedBonuses;
  }, [filter, sortedBonuses, availableBonuses, lockedBonuses]);

  const unlockedCount = availableBonuses.length;
  const nextBonus = lockedBonuses[0] ?? null;
  const pointsToNext = nextBonus ? nextBonus.prizePoints - safePoints : 0;
  const nextProgress = nextBonus
    ? Math.min(100, Math.round((safePoints / nextBonus.prizePoints) * 100))
    : 100;

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        {/* HERO */}
        <section className="relative overflow-hidden rounded-xl bg-gradient-to-br from-chart-2 to-primary p-8 sm:p-12">
          <div className="relative flex flex-col gap-8 sm:flex-row sm:items-center sm:justify-between">
            <div className="max-w-xl text-primary-foreground">
              <Badge className="mb-4 rounded-md border-primary-foreground/25 bg-primary-foreground/10 text-primary-foreground hover:bg-primary-foreground/10">
                <Leaf className="mr-1.5 h-3.5 w-3.5" /> Programa de recompensas
              </Badge>
              <h1 className="text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
                Transforme hábitos sustentáveis em recompensas reais
              </h1>
              <p className="mt-3 text-base text-primary-foreground/80">
                Acumule pontos com práticas sustentáveis e desbloqueie
                benefícios exclusivos.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Button
                  size="lg"
                  className="rounded-md bg-primary-foreground font-medium text-primary hover:bg-primary-foreground/90"
                  onClick={() => navigate("/userHome")}
                >
                  Ganhar pontos <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-md border-primary-foreground/30 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
                >
                  Como funciona
                </Button>
              </div>
            </div>
            <div className="hidden shrink-0 sm:block">
              <div className="flex h-28 w-28 items-center justify-center rounded-full border border-primary-foreground/15 bg-primary-foreground/10">
                <Trophy className="h-12 w-12 text-primary-foreground/90" />
              </div>
            </div>
          </div>
        </section>

        {/* PROGRESS */}
        <section className="mt-6">
          <Card className="rounded-xl border-border bg-card shadow-sm">
            <CardContent className="p-6 sm:p-8">
              <div className="flex flex-col gap-8 lg:flex-row lg:items-center">
                {/* Indicador circular */}
                <div className="relative mx-auto flex h-36 w-36 shrink-0 items-center justify-center">
                  <svg viewBox="0 0 120 120" className="h-36 w-36 -rotate-90">
                    <circle
                      cx="60"
                      cy="60"
                      r="52"
                      fill="none"
                      stroke="var(--border)"
                      strokeWidth="9"
                    />
                    <circle
                      cx="60"
                      cy="60"
                      r="52"
                      fill="none"
                      stroke="var(--primary)"
                      strokeWidth="9"
                      strokeLinecap="round"
                      strokeDasharray={`${(safeProgress / 100) * 326.7} 326.7`}
                      className="transition-all duration-700 "
                    />
                  </svg>
                  <div className="absolute flex flex-col items-center">
                    <span className="text-3xl font-semibold text-foreground">
                      {safePoints}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      de {goal} pts
                    </span>
                  </div>
                </div>

                {/* Conteúdo */}
                <div className="flex-1 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-lg font-semibold text-foreground">
                        Seu progresso
                      </h2>
                      <p className="text-sm text-muted-foreground">
                        Continue coletando pontos para o próximo prêmio
                      </p>
                    </div>
                    <Badge
                      variant="secondary"
                      className="rounded-md bg-secondary text-secondary-foreground hover:bg-secondary"
                    >
                      {Math.round(safeProgress)}%
                    </Badge>
                  </div>

                  <Progress
                    value={safeProgress}
                    className="h-2 rounded-full bg-muted [&>div]:bg-green-800"
                  />

                  {nextBonus ? (
                    <div className="rounded-lg border border-border bg-muted/50 p-4">
                      <div className="flex items-start gap-3">
                        <div className="rounded-md bg-card p-2 shadow-sm">
                          <Target className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-muted-foreground">
                            Faltam apenas
                          </p>
                          <p className="text-base font-medium text-foreground">
                            <span className="text-primary">
                              {pointsToNext} pontos
                            </span>{" "}
                            para desbloquear{" "}
                            <span className="text-foreground">
                              {nextBonus.namePrize}
                            </span>
                          </p>
                          <div className="mt-2">
                            <Progress
                              value={nextProgress}
                              className="h-1.5 rounded-full bg-muted [&>div]:bg-primary"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : bonuses.length > 0 ? (
                    <div className="rounded-lg border border-border bg-muted/50 p-4 text-center">
                      <Trophy className="mx-auto mb-1 h-5 w-5 text-primary" />
                      <p className="text-sm font-medium text-foreground">
                        Você desbloqueou todas as recompensas
                      </p>
                    </div>
                  ) : null}
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* FILTROS */}
        {!isLoading && bonuses.length > 0 && (
          <section className="mt-10 flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-xl font-semibold tracking-tight text-foreground">
              Recompensas
            </h2>
            <div className="inline-flex gap-1 rounded-md border border-border bg-card p-1">
              {(
                [
                  { key: "todos", label: `Todos (${bonuses.length})` },
                  {
                    key: "disponiveis",
                    label: `Disponíveis (${unlockedCount})`,
                  },
                  {
                    key: "bloqueados",
                    label: `Bloqueadas (${lockedBonuses.length})`,
                  },
                ] as const
              ).map(({ key, label }) => (
                <Toggle
                  key={key}
                  pressed={filter === key}
                  onPressedChange={() => setFilter(key)}
                  className="h-8 rounded-md px-3 text-xs font-medium text-muted-foreground data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
                >
                  {label}
                </Toggle>
              ))}
            </div>
          </section>
        )}

        {/* GRID DE RECOMPENSAS */}
        <section className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {isLoading &&
            Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="animate-pulse rounded-xl border-border bg-card">
                <CardContent className="space-y-3 p-6">
                  <div className="h-11 w-11 rounded-lg bg-muted" />
                  <div className="h-4 w-3/4 rounded bg-muted" />
                  <div className="h-3 w-full rounded bg-muted" />
                  <div className="h-2 w-full rounded bg-muted" />
                </CardContent>
              </Card>
            ))}

          {!isLoading &&
            filteredBonuses.map((b, index) => {
              const unlocked = safePoints >= b.prizePoints;
              const style = CATEGORY_STYLES[index % CATEGORY_STYLES.length];
              const CategoryIcon = style.icon;
              const pct = Math.min(
                100,
                Math.round((safePoints / b.prizePoints) * 100)
              );

              return (
                <Card
                  key={index}
                  className={`relative overflow-hidden rounded-xl border bg-card transition-shadow duration-200 hover:shadow-md ${
                    unlocked ? style.border : "border-border"
                  }`}
                >
                  <div className="absolute right-4 top-4 z-10">
                    {unlocked ? (
                      <Badge className="rounded-md border-0 bg-primary text-primary-foreground hover:bg-primary">
                        <CheckCircle2 className="mr-1 h-3 w-3" /> Disponível
                      </Badge>
                    ) : (
                      <Badge
                        variant="secondary"
                        className="rounded-md bg-muted text-muted-foreground"
                      >
                        <Lock className="mr-1 h-3 w-3" /> Bloqueado
                      </Badge>
                    )}
                  </div>

                  <CardContent className="p-6">
                    <div
                      className={`mb-4 inline-flex h-11 w-11 items-center justify-center rounded-lg ${
                        unlocked
                          ? `${style.bg} ${style.text}`
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      <CategoryIcon className="h-5 w-5" />
                    </div>

                    <h3 className="text-base font-semibold text-foreground">
                      {b?.namePrize}
                    </h3>
                    <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                      {b?.descricao}
                    </p>

                    <div className="mt-4 flex items-center gap-1.5 text-xs">
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          unlocked ? style.dot : "bg-muted-foreground/40"
                        }`}
                      />
                      <span className="font-medium text-foreground">
                        {b.prizePoints} pontos
                      </span>
                    </div>

                    <div className="mt-4">
                      <div className="mb-1.5 flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">Progresso</span>
                        <span
                          className={`font-medium ${
                            unlocked ? "text-primary" : "text-muted-foreground"
                          }`}
                        >
                          {unlocked ? "100%" : `${pct}%`}
                        </span>
                      </div>
                      <Progress
                        value={unlocked ? 100 : pct}
                        className={`h-1.5 rounded-full bg-muted ${
                          unlocked
                            ? "[&>div]:bg-primary"
                            : "[&>div]:bg-muted-foreground/40"
                        }`}
                      />
                    </div>
                  </CardContent>
                </Card>
              );
            })}
        </section>

        {/* EMPTY STATES */}
        {!isLoading && filteredBonuses.length === 0 && bonuses.length > 0 && (
          <EmptyState
            icon={<Gift className="h-6 w-6 text-primary" />}
            title="Nenhuma recompensa neste filtro"
            description="Tente selecionar outra categoria acima."
          />
        )}
        {!isLoading && bonuses.length === 0 && (
          <EmptyState
            icon={<Gift className="h-6 w-6 text-primary" />}
            title="Nenhuma recompensa disponível ainda"
            description="Volte em breve para conferir novas bonificações."
          />
        )}
      </div>
    </div>
  );
}

function EmptyState({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="mt-6 flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card p-12 text-center">
      <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-lg bg-muted">
        {icon}
      </div>
      <h3 className="text-base font-semibold text-foreground">{title}</h3>
      <p className="mt-1 text-sm text-muted-foreground">{description}</p>
    </div>
  );
}