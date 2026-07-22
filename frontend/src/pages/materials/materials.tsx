import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useEffect, useMemo, useState } from "react"
import { useAuth } from "@/context/authContext"
import { useNavigate } from "react-router"
import MaterialCarousel from "@/components/ Materialcarousel "
import { Recycle, Search, Star, AlertCircle, PackageSearch, Loader2, Leaf, GlassWater, Package, Cpu } from "lucide-react"
import EvidenceVerificationSection from "@/components/ Evidenceverification"

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface Material {
  id: number
  name: string
  importance: number
  points: number
}

// Faixas de pontuação — ajuste os limites conforme a régua real do app
function getTier(points: number) {
  if (points >= 25) return { label: "Ouro", className: "bg-amber-100 text-amber-800 dark:bg-amber-500/15 dark:text-amber-300" }
  if (points >= 10) return { label: "Prata", className: "bg-slate-100 text-slate-700 dark:bg-slate-400/15 dark:text-slate-300" }
  return { label: "Bronze", className: "bg-orange-100 text-orange-800 dark:bg-orange-500/15 dark:text-orange-300" }
}

export default function Materials() {
  const [material, setMaterial] = useState<Material[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState("")

  const { userId } = useAuth()
  const navigate = useNavigate()
  const token = localStorage.getItem("token")

  useEffect(() => {
    if (!userId || !token) {
      navigate("/login")
      return
    }

    const getMaterial = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const response = await fetch("http://localhost:3000/material/", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        })

        const data = await response.json()
        if (!response.ok) {
          setError("Não foi possível carregar os materiais. Tente novamente.")
          return
        }
        setMaterial(data)
      } catch (e) {
        console.log(e)
        setError("Falha de conexão com o servidor.")
      } finally {
        setIsLoading(false)
      }
    }

    getMaterial()
  }, [userId, token, navigate])

  const filtered = useMemo(
    () => material.filter((m) => m.name.toLowerCase().includes(search.toLowerCase())),
    [material, search]
  )

  const stats = useMemo(() => {
    if (material.length === 0) return null
    const avg = material.reduce((sum, m) => sum + m.points, 0) / material.length
    const top = material.reduce((a, b) => (b.points > a.points ? b : a))
    return { total: material.length, avg: avg.toFixed(1), top }
  }, [material])

  const carouselItems = [
    { icon: Recycle, name: "Plástico", desc: "PET, PP, PEAD" },
    { icon: Leaf, name: "Orgânico", desc: "Restos e resíduos" },
    { icon: GlassWater, name: "Vidro", desc: "Garrafas e potes" },
    { icon: Package, name: "Papel", desc: "Papelão e jornal" },
    { icon: Cpu, name: "Eletrônico", desc: "Pilhas e placas" },
  ];


  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50/40 via-background to-background">
      <div className="mx-auto max-w-7xl px-2 py-8 space-y-12">
        {/* Header */}
        <section className="py-12 md:py-16">          <div className="mx-auto max-w-3xl text-center animate-fade-in">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border/70 bg-surface px-3 py-1.5 text-xs text-muted-foreground shadow-[var(--shadow-soft)]">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-60"></span>
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-primary"></span>
            </span>
            Análise por IA disponível
          </div>
          <h1 className="font-display text-4xl md:text-6xl font-bold tracking-tight">
            Guia de
            <span className="text-primary"> Materiais Recicláveis</span>
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-muted-foreground leading-relaxed">
            Conheça os materiais recicláveis, descubra sua importância e veja quantos
            pontos cada um pode gerar ao registrar uma reciclagem.
          </p>
          <div className="mt-8 flex items-center justify-center gap-3">

            <a
              href="#materials"
              className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-5 py-3 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
            >
              Ver materiais
            </a>
          </div>
        </div>
        </section>

        {/* Materials Carousel */}
        <section className="mb-10">
          <div className="mb-4 flex items-end justify-between">
            <h2 className="text-lg font-semibold text-foreground">
              Categorias de materiais
            </h2>
          </div>
          <Carousel opts={{ align: "start" }} className="w-full">
            <CarouselContent>
              {carouselItems.map((item) => (
                <CarouselItem
                  key={item.name}
                  className="basis-1/2 sm:basis-1/3 lg:basis-1/5"
                >
                  <div className="flex h-full flex-col gap-3 rounded-2xl border bg-card p-5 shadow-sm transition-colors hover:border-success/40">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-success-muted text-success">
                      <item.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">
                        {item.name}
                      </p>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </section>

        <div>
          <EvidenceVerificationSection />
        </div>

        {stats && (
          <div className="grid gap-5 md:grid-cols-3">
            <div className="rounded-3xl border bg-card p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg">            <p className="text-xs text-muted-foreground">Materiais cadastrados</p>
              <p className="text-2xl font-semibold">{stats.total}</p>
            </div>
            <div className="rounded-xl border p-4">
              <p className="text-xs uppercase tracking-wider text-muted-foreground">Média de pontos</p>
              <p className="mt-2 text-3xl font-bold">{stats.avg}</p>
            </div>
            <div className="rounded-xl border p-4">
              <p className="text-xs text-muted-foreground">Material mais valioso</p>
              <p className="text-2xl font-semibold truncate">{stats.top.name}</p>
            </div>
          </div>
        )}

        {/* Busca */}
        <div className="rounded-3xl border bg-card shadow-sm overflow-hidden">

          <div className="border-b p-6">

            <div className="flex items-center justify-between">

              <div>

                <h2 className="text-xl font-semibold">
                  Lista de materiais
                </h2>

                <p className="text-sm text-muted-foreground">
                  Consulte a importância e a pontuação de cada material.
                </p>

              </div>

              <div className="relative w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Buscar material..."
                  className="w-full rounded-lg border bg-background pl-9 pr-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-500/40"
                />
              </div>

              {/* Estado de erro */}
              {error && (
                <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 dark:bg-red-500/10 dark:border-red-500/30 p-4 text-sm text-red-700 dark:text-red-300">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  {error}
                </div>
              )}
            </div>


            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="font-semibold text-sm md:text-base">Material</TableHead>
                    <TableHead className="font-semibold text-sm md:text-base">Importância</TableHead>
                    <TableHead className="font-semibold text-sm md:text-base">Pontos</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {isLoading &&
                    Array.from({ length: 4 }).map((_, i) => (
                      <TableRow key={i}>
                        <TableCell colSpan={3} className="py-4">
                          <div className="flex items-center gap-2 text-muted-foreground text-sm">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Carregando...
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}

                  {!isLoading && !error && filtered.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={3} className="py-10">
                        <div className="flex flex-col items-center gap-2 text-muted-foreground">
                          <PackageSearch className="h-6 w-6" />
                          <p className="text-sm">Nenhum material encontrado.</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}

                  {!isLoading &&
                    filtered.map((item) => {
                      const tier = getTier(item.points)
                      return (
                        <TableRow
                          key={item.id}
                          className="border-b hover:bg-emerald-500/5 dark:hover:bg-emerald-500/10 transition-colors"
                        >
                          <TableCell className="text-sm md:text-base whitespace-nowrap font-medium">
                            {item.name}
                          </TableCell>

                          <TableCell className="text-sm md:text-base whitespace-nowrap">
                            <div className="flex items-center gap-0.5">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-4 w-4 ${i < item.importance
                                    ? "fill-amber-400 text-amber-400"
                                    : "text-muted-foreground/30"
                                    }`}
                                />
                              ))}
                            </div>
                          </TableCell>

                          <TableCell className="text-sm md:text-base">
                            <div className="flex items-center gap-2">
                              <span className="font-bold">{item.points}</span>
                              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${tier.className}`}>
                                {tier.label}
                              </span>
                            </div>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </div>
    </div>

  )
} 