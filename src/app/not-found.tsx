"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Store } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGoBack } from "@/hooks/use-go-back";

const BACKDROP_LOGOS = ["/SuplementacionDeportiva.webp", "/LogoPerformance.webp", "/Inventario.webp"];

export default function NotFound() {
  const goBack = useGoBack();

  return (
    <div className="relative flex min-h-dvh flex-1 items-center justify-center overflow-hidden bg-zinc-50 px-4 py-10">
      <div aria-hidden className="absolute inset-0 flex flex-col gap-8 p-6 sm:p-10">
        <div className="flex h-14 items-center justify-between rounded-2xl bg-white px-5 shadow-sm">
          <Image src="/LogoNegro.webp" alt="" width={120} height={40} className="h-8 w-auto" />
          <div className="hidden gap-6 sm:flex">
            <span className="h-3 w-16 rounded-full bg-zinc-200" />
            <span className="h-3 w-16 rounded-full bg-zinc-200" />
            <span className="h-3 w-16 rounded-full bg-zinc-200" />
          </div>
          <span className="h-8 w-8 rounded-full bg-[#6BFF3C]" />
        </div>
        {BACKDROP_LOGOS.map((src) => (
          <section key={src} className="relative rounded-3xl bg-zinc-200/70 px-6 pt-14 pb-6">
            <Image src={src} alt="" width={1200} height={400} className="absolute top-0 left-6 h-16 w-auto -translate-y-1/2 sm:h-20" />
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="flex flex-col gap-3 rounded-2xl bg-white p-3 shadow-sm">
                  <div className="aspect-square rounded-xl bg-zinc-100" />
                  <span className="h-3 w-3/4 rounded-full bg-zinc-200" />
                  <span className="h-3 w-1/3 rounded-full bg-[#6BFF3C]/70" />
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>

      <div className="absolute inset-0 bg-black/10 backdrop-blur-sm" />

      <main className="relative w-full max-w-md rounded-3xl bg-white p-8 text-center shadow-2xl sm:p-10">
        <Image src="/LogoNegro.webp" alt="BumNation GYM" width={150} height={150} className="mx-auto h-14 w-auto object-contain" priority />

        <p className="mt-6 -skew-x-6 text-8xl leading-none font-bold tracking-tight text-[#6BFF3C] drop-shadow-[4px_4px_0_#111] [-webkit-text-stroke:3px_#111] sm:text-9xl">
          404
        </p>

        <h1 className="mt-6 text-xl font-semibold text-zinc-800">Página no encontrada</h1>
        <p className="mt-2 text-sm text-zinc-500">
          La página que buscas no existe o fue movida. Revisa la dirección o vuelve a la tienda.
        </p>

        <div className="mt-8 flex flex-col-reverse gap-2 sm:flex-row sm:justify-center">
          <Button type="button" variant="outline" size="lg" onClick={goBack} className="gap-2">
            <ArrowLeft /> Volver atrás
          </Button>
          <Button asChild size="lg" className="gap-2 bg-[#6BFF3C] font-semibold text-black hover:bg-[#5de52f]">
            <Link href="/">
              <Store /> Volver a la tienda
            </Link>
          </Button>
        </div>
      </main>
    </div>
  );
}
