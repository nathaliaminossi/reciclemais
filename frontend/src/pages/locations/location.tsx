import { useMemo, useState, lazy, Suspense, useEffect } from "react";
import {
  Search,
  MapPin,
  Navigation,
  Locate,
  Clock,
  Leaf,
  Recycle,
  Newspaper,
  Wine,
  Wrench,
  Cpu,
  BatteryCharging,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Toggle } from "@/components/ui/toggle";
import { useRef } from "react";
import SearchMap from "@/components/searchMap";
import UserMap from "@/components/userMap";



type MaterialKey = "Plástico" | "Papel" | "Vidro" | "Metal" | "Eletrônicos" | "Pilhas";

const MATERIALS: { key: MaterialKey; icon: React.ComponentType<{ className?: string }> }[] = [
  { key: "Plástico", icon: Recycle },
  { key: "Papel", icon: Newspaper },
  { key: "Vidro", icon: Wine },
  { key: "Metal", icon: Wrench },
  { key: "Eletrônicos", icon: Cpu },
  { key: "Pilhas", icon: BatteryCharging },
];



const ECOPONTOS = [
  {
    id: "1",
    name: "Ecoponto Vila Madalena",
    address: "Rua Harmonia, 456 — Vila Madalena",
    lat: -23.5545,
    lng: -46.6899,
    materials: ["Plástico", "Papel", "Vidro", "Metal"],
    open: true,
    distanceKm: 1.2,
  },
  {
    id: "2",
    name: "Coleta Consciente Pinheiros",
    address: "Av. Pedroso de Morais, 1200 — Pinheiros",
    lat: -23.5665,
    lng: -46.6928,
    materials: ["Eletrônicos", "Pilhas", "Metal"],
    open: true,
    distanceKm: 2.4,
  },
  {
    id: "3",
    name: "EcoPonto Paulista",
    address: "Av. Paulista, 900 — Bela Vista",
    lat: -23.5629,
    lng: -46.6544,
    materials: ["Papel", "Plástico", "Vidro"],
    open: false,
    distanceKm: 0.6,
  },
  {
    id: "4",
    name: "Central Verde Jardins",
    address: "Rua Oscar Freire, 320 — Jardins",
    lat: -23.5629,
    lng: -46.6721,
    materials: ["Vidro", "Metal", "Eletrônicos"],
    open: true,
    distanceKm: 1.8,
  },
  {
    id: "5",
    name: "Ponto Reciclar+ Perdizes",
    address: "Rua Cardoso de Almeida, 800 — Perdizes",
    lat: -23.5378,
    lng: -46.6795,
    materials: ["Pilhas", "Eletrônicos", "Plástico", "Papel"],
    open: true,
    distanceKm: 3.1,
  },
];

export default function Location() {
  const [query, setQuery] = useState("");
  const [active, setActive] = useState<Set<MaterialKey>>(new Set());
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [centerSignal, setCenterSignal] = useState(0);
  const [mounted, setMounted] = useState(false);
  const mapRef = useRef(null);

  useEffect(() => setMounted(true), []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return ECOPONTOS.filter((p) => {
      const matchesQ =
        !q || p.name.toLowerCase().includes(q) || p.address.toLowerCase().includes(q);
      const matchesM =
        active.size === 0 ||
        [...active].every((m) => p.materials.includes(m));
      return matchesQ && matchesM;
    }).sort((a, b) => a.distanceKm - b.distanceKm);
  }, [query, active]);

  const toggleMaterial = (m: MaterialKey) => {
    setActive((prev) => {
      const next = new Set(prev);
      if (next.has(m)) next.delete(m);
      else next.add(m);
      return next;
    });
  };

  const openRoute = (lat: number, lng: number) => {
    window.open(
      `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`,
      "_blank",
      "noopener,noreferrer",
    );
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-secondary/40 via-background to-background">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:py-12">
        {/* Header */}
        <header className="mb-8 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/25">
            <Leaf className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">Localização</h1>
            <p className="text-sm text-muted-foreground">
              Encontre ecopontos próximos e descarte com consciência.
            </p>
          </div>
        </header>

        {/* Search + filters */}
        <Card className="rounded-3xl border-border/60 shadow-sm">
          <CardContent className="space-y-4 p-4 sm:p-5">
            <div className="relative">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
             <SearchMap mapRef={mapRef} />
            </div>
            <div className="flex flex-wrap gap-2">
              {MATERIALS.map(({ key, icon: Icon }) => {
                const on = active.has(key);
                return (
                  <Toggle
                    key={key}
                    pressed={on}
                    onPressedChange={() => toggleMaterial(key)}
                    className="h-9 gap-1.5 rounded-full border border-border/60 bg-background px-3.5 text-xs font-medium text-foreground data-[state=on]:border-primary data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
                  >
                    <Icon className="h-3.5 w-3.5" />
                    {key}
                  </Toggle>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Result count */}
        <Card className="mt-4 rounded-3xl border-primary/20 bg-primary/5 shadow-sm">
          <CardContent className="flex items-center justify-between gap-3 p-4 sm:p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/15 text-primary">
                <MapPin className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Encontramos</p>
                <p className="text-base font-semibold text-foreground">
                  {filtered.length}{" "}
                  {filtered.length === 1 ? "ecoponto próximo" : "ecopontos próximos"} de você
                </p>
              </div>
            </div>
            <Badge variant="secondary" className="hidden rounded-full bg-primary/10 text-primary sm:inline-flex">
              Raio 5 km
            </Badge>
          </CardContent>
        </Card>

        {/* Map */}
<div
  className="
    relative
    mt-4
    h-[520px]
    overflow-hidden
    rounded-3xl
    border
    border-border/60
    shadow-lg
    z-0
  "
>          {mounted ? (
            <div className="h-full w-full">
    <UserMap mapRef={mapRef} />
</div>
          ) : (
            <div className="h-full w-full animate-pulse bg-muted" />
          )}

          <Button
            onClick={() => setCenterSignal((n) => n + 1)}
            size="icon"
            className="absolute bottom-5 right-5 z-[1000] h-12 w-12 rounded-full shadow-xl shadow-primary/30"
            aria-label="Centralizar minha localização"
          >
            <Locate className="h-5 w-5" />
          </Button>
        </div>

        {/* Cards list */}
        <section className="mt-6 grid gap-4 sm:grid-cols-2">
          {filtered.map((p) => (
            <Card
              key={p.id}
              onClick={() => setSelectedId(p.id)}
              className={`group cursor-pointer rounded-3xl border-border/60 shadow-sm transition hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md ${
                selectedId === p.id ? "border-primary/60 ring-2 ring-primary/20" : ""
              }`}
            >
              <CardContent className="space-y-3 p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="truncate text-base font-semibold text-foreground">
                      {p.name}
                    </h3>
                    <p className="mt-0.5 flex items-center gap-1.5 text-xs text-muted-foreground">
                      <MapPin className="h-3.5 w-3.5 shrink-0" />
                      <span className="truncate">{p.address}</span>
                    </p>
                  </div>
                  <Badge
                    variant="secondary"
                    className={`shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-medium ${
                      p.open
                        ? "bg-primary/12 text-primary"
                        : "bg-destructive/10 text-destructive"
                    }`}
                  >
                    <Clock className="mr-1 h-3 w-3" />
                    {p.open ? "Aberto" : "Fechado"}
                  </Badge>
                </div>

                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Navigation className="h-3.5 w-3.5 text-primary" />
                  <span className="font-medium text-foreground">
                    {p.distanceKm.toFixed(1)} km
                  </span>
                  de você
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {p.materials.map((m) => (
                    <Badge
                      key={m}
                      variant="outline"
                      className="rounded-full border-border/60 bg-secondary/50 px-2.5 py-0.5 text-[11px] font-normal text-secondary-foreground"
                    >
                      {m}
                    </Badge>
                  ))}
                </div>

                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    openRoute(p.lat, p.lng);
                  }}
                  className="mt-1 h-10 w-full rounded-xl shadow-sm shadow-primary/20"
                >
                  <Navigation className="mr-2 h-4 w-4" />
                  Traçar rota
                </Button>
              </CardContent>
            </Card>
          ))}

          {filtered.length === 0 && (
            <Card className="rounded-3xl border-dashed sm:col-span-2">
              <CardContent className="flex flex-col items-center gap-2 p-10 text-center">
                <MapPin className="h-8 w-8 text-muted-foreground" />
                <p className="text-sm font-medium">Nenhum ecoponto encontrado</p>
                <p className="text-xs text-muted-foreground">
                  Tente remover filtros ou ajustar a busca.
                </p>
              </CardContent>
            </Card>
          )}
        </section>
      </div>
    </main>
  );
}
