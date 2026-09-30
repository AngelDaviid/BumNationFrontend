import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BrandLogo } from "@/components/shop/brand-divider";
import { Category } from "@/types";

interface ShopHeroProps {
  categories: Category[];
  buildCategoryHref: (categoryId?: string) => string;
}

// Banner de bienvenida; cuando haya foto del gym puede ir a la derecha o de fondo
export function ShopHero({ categories, buildCategoryHref }: ShopHeroProps) {
  const featured = categories.slice(0, 3);

  return (
    <section className="relative overflow-hidden rounded-3xl bg-zinc-900 px-6 py-8 sm:px-10 sm:py-12">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 -right-16 size-72 rounded-full bg-[#65C33A]/25 blur-3xl sm:size-96"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-32 -left-20 size-64 rounded-full bg-[#65C33A]/10 blur-3xl"
      />

      <div className="relative">
        <div className="space-y-4">
          <BrandLogo logo="performance" priority className="h-12 sm:h-16" />
          <h1 className="text-3xl font-bold leading-tight text-white sm:text-5xl">
            Todo para tu <span className="text-[#6BFF3C]">rendimiento</span>
          </h1>
          <p className="max-w-md text-sm text-zinc-300 sm:text-base">
            Proteínas, creatinas, pre-entrenos y todo lo que necesitas para entrenar al máximo.
          </p>

          <div className="flex flex-wrap gap-2 pt-1">
            <Button asChild className="h-10 bg-[#65C33A] px-5 font-semibold text-white hover:bg-[#58ad32]">
              <a href="#catalogo">
                Ver productos <ArrowRight />
              </a>
            </Button>
            {featured.map((category) => (
              <Button
                key={category.id}
                asChild
                variant="outline"
                className="h-10 border-zinc-700 bg-transparent px-4 text-zinc-200 hover:border-[#6BFF3C] hover:bg-transparent hover:text-[#6BFF3C]"
              >
                <Link href={buildCategoryHref(String(category.id))} scroll={false}>
                  {category.name}
                </Link>
              </Button>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
