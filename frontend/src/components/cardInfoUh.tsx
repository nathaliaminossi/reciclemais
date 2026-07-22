import { Recycle, Trophy, Leaf } from "lucide-react";

export default function CardInfoUh() {
  return (
    <div className="flex flex-wrap gap-3">
      <div className="flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 transition-all hover:shadow-md">
        <Recycle size={18} className="text-emerald-700" />
        <span className="text-sm font-medium text-emerald-900">
          Coletas realizadas
        </span>
      </div>

      <div className="flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-4 py-2 transition-all hover:shadow-md">
        <Trophy size={18} className="text-amber-600" />
        <span className="text-sm font-medium text-amber-900">
         Materiais enviados
        </span>
      </div>

      <div className="flex items-center gap-2 rounded-full border border-sky-200 bg-sky-50 px-4 py-2 transition-all hover:shadow-md">
        <Leaf size={18} className="text-sky-700" />
        <span className="text-sm font-medium text-sky-900">
          Impacto sustentável
        </span>
      </div>
    </div>
  );
}