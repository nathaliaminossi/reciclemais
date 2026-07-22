import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import ReciclyngModal, { type RecyclingFormData } from "@/components/reciclyngModal"
import RecyclingCard from "@/components/recyclingCard"
import ImpactRing from "@/components/Impactring"
import { RecycleBin } from "@/components/RecycleBin"
import EarnPointsFlow from "@/components/Earnpointsflow"
import QuickStats from "@/components/Quickstats"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { getUser, createDelivery } from "@/api/userHome"
import { ArchiveRestore, Award, PlusCircle, Sprout } from "lucide-react"
import { useAuth } from "../../context/authContext"
import { useSnackbar } from "notistack"
import "../../global.css"
import HeroImageEffect from "@/components/HeroImageEffect"
import MaterialCarousel from "@/components/ Materialcarousel "
import CardInfoUh from "@/components/cardInfoUh"

interface User {
  id: number
  name: string
  email: string
  cpf: string
  Points: number
  fotoPerfil: string
  bio?: string
  // TODO: substituir por dado real assim que o backend expuser conquistas
  achievements?: { id: number }[]
}

const WEEKLY_GOAL = 200

const MATERIALS = ["papel", "plástico", "vidro", "metal"]

export default function UserHome() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { enqueueSnackbar } = useSnackbar()
  const token = localStorage.getItem("token")
  const { userId } = useAuth()
  const queryClient = useQueryClient()

  const { data: user } = useQuery({
    queryKey: ["profile", userId],
    queryFn: () => getUser(Number(userId), String(token)),
    enabled: !!userId && !!token,
  })

  const deliveries = user?.delivery || []
  const points = user?.Points || 0

  // TODO: quando o backend retornar o progresso semanal real, trocar `points`
  // por esse valor. Por enquanto reaproveitamos a mesma base usada no ImpactRing.
  const weeklyProgress = Math.min(points, WEEKLY_GOAL)
  const achievementsCount = user?.achievements?.length ?? 0

  const countsByMaterial = useMemo(() => {
    return deliveries.reduce((acc: Record<string, number>, item: any) => {
      const key = item.materialType?.toLowerCase().trim()
      acc[key] = (acc[key] || 0) + 1
      return acc
    }, {})
  }, [deliveries])

  const createDeliveryMutation = useMutation({
    mutationFn: (data: RecyclingFormData) =>
      createDelivery(data.localizacao, data.material, Number(data.quantidade), String(token), userId!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile", userId] })
      enqueueSnackbar("Reciclagem cadastrada com sucesso!", {
        variant: "success",
        anchorOrigin: { vertical: "top", horizontal: "right" },
      })
    },
  })

  function handleAddRecycling(data: RecyclingFormData) {
    createDeliveryMutation.mutate(data)
    setIsModalOpen(false)
  }

  return (
    <div className="max-w-7xl mx-auto w-[92%] py-8 space-y-10">
      <ReciclyngModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSubmit={handleAddRecycling} />

      {/* HERO */}
      {/* HERO */}
      <section className="relative overflow-hidden py-6">
        <div className="absolute right-0 top-24 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-chart-3/20 blur-3xl" />
        <div className="absolute -bottom-20 left-0 h-60 w-60 rounded-full bg-chart-3/10 blur-3xl" />

        <div className="relative flex flex-col lg:flex-row justify-between items-center gap-10">
          {/* Texto */}
          <div className="max-w-xl space-y-4">
            <span className="inline-flex items-center gap-2 rounded-full bg-card/70 px-4 py-2 text-xs font-semibold text-primary shadow-sm backdrop-blur">
              <Sprout size={15} />
              Sua jornada sustentável
            </span>

            <h1 className="font-display text-4xl font-medium leading-[1.05] tracking-tight text-foreground md:text-5xl lg:text-6xl">
              Bem-vindo de volta,
              <br />
              <span className="text-primary">
                {user?.name?.split(" ")[0] || "Usuário"}
              </span>
            </h1>

            <p className="max-w-md text-[15px] leading-relaxed text-muted-foreground">
              {user?.bio ||
                "Cada entrega registrada representa menos resíduos na natureza e mais impacto positivo para o planeta."}
            </p>


            <div className="flex flex-wrap gap-4 pt-2">
              <CardInfoUh />
            </div>
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <Button
                onClick={() => setIsModalOpen(true)}
                className="rounded-full px-6 py-6 bg-primary text-primary-foreground shadow-lg hover:bg-primary/90"
              >
                <PlusCircle className="mr-2 h-5 w-5" />
                Adicionar reciclagem
              </Button>

              <Button
                variant="outline"
                className="rounded-full px-6 py-6 border-border text-foreground hover:bg-muted"
                onClick={() => document.getElementById("impacto")?.scrollIntoView({ behavior: "smooth" })}
              >
                Ver meu impacto
              </Button>
            </div>

            {/* Indicador rápido — preenche o espaço com dado real, não decoração */}
            <div className="flex items-center gap-2 pt-2 text-sm text-muted-foreground">
              <Award className="h-4 w-4 text-primary" />
              Você já soma{" "}
              <span className="font-semibold text-foreground">
                {points.toLocaleString("pt-BR")} pontos
              </span>
            </div>
          </div>

          {/* Ilustração */}
          <div className="hidden lg:flex items-center justify-center flex-1">
            <HeroImageEffect />
          </div>
        </div>
      </section>

      <Separator className="bg-border bg-"   />


      {/* ESTATÍSTICAS RÁPIDAS */}
      <div>
        <QuickStats
          points={points}
          recyclingCount={deliveries.length}
          achievementsCount={achievementsCount}
          weeklyGoal={WEEKLY_GOAL}
          weeklyProgress={weeklyProgress}
        />
      </div>

      {/* COMO GANHAR PONTOS */}
      <div>
        <EarnPointsFlow />
      </div>


      {/* ÁREA PRINCIPAL */}
      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 ">
        {/* REGISTROS */}
        <div className="flex-[2] space-y-4 ">
          <div className="flex items-center gap-2 ">
            <ArchiveRestore className="text-primary" size={18} />
            <h2 className="font-semibold text-foreground">Registros realizados</h2>
            <span className="text-xs text-muted-foreground">({deliveries.length})</span>
          </div>

          <ScrollArea className="h-[55vh] lg:h-[48vh] rounded-2xl border border-border bg-card p-4">
            {deliveries.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                  <Sprout className="text-primary" size={24} />
                </div>
                <div>
                  <p className="text-foreground font-medium">Nenhuma reciclagem por aqui ainda</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Registre sua primeira entrega e comece a ganhar pontos
                  </p>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  className="rounded-full mt-1 border-border"
                  onClick={() => setIsModalOpen(true)}
                >
                  Registrar agora
                </Button>
              </div>
            ) : (
              <div className="space-y-2.5">
                {deliveries.map((item: any, index: number) => (
                  <RecyclingCard
                    key={item.id ?? index}
                    material={item.materialType}
                    Peso={item.Peso}
                    localizacao={item.deliveryLocal}
                    index={index}
                  />
                ))}
              </div>
            )}
          </ScrollArea>
        </div>

        {/* IMPACTO */}
        <div className="flex-1">
          <Card className="lg:sticky lg:top-6 rounded-2xl border border-border bg-card shadow-sm">
            <CardHeader>
              <CardTitle id="impacto" className="text-base font-medium text-foreground">Seu impacto</CardTitle>
            </CardHeader>
            <CardContent>
              <ImpactRing points={points} goal={WEEKLY_GOAL} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}