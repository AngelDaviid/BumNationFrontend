import Image from "next/image";
import { cn } from "@/lib/utils/utils";

const LOGOS = {
  suplementacion: {
    src: "/SuplementacionDeportiva.svg",
    alt: "Suplementación deportiva",
    width: 653,
    height: 435,
    aspect: "aspect-[548/164]",
    crop: { width: "119.16%", left: "-6.02%", top: "-78.05%" },
  },
  performance: {
    src: "/LogoPerformance.svg",
    alt: "BN Performance",
    width: 866,
    height: 489,
    aspect: "aspect-[701/236]",
    crop: { width: "123.54%", left: "-14.12%", top: "-58.9%" },
  },
} as const;

interface BrandLogoProps {
  logo: keyof typeof LOGOS;
  className?: string;
  priority?: boolean;
}

export function BrandLogo({ logo, className, priority }: BrandLogoProps) {
  const { src, alt, width, height, aspect, crop } = LOGOS[logo];
  return (
    <div className={cn("relative overflow-hidden", aspect, className)}>
      <Image src={src} alt={alt} width={width} height={height} priority={priority} className="absolute h-auto max-w-none" style={crop} />
    </div>
  );
}

interface BrandSectionProps {
  children: React.ReactNode;
  className?: string;
}

export function BrandSection({ children, className }: BrandSectionProps) {
  return (
    <section className={cn("relative mt-12 rounded-3xl bg-zinc-200/70 px-3 pt-12 pb-6 sm:mt-16 sm:px-6 sm:pt-16 sm:pb-8 lg:px-8", className)}>
      <BrandLogo logo="suplementacion" className="absolute top-0 left-6 h-14 -translate-y-1/2 drop-shadow-md sm:left-12 sm:h-20 lg:left-16 lg:h-24" />
      {children}
    </section>
  );
}
