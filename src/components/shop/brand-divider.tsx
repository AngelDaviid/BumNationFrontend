import Image from "next/image";
import { cn } from "@/lib/utils/utils";

const LOGOS = {
  suplementacion: {
    src: "/SuplementacionDeportiva.webp",
    alt: "Suplementación deportiva",
    width: 1200,
    height: 359,
  },
  inventario: {
    src: "/Inventario.webp",
    alt: "Inventario",
    width: 1200,
    height: 400,
  },
  performance: {
    src: "/LogoPerformance.webp",
    alt: "BN Performance",
    width: 1200,
    height: 404,
  },
} as const;

interface BrandLogoProps {
  logo: keyof typeof LOGOS;
  className?: string;
  priority?: boolean;
}

export function BrandLogo({ logo, className, priority }: BrandLogoProps) {
  const { src, alt, width, height } = LOGOS[logo];
  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      loading={priority ? "eager" : undefined}
      sizes="(max-width: 640px) 200px, 400px"
      className={cn("w-auto", className)}
    />
  );
}

interface BrandSectionProps {
  children: React.ReactNode;
  logo?: keyof typeof LOGOS;
  className?: string;
}

export function BrandSection({ children, logo = "suplementacion", className }: BrandSectionProps) {
  return (
    <section className={cn("relative mt-12 rounded-3xl bg-zinc-200/70 px-3 pt-12 pb-6 sm:mt-16 sm:px-6 sm:pt-16 sm:pb-8 lg:px-8", className)}>
      <BrandLogo logo={logo} className="absolute top-0 left-6 h-14 -translate-y-1/2 drop-shadow-md sm:left-12 sm:h-20 lg:left-16 lg:h-24" />
      {children}
    </section>
  );
}
