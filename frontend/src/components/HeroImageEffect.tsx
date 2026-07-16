import { Recycle, Leaf, Award, Gift, type LucideIcon } from "lucide-react";

/*
  Anatomia do efeito (3 camadas empilhadas com z-index):

  1) GLOW  -> círculo grande com radial-gradient + blur, atrás de tudo (z-0)
  2) FOTO  -> imagem PNG com fundo transparente, centralizada (z-10)
  3) BADGES + CARD -> ícones circulares soltos e um cartão de destaque,
     posicionados em "absolute" sobre a borda do círculo (z-20)

  O truque todo está em: um container pai com position: relative,
  e cada camada usando position: absolute + top/left em %.
  Assim, quando o container muda de tamanho (responsivo), tudo
  se move junto, proporcionalmente.
*/

interface FloatingBadgeProps {
  icon: LucideIcon;
  top: string;
  left: string;
  delay?: number;
  size?: number;
}

// Badge circular flutuante (o ícone pequeno "solto" ao redor da imagem)
function FloatingBadge({ icon: Icon, top, left, delay = 0, size = 44 }: FloatingBadgeProps) {
  return (
    <div
      className="absolute flex items-center justify-center rounded-full bg-white shadow-lg"
      style={{
        top,
        left,
        width: size,
        height: size,
        animation: `float 3s ease-in-out ${delay}s infinite`,
      }}
    >
      <Icon className="text-emerald-600" size={size * 0.45} />
    </div>
  );
}

export default function HeroImageEffect() {
  return (
    <div className="w-full flex items-center justify-center p-10 pl-50">
      {/* Container relativo: raiz de todo o posicionamento absoluto */}
      <div className="relative" style={{ width: 420, height: 420 }}>
        {/* 1) GLOW — círculo suave atrás da imagem */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(255,255,255,1) 0%, rgba(236,253,245,1) 55%, rgba(236,253,245,0) 75%)",
            boxShadow: "0 20px 60px rgba(16,185,129,0.15)",
          }}
        />

        {/* 2) FOTO — troque este bloco pela sua <img src="..." /> com PNG transparente */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-64 h-64 rounded-full bg-emerald-100 flex items-center justify-center">
            <Recycle className="text-emerald-600" size={96} />
             <img src="src/imgs/Recycling-amico.png" className="w-72 drop-shadow-xl" alt="" /> 
          </div>
        </div>

        {/* 3) BADGES flutuantes — cada um "gruda" numa % diferente da borda */}
        <FloatingBadge icon={Leaf} top="6%" left="10%" delay={0} />
        <FloatingBadge icon={Award} top="12%" left="78%" delay={0.6} />
        <FloatingBadge icon={Gift} top="80%" left="82%" delay={1.2} />

        {/* Cartão de destaque — sobrepõe a borda inferior esquerda do círculo */}
        <div
          className="absolute flex items-center gap-3 bg-white rounded-xl shadow-xl px-4 py-3"
          style={{ bottom: "8%", left: "-8%", width: 220 }}
        >
          <div className="w-9 h-9 rounded-lg bg-emerald-100 flex items-center justify-center shrink-0">
            <Award className="text-emerald-600" size={18} />
          </div>
          <div>
            <p className="text-sm font-medium text-neutral-800 leading-tight">
              Conquista desbloqueada
            </p>
            <p className="text-xs text-neutral-500 leading-tight">
              +50 pontos essa semana
            </p>
          </div>
        </div>
      </div>

      {/* Keyframe do "flutuar" — sobe e desce suavemente, em loop */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
      `}</style>
    </div>
  );
}