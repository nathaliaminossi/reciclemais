import { useEffect, useRef } from "react";
import L from "leaflet";

export type Ecoponto = {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  materials: string[];
  open: boolean;
  distanceKm: number;
};

type Props = {
  user: { lat: number; lng: number };
  points: Ecoponto[];
  activeId?: string | null;
  onSelect?: (id: string) => void;
  centerSignal?: number;
};

export default function LocationMap({ user, points, activeId, onSelect, centerSignal }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<Record<string, L.Marker>>({});
  const userMarkerRef = useRef<L.Marker | null>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    const map = L.map(containerRef.current, { zoomControl: false }).setView([user.lat, user.lng], 14);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap",
      maxZoom: 19,
    }).addTo(map);
    L.control.zoom({ position: "topright" }).addTo(map);
    mapRef.current = map;
  }, [user.lat, user.lng]);

  // User marker
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    const icon = L.divIcon({
      className: "",
      html: `<div style="width:18px;height:18px;border-radius:9999px;background:oklch(0.58 0.15 150);border:3px solid white;box-shadow:0 0 0 3px oklch(0.58 0.15 150 / 0.35)"></div>`,
      iconSize: [18, 18],
      iconAnchor: [9, 9],
    });
    if (userMarkerRef.current) userMarkerRef.current.remove();
    userMarkerRef.current = L.marker([user.lat, user.lng], { icon }).addTo(map).bindPopup("Você está aqui");
  }, [user.lat, user.lng]);

  // Ecopontos
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    Object.values(markersRef.current).forEach((m) => m.remove());
    markersRef.current = {};
    points.forEach((p) => {
      const icon = L.divIcon({
        className: "",
        html: `<div style="display:flex;align-items:center;justify-content:center;width:34px;height:34px;border-radius:9999px;background:white;border:2px solid oklch(0.58 0.15 150);box-shadow:0 4px 12px rgba(0,0,0,0.15)">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="oklch(0.45 0.15 150)" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 19H3v-4"/><path d="m5 15 4-7 3 5"/><path d="M17 5h4v4"/><path d="m19 9-4 7-3-5"/><path d="M9 19h9a2 2 0 0 0 1.7-3L18 13"/></svg>
        </div>`,
        iconSize: [34, 34],
        iconAnchor: [17, 17],
      });
      const m = L.marker([p.lat, p.lng], { icon }).addTo(map);
      m.bindPopup(`<strong>${p.name}</strong><br/>${p.address}`);
      m.on("click", () => onSelect?.(p.id));
      markersRef.current[p.id] = m;
    });
  }, [points, onSelect]);

  // Active focus
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !activeId) return;
    const p = points.find((x) => x.id === activeId);
    if (!p) return;
    map.flyTo([p.lat, p.lng], 16, { duration: 0.6 });
    markersRef.current[p.id]?.openPopup();
  }, [activeId, points]);

  // Center to user
  useEffect(() => {
    if (centerSignal === undefined) return;
    mapRef.current?.flyTo([user.lat, user.lng], 15, { duration: 0.6 });
  }, [centerSignal, user.lat, user.lng]);

  return <div ref={containerRef} className="absolute inset-0" />;
}
