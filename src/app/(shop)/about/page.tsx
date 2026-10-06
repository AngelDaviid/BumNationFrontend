import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BrandLogo } from "@/components/shop/brand-divider";

export const metadata: Metadata = {
  title: "Sobre nosotros | Bum Nation",
  description: "Conoce Bum Nation: gimnasio y tienda de suplementación deportiva.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto w-full max-w-3xl space-y-8 px-4 py-6 sm:px-6 sm:py-8">
      <header className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-widest text-brand-text">Sobre nosotros</p>
        <h1 className="text-3xl font-bold text-zinc-900 sm:text-4xl">Bum Nation</h1>
        <p className="text-base text-zinc-600">
          Somos un gimnasio y una tienda de suplementación deportiva. Te acompañamos en el entrenamiento y te
          ayudamos a elegir los productos que necesitas para rendir al máximo.
        </p>
      </header>

      <section className="space-y-3 rounded-3xl bg-zinc-900 px-6 py-8 sm:px-10">
        <BrandLogo logo="performance" className="h-12 sm:h-16" />
        <p className="text-sm text-zinc-300 sm:text-base">
          En la tienda encuentras proteínas, creatinas, pre-entrenos y más, con el stock
          actualizado.
        </p>
      </section>

      <Button asChild className="h-10 px-5">
        <Link href="/products">Ver productos</Link>
      </Button>
    </div>
  );
}
