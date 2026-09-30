import Image from "next/image";
import { cn } from "@/lib/utils/utils";

// El SVG trae mucho espacio vacío alrededor; estos porcentajes recortan
// justo el logo (caja de 548×164 dentro del lienzo de 653×435)
const CROP = { width: "119.16%", left: "-6.02%", top: "-78.05%" };

export function SuplementacionLogo({ className }: { className?: string }) {
  return (
    <div className={cn("relative aspect-[548/164] overflow-hidden", className)}>
      <Image
        src="/SuplementacionDeportiva.svg"
        alt="Suplementación deportiva"
        width={653}
        height={435}
        className="absolute h-auto max-w-none"
        style={CROP}
      />
    </div>
  );
}

interface BrandSectionProps {
  children: React.ReactNode;
  className?: string;
}

// Panel gris con el logo montado sobre el borde, como separador de secciones
export function BrandSection({ children, className }: BrandSectionProps) {
  return (
    <section className={cn("relative mt-12 rounded-3xl bg-zinc-200/70 px-3 pt-12 pb-6 sm:mt-16 sm:px-6 sm:pt-16 sm:pb-8 lg:px-8", className)}>
      <SuplementacionLogo className="absolute top-0 left-6 h-14 -translate-y-1/2 drop-shadow-md sm:left-12 sm:h-20 lg:left-16 lg:h-24" />
      {children}
    </section>
  );
}
